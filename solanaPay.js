// import dotenv from 'dotenv';
// dotenv.config();

// import http from 'http';
// import url from 'url';
// import { Connection, Keypair, PublicKey } from '@solana/web3.js';
// import BigNumber from 'bignumber.js';

// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// import verifyTransaction from './verifyTx.js';
// import generateUrl from './generateQr.js';
// import processPayment from './processTx.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const DATABASE = path.join(__dirname, 'db.json');

// const PORT = 8000;
// const HOSTNAME = 'localhost';

// const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// const requestHandler = async (req, res) => {
//   const { query, pathname } = url.parse(req.url, true);
//   if (pathname.startsWith('/api/verifyQr') && req.method === 'GET') {
//     try {
//       const reference = query.reference;
//       if (!reference) throw new Error('No or invalid Reference');

//       const referencePublicKey = new PublicKey(reference);
//       const response = await verifyTransaction(referencePublicKey);
//       res.writeHead(200, { 'Content-type': 'application/json' });
//       res.end(
//         JSON.stringify({
//           status: 'success',
//           message: 'your Transaction is now verified',
//         })
//       );
//     } catch (err) {
//       console.log(err.message);
//       throw new Error('ERROR 💥', err.message);
//     }
//   }
//   // Using the POST http method
//   if (pathname === '/api/generateQR' && req.method === 'POST') {
//     try {
//       const body = [];
//       req.on('data', (chunk) => {
//         body.push(chunk);
//       });
//       req.on('end', async () => {
//         const ref = new Keypair().publicKey;
//         const currentSolPrice = 88.07; //current sol price as at the time of task
//         const bufferData = Buffer.concat(body).toString();
//         const jsonBuffer = JSON.parse(bufferData);
//         if (!jsonBuffer) throw new Error('Invalid input');
//         const { message, price, quantity, wallet, label } = jsonBuffer;
//         const totalPrice = price * quantity;
//         let amount = totalPrice / currentSolPrice;
//         amount = Number(amount.toFixed(9));
//         console.log(amount);

//         const recipient = new PublicKey(wallet);

//         const amountInSol = new BigNumber(amount);

//         const newURl = await generateUrl(
//           recipient,
//           amountInSol,
//           ref,
//           label,
//           message
//         );

//         // const payer = new PublicKey(
//         //   'Cpn71vR5X7Vfw7j6rWqQCVGAahkyR5n92k4Km4ie7W5Q'
//         // );
//         // const payerSign = await processPayment(newURl.href, payer);
//         fs.readFile(DATABASE, 'utf8', (err, data) => {
//           if (err) console.log('an error occured');
//           const dataObj = JSON.parse(data);
//           const id = Math.floor(Math.random() * 1000000 + 1);
//           const storedRef = {
//             ref,
//             id,
//             recipient,
//             amountInSol,
//             label,
//             message,
//           };
//           dataObj.push(storedRef);
//           const final = JSON.stringify(dataObj);
//           fs.writeFile(DATABASE, final, (err) => {
//             if (err) console.log('an error occured');
//             console.log('file is written');
//           });
//           res.writeHead(200, { 'Content-Type': 'application/json' });
//           res.end(
//             JSON.stringify({
//               status: 'success',
//               message: 'Generated Solana URL',
//               ref,
//               newURl,
//             })
//           );
//         });
//       });
//     } catch (err) {
//       console.log(err.message);
//       throw new Error('ERROR 💥', err.message);
//     }
//   }
// };
// const apiServer = http.createServer(requestHandler);
// apiServer.listen(PORT, HOSTNAME, () => {
//   console.log(`server is running successfully at port ${PORT}`);
// });

import express from 'express';
import http from 'http';
import url from 'url';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import cors from 'cors';
import fs from 'fs/promises'; // Using fs.promises for async file operations

import verifyTransaction from './verifyTx.js';
import generateUrl from './generateQr.js';
// import processPayment from './processTx.js'; // You can import this if needed

const app = express();
const PORT = 8000;

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const DATABASE = 'db.json'; // Updated path for simplicity

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/verifyTx', async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) throw new Error('No or invalid Reference');

    const referencePublicKey = new PublicKey(reference);
    const response = await verifyTransaction(referencePublicKey);

    res.json({
      status: 'success',
      message: 'Your transaction is now verified',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

app.post('/api/generateQR', async (req, res) => {
  try {
    const ref = new Keypair().publicKey;
    const currentSolPrice = 88.07; //current sol price as at the time of task

    const body = req.body;
    if (
      !body.message &&
      !body.price &&
      !body.quantity &&
      !body.wallet &&
      !body.label
    )
      throw new Error('Invalid input');

    const { message, price, quantity, wallet, label } = body;
    const totalPrice = price * quantity;
    let amount = totalPrice / currentSolPrice;
    amount = Number(amount.toFixed(5));
    if (amount < 0) return new Error('Amount should not be a negative value');
    const recipient = new PublicKey(wallet);
    const amountInSol = new BigNumber(amount);

    const newURl = await generateUrl(
      recipient,
      amountInSol,
      ref,
      label,
      message
    );

    const dataObj = await fs.readFile(DATABASE, 'utf8').then(JSON.parse);
    const id = Math.floor(Math.random() * 1000000 + 1);
    const storedRef = {
      ref,
      id,
      recipient,
      amountInSol,
      label,
      message,
    };
    dataObj.push(storedRef);
    const final = JSON.stringify(dataObj);
    await fs.writeFile(DATABASE, final);

    res.json({
      status: 'success',
      message: 'Generated Solana URL',
      ref,
      newURl,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

const apiServer = http.createServer(app);
apiServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
