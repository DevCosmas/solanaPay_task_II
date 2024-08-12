// import dotenv from 'dotenv';
// dotenv.config();

// import { Connection, PublicKey } from '@solana/web3.js';
// import { findReference, validateTransfer } from '@solana/pay';
// import BigNumber from 'bignumber.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const DATABASE = path.join(__dirname, 'db.json');
// const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// export default async function verifyTransaction(reference) {
//   if (!reference) {
//     throw new Error('Payment request not found');
//   }

//   try {
//     const data = fs.readFileSync(DATABASE, 'utf-8');
//     const dataObj = JSON.parse(data);
//     const findRefObj = dataObj.find(
//       (obj) => obj.ref === new PublicKey(reference).toBase58()
//     );

//     if (!findRefObj) {
//       console.log('Payment request not found!');
//     } else {
//       const found = await findReference(connection, new PublicKey(reference));
//       console.log('Found Transaction Signature:', found.signature);
//       const response = await validateTransfer(
//         connection,
//         found.signature,
//         {
//           recipient: new PublicKey(findRefObj.recipient),
//           amount: new BigNumber(findRefObj.amountInSol),
//           reference,
//         },
//         { commitment: 'confirmed' }
//       );
//       if (response) {
//         console.log('Transaction validated successfully!');
//       } else {
//         console.log('Transaction validation failed.');
//       }

//       return response;
//     }
//   } catch (error) {
//     console.error('Error in transaction verification:', error.message);
//     throw error;
//   }
// }
