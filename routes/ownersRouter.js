const express=require('express');
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("owners is working this route");
});

module.exports = router;