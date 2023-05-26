import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { errorMiddelware } from "./middelware/error-middelware";
import { router } from "./routes/user.router";
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api", router);
app.use(errorMiddelware);

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
