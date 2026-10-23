export const isValidIndianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-+]/g, '');
  return /^(91)?[6-9]\d{9}$/.test(cleaned);
};

export const isValidIndianPincode = (pincode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
};

export const isValidGSTIN = (gstin: string): boolean => {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin.trim());
};
