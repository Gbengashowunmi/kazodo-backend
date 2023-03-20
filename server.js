const express = require("express");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();

port = process.env.PORT || 4000;
 
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true 
   optionSuccessStatus:200,
} 

app.use(cors(corsOptions)) // Use this after the variable declaration

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("./routes/userRoutes"));

//connect to database
const connecteDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log("connected to db");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connecteDb();

app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
