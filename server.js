const express=require("express");
const app=express();
const dotenv=require("dotenv");
const cors = require('cors')
app.set('view engine', 'ejs')
app.use(cors())
const path =require('path');
const connectDB = require("./config/db");

dotenv.config({path:"./config/.env"});
const db = require('./config/db');

db.connect(function(err) {
	if (err){
		console.log(err);
		console.log("!!!!!!!!!!! Failed to connect to DB !!!!!!!!!!!!!");
	}
	else console.log("*********** Connected to DB ***********");
})
// connectDB();
 const apiRouter=require("./routes/index");
 app.use(express.static(path.join(__dirname, 'public')));
//  app.use("/CoverPicImages", express.static(path.join(__dirname, "CoverPicImages")));
 app.use("/CoverPicImages",express.static("CoverPicImages"));
app.use(express.json());

app.use("/",apiRouter);

app.get("/",(req,res)=>{
    res.send("Its working");
});

app.listen(5000,()=>{
    console.log("server has been started port on 5000");
});