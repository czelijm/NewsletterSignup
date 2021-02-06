const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
// const path = require('path');
const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
  console.log(req.body.firstName);
  console.log(req.body.lastName);
  console.log(req.body.email);

  var data = {
    members: [
      {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields:{
          FNAME: req.body.firstName,
          LNAME: req.body.lastName,
        },
      }
    ]
  };

  var jasonData = JSON.stringify(data);

  var options =  {
    url: process.env.API_URL,
    method: "POST",
    headers:{
      "Authorization": process.env.API_AUTH
    },
   body: jasonData
  }



  request(options, function(error, response, body){
    if(error){
      // res.write("There was an error with signing up, please try again");
      // res.send();
      res.sendFile(__dirname+"/failure.html");
    }else {
      if (response.statusCode===200){
        // res.write("<h1>Successfully subscribed!</h1>");
        // res.send();
        res.sendFile(__dirname+"/success.html");
      } else {
        // console.log(response.statusCode);
        // res.write("There was an error with signing up, please try again");
        // res.send();
        res.sendFile(__dirname+"/failure.html");
      }

    }

  });


});


app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || port, function(){
  console.log("Server is running on port "+ port);
});

// to run docker on windows host
// port 80 allow http
// port 443 allow https
// docker run --rm -it -v `pwd -W`:/usr/src/app/ -p 3000:3000 -p 80:80 -p 443:443 -w /usr/src/app ca14 npx nodemon --legacy-watch
