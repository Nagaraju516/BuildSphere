export const matchesQuery = (text: string, query: string): boolean => {
  if (!query.trim()) return true;
  return text.toLowerCase().includes(query.toLowerCase().trim());
};
