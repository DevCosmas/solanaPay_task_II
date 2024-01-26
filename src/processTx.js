import dotenv from 'dotenv';
dotenv.config();
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { parseURL } from '@solana/pay';
import BigNumber from 'bignumber.js';
import bs58 from 'bs58';
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export default async function processPayment(url, payer) {
  const priKeyBuffer = Buffer.from(bs58.decode(process.env.SECRET_KEY2));
  const priKeyHex = priKeyBuffer.toString('hex');
  const payerKeypair = Keypair.fromSecretKey(Buffer.from(priKeyHex, 'hex'));

  console.log('2. Parse the payment request link');
  const { recipient, amount, reference, label, message } = parseURL(url);
  console.log(parseURL(url));
  if (!recipient || !amount || !reference)
    throw new Error('Invalid payment request link');

  console.log('3. Assemble the transaction');
  const tx = new Transaction();

  const ix = SystemProgram.transfer({
    fromPubkey: payerKeypair.publicKey,
    toPubkey: recipient,
    lamports: amount
      .multipliedBy(LAMPORTS_PER_SOL)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toNumber(),
  });
  if (reference) {
    const ref = Array.isArray(reference) ? reference : [reference];
    for (const pubkey of ref) {
      ix.keys.push({ pubkey, isWritable: false, isSigner: false });
    }
  }

  tx.add(ix);

  
  console.log(' 🚀 Send and Confirm Transaction');
  const txId = await sendAndConfirmTransaction(connection, tx, [payerKeypair]);
  console.log(
    `      Tx: https://explorer.solana.com/tx/${txId}?cluster=devnet`
  );
}
