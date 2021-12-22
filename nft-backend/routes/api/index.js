const router=require("express").Router();
const productRouter=require("./product");


router.use("/product",productRouter);


module.exports=router;