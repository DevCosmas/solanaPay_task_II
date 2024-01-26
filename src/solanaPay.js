import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import url from 'url';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import verifyTransaction from './verifyTx.js';
import generateUrl from './generateQr.js';
import processPayment from './processTx.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATABASE = path.join(__dirname, 'db.json');

const PORT = 8000;
const HOSTNAME = 'localhost';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const requestHandler = async (req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname.startsWith('/api/verifyQr') && req.method === 'GET') {
    try {
      const reference = query.reference;
      if (!reference) throw new Error('No or invalid Reference');

      const referencePublicKey = new PublicKey(reference);
      const response = await verifyTransaction(referencePublicKey);
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(
        JSON.stringify({
          status: 'success',
          message: 'your Transaction is now verified',
        })
      );
    } catch (err) {
      console.log(err.message);
      throw new Error('ERROR 💥', err.message);
    }
  }
  // Using the POST http method
  if (pathname === '/api/generatQR' && req.method === 'POST') {
    try {
      const body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      });
      req.on('end', async () => {
        const ref = new Keypair().publicKey;
        const bufferData = Buffer.concat(body).toString();
        const jsonBuffer = JSON.parse(bufferData);
        if (!jsonBuffer) throw new Error('Invalid input');
        const { message, amount, wallet, label } = jsonBuffer;
        const recipient = new PublicKey(wallet);
        const amountInSol = new BigNumber(amount);

        const newURl = await generateUrl(
          recipient,
          amountInSol,
          ref,
          label,
          message
        );

        // const payer = new PublicKey(
        //   'Cpn71vR5X7Vfw7j6rWqQCVGAahkyR5n92k4Km4ie7W5Q'
        // );
        // const payerSign = await processPayment(newURl.href, payer);
        fs.readFile(DATABASE, 'utf8', (err, data) => {
          if (err) console.log('an error occured');
          const dataObj = JSON.parse(data);
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
          fs.writeFile(DATABASE, final, (err) => {
            if (err) console.log('an error occured');
            console.log('file is written');
          });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              status: 'success',
              message: 'Generated Solana URL',
              newURl,
            })
          );
        });
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('ERROR 💥', err.message);
    }
  }
};
const apiServer = http.createServer(requestHandler);
apiServer.listen(PORT, HOSTNAME, () => {
  console.log(`server is running successfully at port ${PORT}`);
});
