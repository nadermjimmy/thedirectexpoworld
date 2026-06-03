import { useEffect, useRef } from "react";

export interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
  jump: boolean;
}

const CODE_MAP: Record<string, keyof MovementState> = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "backward",
  ArrowDown: "backward",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  ShiftLeft: "run",
  ShiftRight: "run",
  Space: "jump",
};

/**
 * Tracks WASD / arrow / shift / space input in a ref (no re-renders), so the
 * physics loop can read the latest movement state every frame. `enabled`
 * gates the listeners so keys are ignored outside walk mode.
 */
export function useKeyboard(enabled: boolean) {
  const state = useRef<MovementState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    jump: false,
  });

  useEffect(() => {
    if (!enabled) {
      // Clear any keys held when leaving walk mode.
      state.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        run: false,
        jump: false,
      };
      return;
    }

    const set = (code: string, value: boolean) => {
      const key = CODE_MAP[code];
      if (key) state.current[key] = value;
    };
    const onDown = (e: KeyboardEvent) => set(e.code, true);
    const onUp = (e: KeyboardEvent) => set(e.code, false);
    // Reset on blur so the player doesn't keep drifting if focus is lost.
    const onBlur = () => {
      state.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        run: false,
        jump: false,
      };
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [enabled]);

  return state;
}
