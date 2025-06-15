import { connectDB } from "./db/admin.database.js";
import adminRouter from "./routes/admin.routes.js";
import passportRouter from "./routes/passport.routes.js";
import transportRouter from "./routes/transport.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import express from "express";
import { config } from "dotenv";
config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
await connectDB();

app.use("/admin", adminRouter);
app.use("/passport", passportRouter);
app.use("/transport", transportRouter);
app.use("/ticket", ticketRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
