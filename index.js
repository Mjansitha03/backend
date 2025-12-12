import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Database/dbConfig.js";
import authRoute from "./Routes/authRoute.js";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: ["https://frontend-eweh.vercel.app"],
  methods: ["GET","POST","PUT","DELETE"],
}));


connectDB();

app.get("/", (req, res) =>{
    res.send(`<h1 style="text-align:center">Welcome to the Auth API</h1>`);
});

app.use("/api/auth", authRoute);

const port = process.env.PORT;

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})
