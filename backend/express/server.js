import express from "express";
import router from "./server/routes/index.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/", router);

app.listen(port, () => {
  console.log("started");
});

export default app;
