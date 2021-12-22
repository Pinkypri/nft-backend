const  router=require("express").Router();


const { db } = require("../../../models/Product");
const Product =require("../../../models/Product");

 
 router.get("/get",(req,res)=>{
     res.send("product Route Is Working");
     });


router.post("/add",async(req,res)=>{
    try {
        const user=await Product.create(req.body);
        if(user){
        res.json(user);
        }
    } catch (error) {
        res.json(error)
    }
});
router.put("/update/:id",async(req,res)=>{

    try{ 
      const user=await Product.findOneAndUpdate(
          { _id:req.params.id},
           {
               id:req.body.id,
               SKU:req.body.SKU,
               category:req.body.category,
               name:req.body.name,
               description:req.body.description,
               price:req.body.price,
               avail_qty:req.body.avail_qty
            },
          {new:true}
       
            )
          
              return res.json(user);
              
             
    }catch(error){
        return res.json({msg: error.message});
    }
   
  })
  router.delete("/delete/:id",async(req,res)=>{
      try {
         const user=await Product.findOneAndDelete({_id:req.params.id}) ;
         res.json("Deleted Successfully")
      } catch (error) {
          res.json({message:error.message})
      }
  })

  router.get("/name",async(req,res)=>{
    try {
        const user=await Product.find({name:{"$regex":"f"}});
       return res.json(user)
    } catch (error) {
       return res.json ({msg:error.message});
    }
})

router.get("/filter",async(req,res)=>{
    try {
        const user=await Product.find({},{name:1,_id:0,price:1,SKU:1});
       return res.json(user)
    } catch (error) {
       return res.json ({msg:error.message});
    }
})


router.get("/sort",async(req,res)=>{
    try {        
        const data=await Product.find().sort({price:1});
        return res.json(data);
    } catch (error) {
        return res.json({msg:error.message})
        
    }
});

router.get("/aggregate/:category/:price1-:price2",async(req,res)=>{
    try {        
        const data=await Product.find(
        {category:req.params.category,
            price:{$gte:req.params.price1,$lte:req.params.price2}})
            .sort({price:1})
    
        return res.json(data);
    } catch (error) {
        return res.json({msg:error.message});
        
    }
});

   
router.get("/all/products",async(req,res)=>{
    try {
        const user=await Product.find({name:{$regex:"f"}}).populate.select("-__v -_id  -createdAt -updatedAt");
        res.json("");
    } catch (error) {
         res.json(error); 
    }
   ;
});
  
module.exports=router;