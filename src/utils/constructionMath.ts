export const calculateCementRequirement = (areaSqFt: number): number => {
  return Math.round(areaSqFt * 0.42);
};

export const calculateSteelRequirement = (areaSqFt: number): number => {
  return Number((areaSqFt * 0.0035).toFixed(2));
};

export const calculateSandRequirement = (areaSqFt: number): number => {
  return Number((areaSqFt * 0.045).toFixed(2));
};

export const calculateAggregateRequirement = (areaSqFt: number): number => {
  return Number((areaSqFt * 0.038).toFixed(2));
};

export const estimateCostByTier = (
  areaSqFt: number,
  tier: 'standard' | 'premium' | 'luxury'
): number => {
  const rate = tier === 'standard' ? 1850 : tier === 'premium' ? 2300 : 2950;
  return areaSqFt * rate;
};
