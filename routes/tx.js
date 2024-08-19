import express from 'express';
import { generateQRController, verifyTxController } from '../controller/tx.js';

const txRouter = express.Router();

// Route to generate QR code
txRouter.post('/generate-qr', generateQRController);

// Route to verify transaction
txRouter.get('/verify-tx', verifyTxController);

txRouter.get('/test', (req, res) => {
  res.send('Test route is working');
});

export default txRouter;
