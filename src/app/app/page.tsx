"use client";

import AppShell from "@/components/layout/AppShell";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function AppPage() {
  return (
    <>
      <OnboardingModal />
      <AppShell />
    </>
  );
}
