import { create } from "zustand";
import {
  Developer,
  Visitor,
  WaitlistEntry,
  Notification,
  RepStatus,
} from "@/types";
import { generateMockDevelopers } from "@/data/mockData";

interface ExpoState {
  visitor: Visitor | null;
  developers: Developer[];
  selectedDeveloper: Developer | null;
  waitlist: WaitlistEntry[];
  notifications: Notification[];
  showNotificationPanel: boolean;
  isAdmin: boolean;

  setVisitor: (visitor: Visitor) => void;
  selectDeveloper: (developer: Developer | null) => void;
  toggleRepStatus: (developerId: string, repId: string) => void;
  setRepStatus: (
    developerId: string,
    repId: string,
    status: RepStatus
  ) => void;
  joinWaitlist: (developerId: string) => void;
  removeFromWaitlist: (developerId: string) => void;
  addNotification: (message: string, developerId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  toggleNotificationPanel: () => void;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  updateDeveloper: (developerId: string, updates: Partial<Developer>) => void;
}

export const useExpoStore = create<ExpoState>((set, get) => ({
  visitor: null,
  developers: generateMockDevelopers(),
  selectedDeveloper: null,
  waitlist: [],
  notifications: [],
  showNotificationPanel: false,
  isAdmin: false,

  setVisitor: (visitor) => set({ visitor }),

  selectDeveloper: (developer) => set({ selectedDeveloper: developer }),

  toggleRepStatus: (developerId, repId) =>
    set((state) => ({
      developers: state.developers.map((dev) => {
        if (dev.id !== developerId) return dev;
        return {
          ...dev,
          reps: dev.reps.map((rep) => {
            if (rep.id !== repId) return rep;
            const next: RepStatus =
              rep.status === "available"
                ? "in-meeting"
                : rep.status === "in-meeting"
                  ? "offline"
                  : "available";

            if (next === "available") {
              const waitlistEntry = state.waitlist.find(
                (w) => w.developerId === developerId
              );
              if (waitlistEntry) {
                setTimeout(() => {
                  const s = get();
                  s.addNotification(
                    `A rep at ${dev.name} is now available!`,
                    developerId
                  );
                  s.removeFromWaitlist(developerId);
                }, 100);
              }
            }

            return { ...rep, status: next };
          }) as [typeof dev.reps[0], typeof dev.reps[1]],
        };
      }),
      selectedDeveloper: (() => {
        const sel = state.selectedDeveloper;
        if (!sel || sel.id !== developerId) return sel;
        return {
          ...sel,
          reps: sel.reps.map((rep) => {
            if (rep.id !== repId) return rep;
            const next: RepStatus =
              rep.status === "available"
                ? "in-meeting"
                : rep.status === "in-meeting"
                  ? "offline"
                  : "available";
            return { ...rep, status: next };
          }) as [typeof sel.reps[0], typeof sel.reps[1]],
        };
      })(),
    })),

  setRepStatus: (developerId, repId, status) =>
    set((state) => ({
      developers: state.developers.map((dev) => {
        if (dev.id !== developerId) return dev;
        return {
          ...dev,
          reps: dev.reps.map((rep) =>
            rep.id === repId ? { ...rep, status } : rep
          ) as [typeof dev.reps[0], typeof dev.reps[1]],
        };
      }),
    })),

  joinWaitlist: (developerId) =>
    set((state) => {
      if (!state.visitor) return state;
      if (state.waitlist.some((w) => w.developerId === developerId))
        return state;
      return {
        waitlist: [
          ...state.waitlist,
          {
            visitorEmail: state.visitor.email,
            developerId,
            timestamp: Date.now(),
          },
        ],
      };
    }),

  removeFromWaitlist: (developerId) =>
    set((state) => ({
      waitlist: state.waitlist.filter((w) => w.developerId !== developerId),
    })),

  addNotification: (message, developerId) =>
    set((state) => ({
      notifications: [
        {
          id: `notif-${Date.now()}`,
          message,
          developerId,
          timestamp: Date.now(),
          read: false,
        },
        ...state.notifications,
      ],
      showNotificationPanel: true,
    })),

  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    })),

  toggleNotificationPanel: () =>
    set((state) => ({ showNotificationPanel: !state.showNotificationPanel })),

  loginAdmin: () => set({ isAdmin: true }),
  logoutAdmin: () => set({ isAdmin: false }),

  updateDeveloper: (developerId, updates) =>
    set((state) => ({
      developers: state.developers.map((dev) =>
        dev.id === developerId ? { ...dev, ...updates } : dev
      ),
    })),
}));
