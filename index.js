import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Database/dbConfig.js";
import authRoute from "./Routes/authRoute.js";

dotenv.config();
// apply environment variables

const app = express();

// parse JSON bodies
app.use(express.json());
// allow frontend origin and common HTTP methods
app.use(cors({
  origin: "https://frontend-3tar.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));



// establish DB connection
connectDB();

// simple health route
app.get("/", (req, res) =>{
  res.send(`<h1 style="text-align:center">Welcome to the Auth API</h1>`);
});

// mount auth routes under /api/auth
app.use("/api/auth", authRoute);

// port from .env (e.g., 5000) or default in env
const port = process.env.PORT;

// start the server
app.listen(port, () =>{
  console.log(`Server is running on port ${port}`);
})


