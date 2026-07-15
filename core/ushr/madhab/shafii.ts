import { NISAB_KG } from '../constants';
import type { UshrRuleModule } from './types';

/** Shafiʿi: ʿushr only once the harvest reaches the 5-awsuq niṣāb (~653 kg). */
export const shafii: UshrRuleModule = { school: 'shafii', requiresNisab: true, nisabKg: NISAB_KG };
