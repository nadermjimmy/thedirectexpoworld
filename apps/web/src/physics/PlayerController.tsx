import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { RigidBody, CapsuleCollider, useRapier } from "@react-three/rapier";
import type { RapierRigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import { useKeyboard } from "./useKeyboard";

/**
 * Minimal structural view of Rapier's KinematicCharacterController.
 * Declared locally so we don't have to import @dimforge/rapier3d-compat
 * directly (it's a transitive dep, not a direct one under pnpm).
 */
interface CharacterController {
  enableAutostep(maxHeight: number, minWidth: number, includeDynamic: boolean): void;
  enableSnapToGround(distance: number): void;
  setApplyImpulsesToDynamicBodies(enabled: boolean): void;
  setSlideEnabled(enabled: boolean): void;
  computeColliderMovement(collider: unknown, desired: { x: number; y: number; z: number }): void;
  computedMovement(): { x: number; y: number; z: number };
  computedGrounded(): boolean;
}

export interface PlayerControllerProps {
  /** Walk mode active — gates input, the frame loop and pointer lock. */
  enabled: boolean;
  /** Spawn position (capsule centre). Defaults to the entrance, facing the hall. */
  spawn?: [number, number, number];
  /** Ground movement speed in m/s. */
  speed?: number;
  /** Speed multiplier while holding Shift. */
  runMultiplier?: number;
  /** Capsule radius. */
  radius?: number;
  /** Capsule cylinder half-height (excludes the two hemispherical caps). */
  halfHeight?: number;
}

// Re-used scratch vectors so the frame loop allocates nothing.
const forwardDir = new Vector3();
const rightDir = new Vector3();
const moveDir = new Vector3();
const UP = new Vector3(0, 1, 0);

const GRAVITY = -22; // a touch heavier than real g for snappy, game-like falls

/**
 * First-person walkthrough controller.
 *
 * A kinematic capsule driven by Rapier's KinematicCharacterController gives
 * proper collide-and-slide against every static collider in the hall: the
 * player walks naturally but can never pass through walls, booths or
 * furniture, nor leave the enclosed exhibition area. WASD / arrow keys move
 * relative to where the camera looks; PointerLockControls supplies mouse look.
 */
export function PlayerController({
  enabled,
  spawn = [0, 0.9, 24],
  speed = 4.2,
  runMultiplier = 1.8,
  radius = 0.3,
  halfHeight = 0.6,
}: PlayerControllerProps) {
  const { world } = useRapier();
  const { camera } = useThree();
  const bodyRef = useRef<RapierRigidBody>(null);
  const controllerRef = useRef<CharacterController | null>(null);
  const keys = useKeyboard(enabled);
  const vy = useRef(0); // vertical velocity (m/s)
  const eyeOffset = halfHeight + radius * 0.9; // capsule centre → eye

  // Create / destroy the Rapier character controller alongside this component.
  useEffect(() => {
    const controller = world.createCharacterController(0.01) as unknown as CharacterController;
    controller.enableAutostep(0.4, 0.2, true); // step over low ledges (kerbs, pads)
    controller.enableSnapToGround(0.4); // stay glued to the floor on dips
    controller.setApplyImpulsesToDynamicBodies(true);
    controller.setSlideEnabled(true); // slide along walls instead of stopping dead
    controllerRef.current = controller;
    return () => {
      // Cast: removeCharacterController exists on the raw world.
      (world as unknown as { removeCharacterController(c: unknown): void }).removeCharacterController(
        controller,
      );
      controllerRef.current = null;
    };
  }, [world]);

  // On entering walk mode, place the camera at the spawn and look into the hall.
  useEffect(() => {
    if (!enabled) return;
    camera.position.set(spawn[0], spawn[1] + eyeOffset, spawn[2]);
    camera.lookAt(spawn[0], spawn[1] + eyeOffset, spawn[2] - 1);
    bodyRef.current?.setNextKinematicTranslation({ x: spawn[0], y: spawn[1], z: spawn[2] });
    vy.current = 0;
  }, [enabled, camera, spawn, eyeOffset]);

  useFrame((_, rawDelta) => {
    const body = bodyRef.current;
    const controller = controllerRef.current;
    if (!enabled || !body || !controller) return;

    // Clamp delta so a tab-out / long frame can't fling the player through geometry.
    const dt = Math.min(rawDelta, 0.05);

    // --- horizontal intent, relative to camera yaw (flattened onto the floor) ---
    camera.getWorldDirection(forwardDir);
    forwardDir.y = 0;
    forwardDir.normalize();
    rightDir.crossVectors(forwardDir, UP).normalize();

    moveDir.set(0, 0, 0);
    const k = keys.current;
    if (k.forward) moveDir.add(forwardDir);
    if (k.backward) moveDir.sub(forwardDir);
    if (k.right) moveDir.add(rightDir);
    if (k.left) moveDir.sub(rightDir);

    const planarSpeed = speed * (k.run ? runMultiplier : 1);
    if (moveDir.lengthSq() > 0) moveDir.normalize().multiplyScalar(planarSpeed * dt);

    // --- gravity / jump ---
    const grounded = controller.computedGrounded();
    if (grounded && vy.current <= 0) {
      vy.current = -0.5 * dt; // small downward bias keeps snap-to-ground engaged
      if (k.jump) vy.current = 7; // jump impulse
    } else {
      vy.current += GRAVITY * dt;
    }

    // --- collide-and-slide solve ---
    const collider = body.collider(0);
    controller.computeColliderMovement(collider, {
      x: moveDir.x,
      y: vy.current * dt,
      z: moveDir.z,
    });
    const corrected = controller.computedMovement();

    const t = body.translation();
    const next = { x: t.x + corrected.x, y: t.y + corrected.y, z: t.z + corrected.z };
    body.setNextKinematicTranslation(next);

    // Camera rides the capsule at eye height (rotation is owned by PointerLock).
    camera.position.set(next.x, next.y + eyeOffset, next.z);
  });

  return (
    <>
      <RigidBody
        ref={bodyRef}
        type="kinematicPosition"
        colliders={false}
        position={spawn}
        enabledRotations={[false, false, false]}
        ccd
      >
        <CapsuleCollider args={[halfHeight, radius]} />
      </RigidBody>
      {enabled && <PointerLockControls makeDefault />}
    </>
  );
}
