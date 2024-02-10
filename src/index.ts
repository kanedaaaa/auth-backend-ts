import express from "express";
import authR from "./routes/auth.route";
import * as dotenv from "dotenv";
import { json } from "body-parser";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.status(200).json({ message: "ok" });
});

app.use("/auth", authR);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
