import express from 'express';
import bodyparser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';

const app=express();

app.use(bodyparser.json());
app.use(cors());

const database={
    users: [
        {
            id:'123',
            name:'John',
            email:'john@gmail.com',
            password:'cookies',
            entries:0,
            joined: new Date()

        },
        {
            id:'124',
            name:'Sally',
            email:'sally@gmail.com',
            password:'bananas',
            entries:0,
            joined: new Date()

        }

    ]
}

app.get('/',(req,res)=>{
   res.send(database.users);
})

app.post('/signin',(req,res)=>{
 /*   bcrypt.compare("apples", '$2a$10$fxVZMoZtMGl/VhdB1/j9X.IvhmPjGFPSXRrPZbkLkr/UOQQHXgpFu', function(err, res) {
        // res == true
        console.log('first guess',res)
    });
    bcrypt.compare("veggies", '$2a$10$fxVZMoZtMGl/VhdB1/j9X.IvhmPjGFPSXRrPZbkLkr/UOQQHXgpFu', function(err, res) {
        // res = false
        console.log('second guess',res)
    });

    */
 //console.log(req.body)

    if(req.body.email===database.users[0].email &&
        req.body.password===database.users[0].password)
        {
           // res.json("success");
           res.json(database.users[0])
        }
        else
        {
            res.status(400).json("error logging in");
        }
       //console.log(req.body.json());
   // res.json("Inside the sign In");
})


app.post('/register',(req,res)=>{
   // res.send('Inside the register');
    //console.log(req.body);
   const {email,name,password}=req.body;
    //console.log(email,name,password);
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });

    database.users.push(
        {
            id:'125',
            name:name,
            email:email,
            password:password,
            entries:0,
            joined: new Date()

        }

    );
    res.json(database.users[database.users.length-1]);
  //  console.log(database.users);

})

app.get('/profile/:id',(req,res)=>{
    const {id}=req.params;
    let found=false;
    database.users.forEach(user=>{
        if(user.id===id)
        {
            found=true;
            res.json(user);
        }
    }
    )
    if(!found)
    {
        res.status(404).json('There is no such user');

    }

})

app.put('/image',(req,res)=>{
    const {id}=req.body;
    let found=false;
    database.users.forEach(user=>{
        if(user.id===id)
        {
            found=true;
            user.entries++;
            res.json(user.entries);
        }
    }
    )
    if(!found)
    {
        res.status(404).json('There is no such user');

    }
})

/*
bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});

*/


app.listen(3001,()=>{
    console.log("app is running on Port 3000")
})

//test

/*Endpoints:
-->res = This is working.
/SignIn -->Post = success/fail
/Register-->Post = user object
/profile/:user id --> Get = user object
/image --> Put -->user
*/