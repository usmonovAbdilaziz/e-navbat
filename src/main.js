import { connectDB } from "./db/admin.database.js";
import adminRouter from "./routes/admin.routes.js";
import passportRouter from "./routes/passport.routes.js";
import transportRouter from "./routes/transport.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import customerRouter from "./routes/customer.routes.js";
import express from "express";
import config from "./config/app.js";
import cookieParser from "cookie-parser";

const PORT = config.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());
await connectDB();

app.use("/admin", adminRouter);
app.use("/passport", passportRouter);
app.use("/transport", transportRouter);
app.use("/ticket", ticketRouter);
app.use("/customer", customerRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
