const express = require("express");
const app = express() ;
const port = 3001
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session");
const mongoose = require("mongoose")

app.use(cookieParser())

app.use(session({
    key:"BlogPageLogin",
    secret:"BlogPageLoginSecret",
    resave:true,
    saveUninitialized:false,
    cookie:{
        expires:null
    }    
}))


app.use(cors({
    origin:["http://localhost:3000"],
    method:["POST","GET"],
    credentials:true
}))

mongoose.connect("mongodb://localhost:27017/BlogWebApp").then(()=>{
 console.log("connection made")
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const userSignUp = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    Emailid:{
        type:String,
        index:true,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const usersblogsdata = new mongoose.Schema({
    Emailid:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    topic:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    }    
})


const userSignUpTable = mongoose.model("usersignupinfo",userSignUp,"usersignupinfo")

const usersBlogsDataTable = mongoose.model("usersblogsdata",usersblogsdata,"usersblogsdata")



app.get("/test",async (req,res)=>{
    const email = "john@gmail.com"
    const content = "web dev"
    const topic = "web dev"
    const author = "john"

    // _id:userSignUpTable.find({Emailid:email})

    const data = await userSignUpTable.find({Emailid:email})

    console.log(data[0].id)

    usersBlogsDataTable.insertMany({_id:data[0].id,Emailid:email,topic:topic,content:content,author:author})

    res.send("asd")
})


app.get("/testTwo",async (req,res)=>{
    const email = "john@gmail.com"
    const content = "web dev"
    const topic = "web dev"
    const author = "john"


    const data = await userSignUpTable.find({Emailid:email})

    res.send("asd")
})


app.post("/writeBlogData",async (req,res)=>{

    const title = req.body.title
    const topic = req.body.topic
    const content = req.body.content
    const showLogInStatus = req.body.showLogInStatus
    const loggedInEmailId = req.body.loggedInEmailId
    console.log(loggedInEmailId)
    console.log(showLogInStatus)

    if(title === "" || content === ""){
        res.json({ErrorMsg:"Please fill Your Content"});
    }else if(topic === ""){
        res.json({ErrorMsg:"Please fill The Topic"});
    }else if(content.length < 300 || content.length < 2000){
        res.json({ErrorMsg:"The Length Should be between 300 and 2000 of your blog content"});
    }else if(title.length < 30 || title.length > 150){
        console.log("Please fill Your Content")
        res.json({ErrorMsg:"The Length Should be between 30 and 150 of your title"});
    }
    else{
          const data = await userSignUpTable.find({Emailid:loggedInEmailId})
          console.log(loggedInEmailId)
          const userPublishData = usersBlogsDataTable.insertMany({Emailid:loggedInEmailId,title:title,topic:topic,content:content,author:showLogInStatus})
          res.send("data sent");
    }


})


app.post("/updateBlogData",async (req,res)=>{

    const title = req.body.title
    const topic = req.body.topic
    const content = req.body.content
    const showLogInStatus = req.body.showLogInStatus
    const loggedInEmailId = req.body.loggedInEmailId
    console.log(loggedInEmailId)
    console.log(showLogInStatus)


    if(title === ""){
        usersBlogsDataTable.updateOne({topic:topic,content:content})
    }else if(content === ""){
        usersBlogsDataTable.updateOne({title:title,topic:topic})
    }else if(topic === ""){
        usersBlogsDataTable.updateOne({title:title,content:content})
    }else{
        usersBlogsDataTable.updateOne({title:title,topic:topic,content:content})
    }
    

    // if(title === "" || content === ""){
    //     res.json({ErrorMsg:"Please fill Your Content"});
    // }else if(topic === ""){
    //     res.json({ErrorMsg:"Please fill The Topic"});
    // }else if(content.length < 300 || content.length < 2000){
    //     res.json({ErrorMsg:"The Length Should be between 300 and 2000 of your blog content"});
    // }else if(title.length < 30 || title.length > 150){
    //     console.log("Please fill Your Content")
    //     res.json({ErrorMsg:"The Length Should be between 30 and 150 of your title"});
    // }
    // else{
    //       const data = await userSignUpTable.find({Emailid:loggedInEmailId})
    //       console.log(loggedInEmailId)
    //       usersBlogsDataTable.insertMany({Emailid:loggedInEmailId,title:title,topic:topic,content:content,author:showLogInStatus})
        
    // }


})


app.post("/fetchUserBlogsInfo",async (req,res)=>{

    const loggedInEmailId = req.body.loggedInEmailId
    const myProfileBlogsData = await usersBlogsDataTable.find({Emailid:loggedInEmailId})
    res.send(myProfileBlogsData)

})

app.post("/fetchUserProfileInfo",async (req,res)=>{

    const loggedInEmailId = req.body.loggedInEmailId
    const myProfileBlogsData = await users.find({Emailid:loggedInEmailId})
    res.send(myProfileBlogsData)

})


app.delete("/deleteUserBlog/:id",async (req,res)=>{

    const id = req.params.id

    const myProfileBlogsData = await usersBlogsDataTable.deleteOne({_id:id})
    res.send(myProfileBlogsData)

})

//update 

app.put("/updateBlogTitle/:updateBlogId",async (req,res)=>{

    const updateBlogId = req.params.updateBlogId
    const updatedBlogTitle = req.body.updatedBlogTitle
    const myProfileBlogsData = await usersBlogsDataTable.updateOne({_id:updateBlogId},{$set:{title:updatedBlogTitle}})
    // res.send(myProfileBlogsData)
    res.send("Title Updated")

})

app.put("/updateBlogTopic/:updateBlogId",async (req,res)=>{

    const updateBlogId = req.params.updateBlogId
    const updatedBlogTopic = req.body.updatedBlogTopic

    const myProfileBlogsData = await usersBlogsDataTable.updateOne({_id:updateBlogId},{$set:{topic:updatedBlogTopic}})
    // res.send(myProfileBlogsData)
    res.send("Topic Updated")

})

app.put("/updateBlogContent/:updateBlogId",async (req,res)=>{

    const updateBlogId = req.params.updateBlogId
    const updatedBlogContent = req.body.updatedBlogContent

    console.log(updateBlogId)
    const myProfileBlogsData = await usersBlogsDataTable.updateOne({_id:updateBlogId},{$set:{content:updatedBlogContent}})
    // res.send(myProfileBlogsData)
    res.send("Content Updated")

})




app.get("/CreateTable",async (req,res)=>{
    await userSignUpTable();
    res.send("Table created")
})

app.get("/CreateTableBlogsData",async (req,res)=>{
    await usersBlogsDataTable();
    res.send("Table CreateTableBlogsData")
})


app.post("/SignUpDataInsert",async (req,res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const reCheckPassword = req.body.reCheckPassword

    const emailTakenQuery = await userSignUpTable.find({Emailid:email})

        if(emailTakenQuery.length > 0){
            res.send({message:"Email Id Taken"})
            console.log("Email Id Taken")
        }else if(name === "" || email === ""){
            res.send({message:"Email Id or name not filled"})
            console.log("Email Id or name not filled ")
        }else if(password === ""){
            res.send({message:"Password Not Filled"})
            console.log("Password Not Filled")
        }else if(password.length !== reCheckPassword.length){
            res.send({message:"Password Not Matched"})
            console.log("Password Not Matched")
        }else{         
            await userSignUpTable.insertMany({name:name,Emailid:email,password:password})
            res.send("signedUp")
        }


})



app.get("/logInUsers",(req,res)=>{
    if(req.session.user){
        res.json({loggedIn:true,user:req.session.user})
    }else{
        res.json({loggedIn:false})
    }
})


app.post("/logInUsers",async (req,res)=>{

    const email = req.body.email
    const password = req.body.password

    const logInResult = await userSignUpTable.find({
            Emailid:email,
            password:password
        }
        )
        
    // const logInResult = await userSignUpTable.find({Emailid:email})
    
        console.log(logInResult)
        
        if(logInResult.length > 0){
            req.session.user = logInResult
            console.log(req.session.user)
            res.send(logInResult)
        }   
        else if(email === "" || password === ""){
            res.json({message:"Please Fill the Details"});
        }else{
            res.json({message:"Wrong Email Id or Password"});
        }
})






















// app.get("/insert",(req,res)=>{
//     const InsertValues = `insert into HomePageBlogs (title,topic,content) values ("Blog Website using ReactJS","Web Dev","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porttitor imperdiet massa. Nullam sodales a lectus at tempus. Suspendisse ut aliquet ante, sed suscipit nunc. Aenean euismod risus sapien, in ullamcorper nibh tincidunt sit amet. Quisque feugiat sit amet enim id eleifend. Nullam ligula enim, rutrum nec velit nec, facilisis posuere ligula. Aliquam ac interdum justo. Curabitur at magna rutrum, tempor ex eu, efficitur velit.")`
//     db.query(InsertValues,(err)=>{
//         if(err){
//             console.log(err)
//         }
//         res.send("Data inserted")
//     })
// })









app.get("/fetch",async (req,res)=>{
    const blogsData = await usersBlogsDataTable.find()
    res.json({data:blogsData})

})

app.get("/fetch/:blogNo",async(req,res)=>{

    const blogNo = req.params.blogNo
    
    console.log(blogNo)
    const viewSelectedBlogData = await usersBlogsDataTable.find({_id:blogNo})
    console.log(viewSelectedBlogData)
    res.send(viewSelectedBlogData)

})



app.get("/createUsersInfo",(req,res)=>{

const table = `create table usersSignUp (id int not null auto_increment,name varchar(100),EmailId varchar(100),password varchar(50),primary key(id))`

    db.query(table,(err,results)=>{
        if(err){
            console.log(err)
        }
        console.log(results)
    })
    res.send("data users send")
})










app.get("/logout",(req,res)=>{
     res.clearCookie("BlogPageLogin")
     res.send("Cookie clear");     
    
})

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(port,()=>{
    console.log(`${port} is running`)
})