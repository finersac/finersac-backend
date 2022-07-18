import "dotenv/config";
import "module-alias/register";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import publicRoutes from "./routes/public";
import privateRoutes from "./routes/private";
import { customResponse } from "utils/function";
import env from "config/env";

const app = express();

//middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" })); // define the size limit
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: false }));

app.use(helmet());

app.use(customResponse);
// routes
app.use("/api/public/v1", publicRoutes);
app.use("/api/v1", privateRoutes);

app.listen(env.PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${env.PORT}`);
  console.log(`sendgrind ${env.SENDGRID_API_KEY}`);
});
