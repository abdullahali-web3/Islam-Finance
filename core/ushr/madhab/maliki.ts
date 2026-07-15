import { NISAB_KG } from '../constants';
import type { UshrRuleModule } from './types';

/** Maliki: ʿushr only once the harvest reaches the 5-awsuq niṣāb (~653 kg). */
export const maliki: UshrRuleModule = { school: 'maliki', requiresNisab: true, nisabKg: NISAB_KG };
