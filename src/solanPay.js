import http from 'http';
import url from 'url';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL, findReference, validateTransfer } from '@solana/pay';
import BigNumber from 'bignumber.js';
import base58 from 'base58';

const DB = [];
console.log(DB);
const port = 8000;
const hostname = 'localhost';

const myWallet = '8i4oEHAnExdeRtUper8NvhBwd8upTVvwvpPyJ5HamxCX';
const recipient = new PublicKey(myWallet);
// const amount = new BigNumber(0.0001);
const label = 'Solana pay Store';
const memo = 'Solana Pay Demo Public Memo';

async function generateUrl(recipient, amount, reference, label, message, memo) {
  const url = encodeURL({
    recipient,
    amount,
    reference,
    label,
    message,
    memo,
  });
  return { url };
}

async function verifyTransaction(reference) {
  // 1 - Check that the payment request exists
  const paymentData = paymentRequests.get(reference.toBase58());
  if (!paymentData) {
    throw new Error('Payment request not found');
  }
  const { recipient, amount, memo } = paymentData;
  // 2 - Establish a Connection to the Solana Cluster
  const connection = new Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );
  console.log('recipient', recipient.toBase58());
  console.log('amount', amount);
  console.log('reference', reference.toBase58());
  console.log('memo', memo);

  // 3 - Find the transaction reference
  const found = await findReference(connection, reference);
  console.log(found.signature);

  // 4 - Validate the transaction
  const response = await validateTransfer(
    connection,
    found.signature,
    {
      recipient,
      amount,
      splToken: undefined,
      reference,
      //memo
    },
    { commitment: 'confirmed' }
  );
  // 5 - Delete the payment request from local storage and return the response
  if (response) {
    paymentRequests.delete(reference.toBase58());
  }
  return response;
}
const requestHandler = async (req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/api/verifyQr' && req.method === 'GET') {
  }
  // Using the POST http method
  if (pathname === '/api/generatQR' && req.method === 'POST') {
    console.log('testing routes');
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', async () => {
      const reference = new Keypair().publicKey;
      const bufferData = Buffer.concat(body).toString();
      const jsonBuffer = JSON.parse(bufferData);
      const { message, amount } = jsonBuffer;
      const amountInSol = new BigNumber(amount);
      const newURl = await generateUrl(
        recipient,
        amountInSol,
        reference,
        label,
        message,
        memo
      );
      const ref = reference.toBase58();
      DB.push(ref);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', ref, newURl }));
    });
  }
};
const apiServer = http.createServer(requestHandler);
apiServer.listen(port, hostname, () => {
  console.log(`server is running successfully at port ${port}`);
});
