const mongoose=require("mongoose");

const productSchema= new mongoose.Schema({
    id:{
        type:Number,
        required:true,
    },
    sku:{
        type:String,
        unique:true,
        requires:true,
        
    },
    category:{
        type:String,
  requires:true,
        
    },

    name:{
        type:String,
  requires:true,
        
    },
    description:{
        type:String,
  requires:true,
        
    },
    price:{
        type:mongoose.Types.Decimal128,
  requires:true,
        
    },
    avail_qty:{
        type:Number,
  requires:true,
        
    },
  
   
},{
    timestamps:true,
});
const Product=mongoose.model("products",productSchema);

module.exports=Product;