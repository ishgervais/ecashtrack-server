import "./config/db";
import cors from "cors";
import express, { Request, Response } from "express";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the e-wallet App");
});

app.use("/api/v1", routes);

app.listen(process.env.PORT || 4040, () => {
  console.log(`[${new Date()}] Server running on port... ${process.env.PORT}`);
});
