export interface InvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const calculateTaxBreakdown = (subtotal: number) => {
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const grandTotal = subtotal + cgst + sgst;
  return { subtotal, cgst, sgst, grandTotal };
};
