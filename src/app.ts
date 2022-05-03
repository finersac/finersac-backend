import express from "express";
import publicRoutes from "./routes/public";
import privateRoutes from "./routes/private";

const app = express();
const port = 3000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/public", publicRoutes);
app.use("/api", privateRoutes);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
