import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.routes";

const app: Application = express();

app.use(express.json());
app.use(cors());

// User routes
app.use('/api/users', UserRoutes);

const getController = (req: Request, res: Response) => {
  res.send("Hello World!");
};

app.get("/", getController);
export default app;
