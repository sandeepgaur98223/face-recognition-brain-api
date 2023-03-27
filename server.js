import express from 'express';
import bodyparser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'dbpass',
      database : 'smart-brain'
    }
  });


  /*
db.select('*').table('users')
.then(data=>{console.log(data)}); 
 */

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
  /*  bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
    */
   db('users')
   .returning('*')
   .insert({
    email:email,
    name:name,
    joined: new Date()
   }).then(user=>{
    res.json(user[0]) 
    /*user[0] just to make sure that 
    we are returning an object and not an array.
    And anways, when a user is registering, 
    he will register only one user at a time, so user[0] makes sense.
    */ 
   })
   .catch(err=>{res.status(400).json('unable to register')})


   // res.json(database.users[database.users.length-1]);
  //  console.log(database.users);

})

app.get('/profile/:id',(req,res)=>{
    const {id}=req.params;
    let found=false;
    
    db.select('*').from('users')
    .where({id:id})
    .then(user=>{
        console.log(user);
        if(user.length)
        {
            res.json(user[0]);

        }
        else
        {
            res.status(400).json('User not found');
        }
        
    })
    .catch(err=>{res.status(400).json('error finding user');})

})

app.put('/image',(req,res)=>{

const {id}=req.body;




db('users')
  .where('id', '=', id)
  .increment('entries',1)
  .returning('entries')
  .then(entries=>{
    res.json(entries[0].entries);
  })
  .catch(err=>{res.status(400).json('unable to get count')})
  ;

    /*
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

    }*/
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
    console.log("app is running on Port 3001")
})

//test

/*Endpoints:
-->res = This is working.
/SignIn -->Post = success/fail
/Register-->Post = user object
/profile/:user id --> Get = user object
/image --> Put -->user
*/