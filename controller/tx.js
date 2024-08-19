import { PublicKey, Keypair } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import AppError from '../utils/appError.js';
import Transaction from '../model/tx.js';
import verifyTransaction from '../utils/verify.js';
import generateUrl from '../utils/generateQr.js';

// export async function verifyTxController(req, res, next) {
//   try {
//     const { reference } = req.query;
//     if (!reference) {
//       return next(new AppError('No or invalid Tx Reference', 400));
//     }

//     const referencePublicKey = new PublicKey(reference);
//     await verifyTransaction(referencePublicKey);

//     res.json({
//       status: 'success',
//       message: 'Your transaction is now verified',
//     });
//   } catch (err) {
//     next(new AppError(err, 500));
//   }
// }

export async function verifyTxController(req, res, next) {
  try {
    const { reference } = req.query;

    // Validate reference
    if (!reference) {
      return next(new AppError('No or invalid Tx Reference', 400));
    }

    // Verify reference is a valid PublicKey
    let referencePublicKey;
    try {
      referencePublicKey = new PublicKey(reference);
    } catch (error) {
      return next(new AppError('Invalid PublicKey format', 400));
    }

    // Verify transaction
    await verifyTransaction(referencePublicKey);

    res.json({
      status: 'success',
      message: 'Your transaction is now verified',
    });
  } catch (err) {
    console.error('Error verifying transaction:', err);
    next(new AppError(err || 'Internal Server Error', 500));
  }
}
export async function generateQRController(req, res, next) {
  try {
    const ref = new Keypair().publicKey;
    const currentSolPrice = 88.07;

    const body = req.body;
    if (!body.message || !body.price || !body.wallet || !body.label) {
      return next(new AppError('Invalid input', 400));
    }

    const { message, price, wallet, label } = body;
    const totalPrice = price;
    let amount = totalPrice / currentSolPrice;
    amount = Number(amount.toFixed(5));
    if (amount < 0) {
      return next(new AppError('Amount should not be a negative value', 400));
    }

    const recipient = new PublicKey(wallet);
    const amountInSol = new BigNumber(amount);

    const newURL = await generateUrl(
      recipient,
      amountInSol,
      ref,
      label,
      message
    );

    const storedRef = new Transaction({
      ref,
      id: Math.floor(Math.random() * 1000000 + 1),
      recipient,
      amountInSol: amountInSol.toString(),
      label,
      message,
    });

    await storedRef.save();

    res.json({
      status: 'success',
      message: 'Generated Solana URL',
      ref,
      newURL,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
}
