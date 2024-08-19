import { encodeURL } from '@solana/pay';

const generateUrl = (recipient, amount, reference, label, message) => {
  const url = encodeURL({
    recipient,
    amount,
    reference,
    label,
    message,
  });
  return url;
};
export default generateUrl;
