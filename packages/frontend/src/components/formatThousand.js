export default function FormatThousands(number) {
  let formattedSum;

  if (number > 10000) {
    return (formattedSum = Intl.NumberFormat({
      style: "currency",
      currency: "SGD",
    }).format(number));
  } else {
    return (formattedSum = number);
  }
}
