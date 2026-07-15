import type { LivestockRuleModule } from './types';

/**
 * Maliki: the distinctive school here — zakat is due whether the herd grazes or is fodder-fed, and
 * working animals are NOT exempt (D2, D3). Paid in-kind.
 */
export const maliki: LivestockRuleModule = {
  school: 'maliki',
  requiresGrazing: false,
  exemptsWorkingAnimals: false,
  valuePaymentAllowed: false,
};
