import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { errorMiddelware } from "./middelware/error-middelware";
import { router } from "./routes/user.router";
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);
app.use(errorMiddelware);

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
