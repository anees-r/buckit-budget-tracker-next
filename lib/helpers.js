import Currencies from "./currencies";

export const DateToUTCDate = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  );
};

export const GetFormatterForCurrency = (currency) => {
  const locale = Currencies.find(c => c.value === currency)?.locale;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  })
}
