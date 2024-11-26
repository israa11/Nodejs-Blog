const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post')

const secretKey = process.env.secretKey;
/*
router.get('/register' , (req, res)=>{
    
    res.render('user/register')
      
         
})

router.post('/register' , (req, res)=>{
 
   User.findOne({username: req.body.email}).then((username)=>{

    if(!username){
        const newuser = new User({
            username: req.body.email,
        });
        newuser.password =  newuser.hashPassword(req.body.password)
        console.log(newuser)
       newuser.save().then(()=> res.redirect('/'))
        
    }
    if(username){
        console.log("username is already exist")
       
        res.redirect('/register')
    }
   })
  
})
*/
const authenticateToken = (req, res, next) => { 
   
   const token = req.cookies.token;
   
   
    
     if (!token) {
        res.redirect('/admin')
     
        return
        
    } 
    
    jwt.verify(token, secretKey, (err, user) =>
     { if (err)
         { 
         
          res.redirect('/admin')
       
          return
        }
     console.log(user)
       
          next(); 
        }); 
    };
   
router.get('/admin' , (req, res)=>{
 if(req.cookies.token){
   jwt.verify(req.cookies.token, secretKey, (err, user) =>
      {
          if (err) { 
            res.render('admin/index.ejs' )

           return
         }
         res.redirect('/dashboard')
         return
      })
 }
 res.render('admin/index.ejs' )
   
})

router.post('/admin'  , (req, res)=>{
    
    User.findOne({username: req.body.email}).then((username)=>{
 
     if(!username){
     
      return   res.status(403).json({ message: 'Invalid username' }); 
     }
     if(!username.comparePassword(req.body.password)){
        return   res.status(403).json({ message: 'Invalid password' })
     }
console.log(username)
     const token = jwt.sign({ username: req.body.email }, secretKey);
     console.log(token)
   
     res.cookie('token', token, { httpOnly: true });
     
    
     res.redirect('/dashboard')
    
    })
   
 })


 router.get('/dashboard', authenticateToken ,(req , res)=>{
 
    Post.find({}).then((posts)=> 
      res.render('admin/dashboard' , {posts : posts})
    )
   
 })


 router.get('/logout' , (req , res)=>{
    res.cookie('token', '',  { httpOnly: true }); 
       res.json({ message: 'Logout erfolgreich' });  
       
 })


router.get('/add-post',authenticateToken, (req, res)=>{
  res.render('admin/addpost.ejs')
})

router.post('/add-post', (req, res)=>{
if(! req.body.title || ! req.body.body){
  console.log("add all fields")
}

const newpost = new Post({
  body : req.body.body,
  title: req.body.title
})
newpost.save().then(()=> res.redirect('/dashboard'))
})

router.get('/delete-post/:id', (req, res)=>{
  Post.deleteOne({_id : req.params.id}).then(()=> 

    res.redirect('/dashboard')
   )

})


router.get('/edit-post/:id' ,authenticateToken, (req, res)=>{

  Post.findById({_id: req.params.id}).then((post)=> {
     
    res.render('admin/editpost' , {post: post})
  }
   
  )
   
})

router.post('/edit-post/:id' , (req , res)=>{
  if(! req.body.title || ! req.body.body){
    console.log("add all fields")
  } 

  const updatedPost = {
     title: req.body.title,
     body: req.body.body,
     updatedAt: Date.now()
     };
   
    
  Post.updateOne({_id: req.params.id}, {$set: updatedPost}).then(()=>  res.redirect('/dashboard'))
  
})

module.exports = router