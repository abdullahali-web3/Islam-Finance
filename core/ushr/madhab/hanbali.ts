import { NISAB_KG } from '../constants';
import type { UshrRuleModule } from './types';

/** Hanbali: ʿushr only once the harvest reaches the 5-awsuq niṣāb (~653 kg). */
export const hanbali: UshrRuleModule = { school: 'hanbali', requiresNisab: true, nisabKg: NISAB_KG };
