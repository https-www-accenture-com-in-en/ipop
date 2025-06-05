import express from "express";
import cors from "cors";
// import userRouter from './routes/user.route.js';
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js"; // Uncomment this line if you have a userRouter defined
import {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} from "./utils/middleware.js";

const app = express();
app.use(cors({ origin: "*" })); // Allow all origins for CORS, you can specify your frontend URL here
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use("/v1/api/admin", adminRouter);
app.use("/v1/api/user", userRouter); // Uncomment this line if you have a userRouter defined

app.use(unknownEndpoint);
app.use(errorHandler);

export default app; // Export the app for use in other files (e.g., server.js)
