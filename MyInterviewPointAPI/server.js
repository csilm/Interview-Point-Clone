require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes")
const userProfileRoutes = require("./routes/userProfileRoutes");
const userResultRoutes = require("./routes/userResultRoutes");
// express app
const app = express();
const port = 4000||process.env.PORT
// middleware
app.use(cors());
app.use(express.json());

// route
app.get("/", (req, res) => {
  res.status(200).json({ api: "My Interview Point API π¨βπΌπ©βπΌ" });
});

app.use("/api/auth", userRoutes)
app.use("/api/user/profile/", userProfileRoutes);
app.use("/api/result", userResultRoutes);



// connect to DB
mongoose.set('strictQuery', true);
try {
  mongoose.connect(`${process.env.MONGO_DB_URL}`) 
} catch (error) {
  console.log(error);
}

// listen for request
app.listen(port, () => {
  console.log("I on listen for port 4000 π");
});
