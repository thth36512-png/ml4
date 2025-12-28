require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.engine("hjs", require("hogan-express"));
app.set("view engine", "hjs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Import routes
const publicViewRoutes = require("./routes/public/view");
const publicApiRoutes = require("./routes/public/api");
const privateViewRoutes = require("./routes/private/view");
const privateApiRoutes = require("./routes/private/api");

// Mount routes
app.use("/", publicViewRoutes);
app.use("/api/v1", publicApiRoutes);
app.use("/", privateViewRoutes);
app.use("/api/v1", privateApiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Frontend running on http://localhost:${PORT}`);
  console.log(`Backend should be running on http://localhost:3001`);
});
