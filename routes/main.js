const express = require('express');


const router = express.Router();


const Post = require('../models/Post')


router.get('', (req, res) => {
  
      const perPage = 10; 
      const page = parseInt(req.query.page) || 1; 
      Post.find({})
      .sort({ createdAt: -1 }) 
      .skip(perPage * (page - 1)) 
       .limit(perPage) 
      .exec() 
      .then(posts =>{
        Post.countDocuments().then(count =>
          { 
            res.render('main/index.ejs', 
           { posts: posts, current: page, pages: Math.ceil(count / perPage) })
          });
      
         
           })
          })
         


         router.get('/post/:id' , (req , res)=>{
           Post.findById({_id : req.params.id}).then((post)=> res.render('main/post.ejs' , {post: post}))
         })



         router.post('/search', (req , res)=>{
          
          Post.find({title: req.body.search}).then((post)=> 
            res.render('main/search.ejs' ,{post: post})
          )
        
         })
module.exports = router