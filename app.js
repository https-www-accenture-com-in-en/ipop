import http from "http";
import connectDB from "./db/dbconfig.js"; // Import the database connection function
import config from "./src/utils/config.js";

import path from "path";
import express from "express";
import cors from "cors";
// import userRouter from './routes/user.route.js';
import adminRouter from "./src/routes/admin.route.js";
import userRouter from "./src/routes/user.route.js"; // Uncomment this line if you have a userRouter defined
import {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} from "./src/utils/middleware.js";

const app = express();
const PORT = config.PORT || 5000;

app.use(cors({ origin: "*" })); // Allow all origins for CORS, you can specify your frontend URL here
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const __dirname = path.resolve();

// Serve static frontend
app.use(express.static(path.join(__dirname, "./dist")));

app.use("/v1/api/admin", adminRouter);
app.use("/v1/api/user", userRouter); // Uncomment this line if you have a userRouter defined

app.get("/*name", (req, res) =>
  res.sendFile(path.resolve(__dirname, "./dist/index.html"))
);

app.use(unknownEndpoint);
app.use(errorHandler);
const server = http.createServer(app);

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app; // Export the app for use in other files (e.g., server.js)
