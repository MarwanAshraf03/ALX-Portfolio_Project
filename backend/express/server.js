import express from "express";
import router from "./server/routes/index.js";

// the admin uuid4 for now is 854cc558-d014-4bb1-958a-e28377329f5e

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.use("/", router);

// Handle invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    const arr = err.message.split(" ");

    return res.status(400).json({
      error:
        "Invalid JSON payload, " +
        err.message +
        err.body.slice(null, parseInt(arr[arr.length - 1]) + 1),
    });
  }
  next();
});

app.listen(port, () => {
  console.log("started");
});

export default app;
