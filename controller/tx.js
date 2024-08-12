import { PublicKey, Keypair } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import verifyTransaction from '../services/verifyTx.js';
import AppError from '../utils/appError.js';
import generateUrl from '../services/generateQr.js';
import Transaction from '../models/Transaction.js';

export const verifyTxController = async (req, res, next) => {
  try {
    const { reference } = req.query;
    if (!reference) {
      return next(new AppError('No or invalid Tx Reference', 400));
    }

    const referencePublicKey = new PublicKey(reference);
    await verifyTransaction(referencePublicKey);

    res.json({
      status: 'success',
      message: 'Your transaction is now verified',
    });
  } catch (err) {
    next(new AppError(err.message, err.statusCode || 500));
  }
};

export const generateQRController = async (req, res, next) => {
  try {
    const ref = new Keypair().publicKey.toString();
    const currentSolPrice = 88.07;

    const body = req.body;
    if (
      !body.message ||
      !body.price ||
      !body.quantity ||
      !body.wallet ||
      !body.label
    ) {
      return next(new AppError('Invalid input', 400));
    }

    const { message, price, quantity, wallet, label } = body;
    const totalPrice = price * quantity;
    let amount = totalPrice / currentSolPrice;
    amount = Number(amount.toFixed(5));
    if (amount < 0) {
      return next(new AppError('Amount should not be a negative value', 400));
    }

    const recipient = new PublicKey(wallet).toString();
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
    next(new AppError(err.message, err.statusCode || 500));
  }
};
