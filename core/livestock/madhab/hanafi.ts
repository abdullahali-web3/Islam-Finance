import type { LivestockRuleModule } from './types';

/** Hanafi: grazing required, working animals exempt, and the cash value may be paid (D4). */
export const hanafi: LivestockRuleModule = {
  school: 'hanafi',
  requiresGrazing: true,
  exemptsWorkingAnimals: true,
  valuePaymentAllowed: true,
};
