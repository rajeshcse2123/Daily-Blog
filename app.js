//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// Load the full build.
const _ = require('lodash');
const mongoose = require("mongoose");
const port = 5000;

// connecting to mongodb
  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ayush:123456ayush@clus.oz2frgu.mongodb.net/dailyBlog?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connected to db");
  })

  // mongoose.connect('mongodb://127.0.0.1:27017/DailyBlog', { useUnifiedTopology: true, useNewUrlParser: true })
  // .then(() => {
  //   console.log("Connected to db");
  // })




// blogSchema
const blogSchema = {
  title: {
    type: String,
    required: ["true", "You havent specified Title of your blog"]
  },
  body: String,
  img: String
}

// creating Blog collection
const Blog = mongoose.model("Blog", blogSchema);

const blog1 = new Blog({
  title: "Daily Blog",
  body: "DailyBlog is an online bloging website made by Kumar Ayush as a personal development project. This website is a dynamic website which enables user to post their blogs through compose page and get listed on home page, users can also read posted Blogs in home page by clicking on it.<br>Technologies used : <br><br>&emsp;&emsp; &emsp;&emsp; 1. html <br>&emsp; &emsp;&emsp; &emsp;  2. CSS <br>&emsp; &emsp;&emsp; &emsp;  3. JavaScript <br>&emsp;&emsp; &emsp; &emsp;  4. NodeJs <br>&emsp;&emsp; &emsp; &emsp;  5. Express <br>&emsp;&emsp; &emsp; &emsp;  6. EJS <br>&emsp;&emsp; &emsp; &emsp;  7. Bootstrap",
  img: "/images/blog1.png"
});

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/" , (req , res) =>{
  res.render("intro");
})

app.post("/" , (req ,res)=>{
  res.redirect("/home");
})


app.get("/home", (req, res) => {
  // to get count of records in Blog
  Blog.count().then((count, err) => {
    if (err) {
      console.log(err);
    } else {
      if (count === 0)
        blog1.save();
    }
  })

  Blog.find().then((post, err) => {
    if (err) {
      console.log("----err occured-----\n" + err);
    }
    res.render("home", {
      postsRender: post,
    });
  })

})

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/compose", (req, res) => {
  res.render("compose");
})

app.get("/post/:topic", async (req, res) => {
  let topic = req.params.topic;
  // topic = _.lowerCase(topic);
  console.log(topic);

  await Blog.findOne({ title: topic }).then((post, err) => {
    res.render("post", {
        mainPostRender: post
      })

  })


  // posts.forEach((posts)=>{

  //   let title = posts.title;
  //   title = _.lowerCase(title);

  //   if(title === topic){
  //     res.render("post" , {
  //       mainPostRender : posts       
  //     });
  //   }
  // })
})

app.post("/compose", (req, res) => {
  let post = new Blog({
    title: req.body.inputTitle,
    body: req.body.inputPost,
    img: req.body.inputImgUrl
  })

  post.save();

  res.redirect("/");
})



// contact page
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContentRender: contactContent
  })
})

app.listen(process.env.PORT || port, () => {
  console.log("server started : " + port);
})


