import express from 'express';

const app=express();

app.get('/',(req,res)=>{
    res.send('This is working...');
})

app.listen(3000,()=>{
    console.log("app is running on Port 3000")
})

//test