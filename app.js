//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")


const homeStartingContent = "This blog website allows anyone to publicly upload to the website.";
const aboutContent = "This app leverages Node.js and MongoDB.";
const contactContent = "Check out the GitHub repository for this app";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


const PORT = process.env.port || 3000
////////////////////////////////////////////////////////////////////////////////

mongoose.connect(`mongodb+srv://admin-andrew:${process.env.DB_PASS}@cluster0.7gdn9.mongodb.net/blogwebsiteDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

const postSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postSchema);

///////////////////////////////////////////////////////////////////////////////
app.get("/", function(req, res) {

  Post.find(function(err, posts) {
    if (!err) {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts,
        deleteHandler: 'deleteMe(id)'
      });
    }
  });



});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContact: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody,
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postID", function(req, res) {

  Post.findById(req.params.postID, function(err, postFound){
    if (!err){
      res.render("post", {
            postTitle: postFound.title,
            postBody: postFound.body
          });
    }
  })
});

app.get("/delete/:postID", function(req, res) {

  Post.deleteOne({_id: req.params.postID}, function(err){
    if (!err){
      res.redirect('/');
    }
  })
});




app.listen(PORT, function() {
  console.log(`Server started on port: ${PORT}`);
});
