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

 db.select('email','hash')
 .from('login') 
 .where('email', '=', req.body.email)
 .then(data=>{
    const isValid=bcrypt.compareSync(req.body.password, data[0].hash);
    if(isValid)
    {
       return db.select('*')
        .from('users')
        .where('email', '=', req.body.email)
        .then(user=>{
            res.json(user[0]);
        })
        .catch(err=>{res.status(400).json("unable to get user");})
    }
    else
    {
        res.status(400).json("error logging in");
    }
})
.catch(err=>{res.status(400).json("error logging in")})

/*
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
         */
       //console.log(req.body.json());
   // res.json("Inside the sign In");


})


app.post('/register',(req,res)=>{

   const {email,name,password}=req.body;
   const hash = bcrypt.hashSync(password);

   if(!email||!name||!password)
   {
    res.status(400).json('All the fields should be filled')
   }
   else
   {
   db.transaction(trx=>{ 
    /*transaction is something: when one query fails, all query fails*/
    trx.insert({
        hash:hash,
        email:email
    })
    .into('login')
    .returning('email')
    .then(loginemail=>{
       return trx('users')
        .returning('*')
        .insert({
         email:loginemail[0].email,
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
    })
    .then(trx.commit)
    .catch(trx.rollback)

   }
   )
   .catch(err=>{res.status(400).json('unable to register')})
}

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


app.listen(process.env.PORT || 3001,()=>{
    console.log(`app is running on Port ${process.env.PORT}`)
})

//test

/*Endpoints:
-->res = This is working.
/SignIn -->Post = success/fail
/Register-->Post = user object
/profile/:user id --> Get = user object
/image --> Put -->user
*/