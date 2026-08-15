const express=require('express');
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("Products is working this route");
});

module.exports = router;