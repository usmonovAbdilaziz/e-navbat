import {connectDB} from './db/admin.database.js';
import adminRouter from './routes/admin.routes.js';
import express from 'express';
import {config} from 'dotenv'
config();
const PORT = process.env.PORT ;
const app = express();
app.use(express.json());
await connectDB();
app.use('/admin', adminRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
