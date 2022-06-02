import "module-alias/register";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import publicRoutes from "./routes/public";
import privateRoutes from "./routes/private";
import { customResponse } from "utils/function";
import env from "config/env";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

app.use(customResponse);
// routes
app.use("/api/public", publicRoutes);
app.use("/api", privateRoutes);

app.listen(env.PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${env.PORT}`);
});
