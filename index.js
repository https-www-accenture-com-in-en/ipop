import http from "http";
import app from "./src/app.js"; // Import the app from app.js
import connectDB from "./db/dbconfig.js"; // Import the database connection function
import config from "./src/utils/config.js";

const PORT = config.PORT || 5000;
const server = http.createServer(app);

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
