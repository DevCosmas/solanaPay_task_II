import dotenv from 'dotenv';
dotenv.config();
import createServer from './utils/server.js';

const PORT = process.env.PORT || 3001;
const app = createServer();

app.listen(PORT, () => {
  console.log(`Server is up and paying attention on port ${PORT}`);
});

export default app;
