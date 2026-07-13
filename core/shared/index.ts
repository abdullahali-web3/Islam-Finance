// Public surface of core/shared — value types every calculator can depend on. UI and features
// import from here, never from internal files directly.
export {
  SUPPORTED_CURRENCIES,
  MixedCurrencyError,
  isCurrencyCode,
  money,
  isSameCurrency,
  addMoney,
  sumMoney,
  formatMoney,
  type CurrencyCode,
  type Money,
} from './money';
