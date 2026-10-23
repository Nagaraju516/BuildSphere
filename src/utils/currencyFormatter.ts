export const formatIndianRupees = (amount: number, compact: boolean = false): string => {
  if (compact) {
    if (amount >= 10000000) {
      return â‚¹  Cr;
    }
    if (amount >= 100000) {
      return â‚¹  L;
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
