"use client";

import { create } from "zustand";
import { ParsedResume, Match, OutreachEntry, DashboardStats } from "@/lib/types";

interface QuietlyState {
  // Profile
  userId: string | null;
  setUserId: (id: string) => void;
  fullName: string;
  setFullName: (name: string) => void;

  // Resume
  resume: ParsedResume | null;
  setResume: (resume: ParsedResume) => void;

  // Preferences
  targetTitles: string[];
  setTargetTitles: (titles: string[]) => void;
  targetLocations: string[];
  setTargetLocations: (locations: string[]) => void;
  blockedEmployers: string[];
  addBlockedEmployer: (name: string) => void;
  removeBlockedEmployer: (name: string) => void;
  setBlockedEmployers: (employers: string[]) => void;
  salaryFloor: number;
  setSalaryFloor: (floor: number) => void;
  jobType: string;
  setJobType: (type: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;

  // Matches
  matches: Match[];
  setMatches: (matches: Match[]) => void;

  // Outreach
  outreach: OutreachEntry[];
  setOutreach: (entries: OutreachEntry[]) => void;

  // Stats
  stats: DashboardStats;
  setStats: (stats: DashboardStats) => void;

  // UI
  showOnboarding: boolean;
  setShowOnboarding: (v: boolean) => void;
}

export const useQuietlyStore = create<QuietlyState>((set) => ({
  userId: null,
  setUserId: (userId) => set({ userId }),
  fullName: "",
  setFullName: (fullName) => set({ fullName }),

  resume: null,
  setResume: (resume) => set({ resume }),

  targetTitles: [],
  setTargetTitles: (targetTitles) => set({ targetTitles }),
  targetLocations: [],
  setTargetLocations: (targetLocations) => set({ targetLocations }),
  blockedEmployers: [],
  addBlockedEmployer: (name) =>
    set((s) => ({ blockedEmployers: [...s.blockedEmployers, name] })),
  removeBlockedEmployer: (name) =>
    set((s) => ({
      blockedEmployers: s.blockedEmployers.filter((e) => e !== name),
    })),
  setBlockedEmployers: (blockedEmployers) => set({ blockedEmployers }),
  salaryFloor: 0,
  setSalaryFloor: (salaryFloor) => set({ salaryFloor }),
  jobType: "full-time",
  setJobType: (jobType) => set({ jobType }),
  isActive: true,
  setIsActive: (isActive) => set({ isActive }),

  matches: [],
  setMatches: (matches) => set({ matches }),

  outreach: [],
  setOutreach: (outreach) => set({ outreach }),

  stats: { totalMatches: 0, newMatches: 0, outreachSent: 0, responses: 0, introsMade: 0 },
  setStats: (stats) => set({ stats }),

  showOnboarding: true,
  setShowOnboarding: (showOnboarding) => set({ showOnboarding }),
}));
