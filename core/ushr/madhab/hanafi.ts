import { NISAB_KG } from '../constants';
import type { UshrRuleModule } from './types';

/** Hanafi (Abū Ḥanīfa): no niṣāb — ʿushr is due on any quantity of produce (D2). */
export const hanafi: UshrRuleModule = { school: 'hanafi', requiresNisab: false, nisabKg: NISAB_KG };
