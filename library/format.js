const dollarFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const commaFormatter = new Intl.NumberFormat();

module.exports = {
  dollars: (intValue) => dollarFormatter.format(intValue),
  commas: (number) => commaFormatter.format(number),
}