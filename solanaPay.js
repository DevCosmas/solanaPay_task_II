// import express from 'express';
// import http from 'http';
// import url from 'url';
// import { Connection, Keypair, PublicKey } from '@solana/web3.js';
// import BigNumber from 'bignumber.js';
// import cors from 'cors';
// import fs from 'fs/promises'; // Using fs.promises for async file operations

// import verifyTransaction from './verifyTx.js';
// import generateUrl from './generateQr.js';
// // import processPayment from './processTx.js'; // You can import this if needed

// const app = express();
// const PORT = 8000;

// const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
// const DATABASE = 'db.json'; // Updated path for simplicity

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/api/verifyTx', async (req, res) => {
//   try {
//     const { reference } = req.query;
//     if (!reference) throw new Error('No or invalid Reference');

//     const referencePublicKey = new PublicKey(reference);
//     const response = await verifyTransaction(referencePublicKey);

//     res.json({
//       status: 'success',
//       message: 'Your transaction is now verified',
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// });

// app.post('/api/generateQR', async (req, res) => {
//   try {
//     const ref = new Keypair().publicKey;
//     const currentSolPrice = 88.07; //current sol price as at the time of task

//     const body = req.body;
//     if (
//       !body.message &&
//       !body.price &&
//       !body.quantity &&
//       !body.wallet &&
//       !body.label
//     )
//       throw new Error('Invalid input');

//     const { message, price, quantity, wallet, label } = body;
//     const totalPrice = price * quantity;
//     let amount = totalPrice / currentSolPrice;
//     amount = Number(amount.toFixed(5));
//     if (amount < 0) return new Error('Amount should not be a negative value');
//     const recipient = new PublicKey(wallet);
//     const amountInSol = new BigNumber(amount);

//     const newURl = await generateUrl(
//       recipient,
//       amountInSol,
//       ref,
//       label,
//       message
//     );

//     const dataObj = await fs.readFile(DATABASE, 'utf8').then(JSON.parse);
//     const id = Math.floor(Math.random() * 1000000 + 1);
//     const storedRef = {
//       ref,
//       id,
//       recipient,
//       amountInSol,
//       label,
//       message,
//     };
//     dataObj.push(storedRef);
//     const final = JSON.stringify(dataObj);
//     await fs.writeFile(DATABASE, final);

//     res.json({
//       status: 'success',
//       message: 'Generated Solana URL',
//       ref,
//       newURl,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ status: 'error', message: 'Internal Server Error' });
//   }
// });

// const apiServer = http.createServer(app);
// apiServer.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
