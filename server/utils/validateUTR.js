export const isValidUTR = (utr) => {
  return /^[0-9]{10,22}$/.test(utr);
};