"use client";

import { create } from "zustand";
import { ChatMessage, ParsedResume, Application, Chip, Session } from "@/lib/types";

interface QuietlyState {
  // Session
  session: Session | null;
  setSession: (session: Session) => void;

  // Resume
  resume: ParsedResume | null;
  setResume: (resume: ParsedResume) => void;

  // Blocked employers
  blockedEmployers: string[];
  addBlockedEmployer: (name: string) => void;
  removeBlockedEmployer: (name: string) => void;

  // Salary floor
  salaryFloor: number;
  setSalaryFloor: (floor: number) => void;

  // Chat messages
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;

  // Tracker
  applications: Application[];
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  removeApplication: (id: string) => void;

  // UI
  isStreaming: boolean;
  setIsStreaming: (v: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (v: boolean) => void;
  mobileView: "chat" | "tracker";
  setMobileView: (v: "chat" | "tracker") => void;
  chips: Chip[];
  setChips: (chips: Chip[]) => void;
}

export const useQuietlyStore = create<QuietlyState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),

  resume: null,
  setResume: (resume) => set({ resume }),

  blockedEmployers: [],
  addBlockedEmployer: (name) =>
    set((s) => ({ blockedEmployers: [...s.blockedEmployers, name] })),
  removeBlockedEmployer: (name) =>
    set((s) => ({
      blockedEmployers: s.blockedEmployers.filter((e) => e !== name),
    })),

  salaryFloor: 0,
  setSalaryFloor: (salaryFloor) => set({ salaryFloor }),

  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateLastAssistantMessage: (content) =>
    set((s) => {
      const msgs = [...s.messages];
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === "assistant") {
          msgs[i] = { ...msgs[i], content };
          break;
        }
      }
      return { messages: msgs };
    }),

  applications: [],
  setApplications: (applications) => set({ applications }),
  addApplication: (app) =>
    set((s) => ({ applications: [app, ...s.applications] })),
  updateApplication: (id, updates) =>
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      ),
    })),
  removeApplication: (id) =>
    set((s) => ({
      applications: s.applications.filter((a) => a.id !== id),
    })),

  isStreaming: false,
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  showOnboarding: true,
  setShowOnboarding: (showOnboarding) => set({ showOnboarding }),
  mobileView: "chat",
  setMobileView: (mobileView) => set({ mobileView }),
  chips: [],
  setChips: (chips) => set({ chips }),
}));
