//jshint esversion:6
const express = require('express');
const fs = require("fs");
const csv = require("fast-csv");
const app = express();
const os= require('os');
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
//app.use(cors());



var price =[];
 //1 second


 var i1=0;
 var i=0;
 var x=[];
 
 //const ws1 = fs.createWriteStream('fake.csv');
 
setInterval(function() {
    
    i=i+1;
    //console.log(i1);
    //console.log(date);
    //date=math.random();
     var datt=i.toString();
    // console.log(datt);
    var Date="2004-12-"+datt;
    var date1=parseInt(Date);
        var c=Math.floor(Math.random() * 200) + 1;
        var d=Math.floor(Math.random() * 2 ) +1 ;
        var e=Math.floor(Math.random() * 50 ) +1 ;
        var o1=Math.floor(Math.random() * 50 ) +1 ;
        var h1=Math.floor(Math.random() * 50 ) +1 ;
        var l1=Math.floor(Math.random() * 50 ) +1 ;
        var c1=Math.floor(Math.random() * 50 ) +1 ;
        var date=2004-12-05;
        var open=54.14
        var high= 55.83
        var low=55.10;
        var close=54.3;
        if (d===1){
            open=o1+open;
            high=h1+high;
            low=low-l1;
            close=close-c1;
      }
      else{
        open=o1+open;
        high=h1+high;
        low=low-l1;
        close=close-c1;
      }
  
      
      
  
console.log(x);
if(i1===0)
{
    i1=i1+1;
    x.push(["Date","Open","High","Low","Close"]);
 csv.writeToStream(fs.createWriteStream('fake.csv', {  flags: 'a', includeEndRowDelimiter: true  }), x, { headers: false }).on("finish", function() {
    
})

}

else{
csv.writeToStream(fs.createWriteStream('fake.csv', {  flags: 'a', includeEndRowDelimiter: true  }), [[Date,open,high,low,close]], { headers: false }).on("finish", function() {
    
})9

}


   			//csv.write(x).pipe(ws1);
        }, 3000);







// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();

// today = yyyy + '-' + mm + '-' + dd;











// const express = require('express');
// const ejs= require('ejs');
// const mongoose = require('mongoose');
// const csrf = require('csurf');
// const cookieParser = require('cookie-parser');
// const expressSession = require('express-session');
// var MemoryStore = require('memorystore')(expressSession)
// const passport = require('passport');
// const flash = require('connect-flash');
// const path= require('path');
// const app = express();
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views',);

// app.use(express.urlencoded({ extended: true }));

// app.use(express.static("static"));
// app.use(express.static(path.join(__dirname + '/public')));


// // ./config/monkoKEY
// const mongoURI = require('./config/monkoKEY');
// mongoose.connect(mongoURI, {useNewUrlParser:true})
// .then(()=>{
//     console.log("Connected success")
// })
// .catch(()=>{
//     console.log("failed")
// })

// app.use(cookieParser('random'));

//  app.use(expressSession({
//      secret: "random",
//      resave: true,
//       saveUninitialized: true,
//      // setting the max age to longer duration
//      maxAge: 24 * 60 * 60 * 1000,
//    store: new MemoryStore(),
//  }));

//  app.use(csrf());
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());

// app.use(function (req, res, next) {
//  res.locals.success_messages = req.flash('success_messages');
// res.locals.error_messages = req.flash('error_messages');
//      res.locals.error = req.flash('error');
//      next();
//  });

// app.use(require('./controller/routes.js'));
// //SERVER JS///////////////////////////////////

app.get('/',function(req,res){
    res.sendFile(__dirname+'/pp.html')
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started At " + PORT));