import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';

/** First-run onboarding route. Reached via the guard in (tabs)/_layout when `onboarded` is false. */
export default function OnboardingScreen() {
  return <OnboardingFlow />;
}
