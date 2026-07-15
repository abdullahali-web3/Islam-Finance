import type { LivestockRuleModule } from './types';

/** Shafiʿi: grazing required, working animals exempt, paid in-kind (cash a contemporary accommodation). */
export const shafii: LivestockRuleModule = {
  school: 'shafii',
  requiresGrazing: true,
  exemptsWorkingAnimals: true,
  valuePaymentAllowed: false,
};
