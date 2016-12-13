var express = require('express');
var http = require('http');
var https = require('https');
var html = require('html');
var fs = require("fs");
var app = express();
var path    = require("path");
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');


var multer = require("multer");
var upload = multer({dest: "./uploads"});
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/vhoto");
var conn = mongoose.connection;
var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL 
    auth: {
        user: 'vhotocomp20@gmail.com',
        pass: 'tmottbtmottc'
    }
};
var transporter = nodemailer.createTransport(smtpConfig);

var gfs;
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/vhoto';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
  db = databaseConnection;
});
var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;


app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

conn.once("open", function(){
  gfs = Grid(conn.db);
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



// views is directory for all template files
    app.set('views', __dirname + '/views'); 
    app.set('view engine', 'ejs');

  function authenticate(id_token, callback) {
    var options = {
      host: "www.googleapis.com",
      path: "/oauth2/v3/tokeninfo?id_token=" + id_token
    };
    var request = https.get(options, function(response) {
      var raw_data = '';
      response.on("data", function(chunk) {
        raw_data += chunk;
      });
      response.on("end", function() {
        var user = JSON.parse(raw_data);
        if(response.statusCode == 200){
          callback(user);
          return true;
        }
        return false;
      });
    });
  }

  app.get('/userProfile', function(request, response) {
    authenticate(request.query.id_token, function (user) {
      db.collection('users').find({'id_token': user.sub}).toArray(function (err, cursor) {
        if (err) { response.send(500) }
        else {
          if (cursor.length == 0) {
            db.collection('users').insert({'id_token': user.sub, 'email': user.email, 'name':user.name});
            response.send({'email': user.email});
          } else {
            response.send({'email': cursor[0].email});
          }
        }
      });
    });
  });



  app.use(express.static(__dirname + '/public'));


  app.get('/', function(request, response, next) {
    response.render('pages/index');
  });

  app.get('/login', function(request, response, next) {
    response.render('pages/login');
  });

  app.post('/vote', upload.fields([{name:"id_token", maxCount:1}, {name:"vote", maxCount:1}, {name:"other", maxCount:1}]), function(request, response){
    authenticate(request.body.id_token, function(){
      var vote;
      db.collection('fs.files').find({filename:request.body.vote}).toArray(function(error, cursor){
        if (error) { res.send(500) }
        vote = cursor[0];

    var emailBodyA = 'Congratulations!<br />Someone vhoted on your picture: ';
    var emailBodyB = '.<br />The Vhoto Team';
    var emailBody = emailBodyA + vote.filename + emailBodyB;
    var mailOptions = {
      from: '"The Vhoto Team!" <vhotocomp20@yahoo.com>', // sender address 
      to: vote.metadata.email, // list of receivers 
      subject: 'You got a Vhote!', // Subject line 
      html: emailBody // html body
    };

    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

        var score1;
        var score2;
        if (vote.metadata.vote_count == undefined){
          db.collection('fs.files').update({"_id" :vote._id },{$set : {"metadata.vote_count":1}});
          score1 = 1;
        }
        else{
          db.collection('fs.files').update({"_id" :vote._id },{$set : {"metadata.vote_count":vote.metadata.vote_count + 1}});
          score1 = vote.metadata.vote_count + 1;
        }

        var other;
        db.collection('fs.files').find({filename:request.body.other}).toArray(function(err, cur){
          if (err) { res.send(500) }
          other = cur[0];
          if (other.metadata.vote_count == undefined){
            db.collection('fs.files').update({"_id" :other._id },{$set : {"metadata.vote_count":0}});
            score2 = 0;
          } else {
            score2 = other.metadata.vote_count;
          }

          var scores = '[' + score1+',' + score2+']';
          response.send(scores);
        });
      });
    });


  });


  // PHOTO UPLOAD STUFF //
  app.post("/upload", upload.fields([{name:"photo", maxCount:1}, {name:"id_token", maxCount:1},{name:"challenge", maxCount:1}, {name:"name", maxCount:1},  {name:"email", maxCount:1}]), function(req, res, next){
    
    console.log(req.body);
    authenticate(req.body.id_token, function(user){

        
            db.collection('users').update({'id_token': user.sub},{$addToSet : {"challenges":req.body.challenge}});

            //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
        var writestream = gfs.createWriteStream({
          filename: req.files.photo[0].originalname,
          metadata:{email: req.body.email, name: req.body.name, vote_count:0, challenge:req.body.challenge}
        });
      //
      // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
        fs.createReadStream("./uploads/" + req.files.photo[0].filename)
          .on("end", function(){fs.unlink("./uploads/"+ req.files.photo[0].filename, function(err){res.render("pages/login");
                })}).on("err", function(){res.send("Error uploading image")})
              .pipe(writestream);

      });
  });



  app.get("/files", function(req, res){
      var files = [];
      db.collection('fs.files').find({"metadata.challenge":req.query.challenge}).sort({"metadata.vote_count":-1}).toArray(function (err, cursor) {
        if (err) { res.send(500) }
        for(var i = 0; i < cursor.length; i++)
          files[i] = cursor[i].filename;
        res.send(files);
  });
});

app.get("/scores", function(req, res){
  var files = [];
  db.collection('fs.files').find({"metadata.challenge":req.query.challenge}).sort({"metadata.vote_count":-1}).toArray(function (err, cursor) {
  if (err) { res.send(500) }
  for(var i = 0; i < cursor.length; i++){
    var entry = {filename:cursor[i].filename, user:cursor[i].metadata.name, score:cursor[i].metadata.vote_count};
    files[i] = entry;
  }
  res.send(files);
  });
});

app.post("/challenges", function(req, res){
  authenticate(req.body.id_token, function (user) {
      db.collection('users').find({id_token: user.sub}).toArray(function (err, cursor) {
        if (err) { res.send(500) }
        else {
          var challenges = cursor[0].challenges;
          if(challenges == undefined || challenges == null)
            res.send("[]"); 
          else
            res.send(challenges);
        }
      });
    });
});

  app.get("/random", function(req, res){

        var files = [];
        db.collection('fs.files').find({"metadata.challenge":req.query.challenge}).toArray(function (err, files) {
          if (err) { res.send(500) }
        if (files==undefined || files.length < 2)
          res.send("N");
        else{
          var file1 = files[Math.floor(Math.random()*files.length)].filename;
          var file2 = file1;
          while(file2 == file1)
            var file2 = files[Math.floor(Math.random()*files.length)].filename;
          res.send('["'+file1+'", "'+file2+'"]');
      
    }
  });
});  


  // sends the image we saved by filename.
  app.get("/:filename", function(req, res){
      var readstream = gfs.createReadStream({filename: req.params.filename});
      readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      readstream.pipe(res);
  });



  //delete the image
  app.get("/delete/:filename", function(req, res){
    gfs.exist({filename: req.params.filename}, function(err, found){
      if(err) return res.send("Error occured");
      if(found){
        gfs.remove({filename: req.params.filename}, function(err){
          if(err) return res.send("Error occured");
          res.send("Image deleted!");
        });
      } else{
        res.send("No image found with that title");
      }
    });
  });

});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});