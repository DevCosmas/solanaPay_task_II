require('dotenv').config();
import { findReference, validateTransfer } from '@solana/pay';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

const AppError = require('./appError');

const connection = new Connection(process.env.SOLANA_CONNECTION, 'confirmed');

export default async function verifyTransaction(reference) {
  if (!reference) {
    new AppError('Payment request not found', 400);
  }

  try {
    const referencePublicKey = new PublicKey(reference).toBase58();
    const findRefObj = await Transaction.findOne({ ref: referencePublicKey });

    if (!findRefObj) {
      new AppError('Payment request not found!', 400);
      return null;
    } else {
      const found = await findReference(connection, new PublicKey(reference));
      console.log('Found Transaction Signature:', found.signature);
      const response = await validateTransfer(
        connection,
        found.signature,
        {
          recipient: new PublicKey(findRefObj.recipient),
          amount: new BigNumber(findRefObj.amountInSol),
          reference,
        },
        { commitment: 'confirmed' }
      );
      if (response) {
        console.log('Transaction validated successfully!');
      } else {
        console.log('Transaction validation failed.');
      }

      return response;
    }
  } catch (error) {
    new AppError(err, err.statusCode);
  }
}
