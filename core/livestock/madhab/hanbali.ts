import type { LivestockRuleModule } from './types';

/** Hanbali: grazing required, working animals exempt, paid in-kind. */
export const hanbali: LivestockRuleModule = {
  school: 'hanbali',
  requiresGrazing: true,
  exemptsWorkingAnimals: true,
  valuePaymentAllowed: false,
};
