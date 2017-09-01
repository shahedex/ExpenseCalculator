var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
process.env.NODE_ENV = 'production';

var url = 'mongodb://localhost:27017/expenses';

/* GET home page. */
router.get('/', function(req, res, next) {
  var result = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('history').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      result.push(doc);
    }, function() {
      db.close();
      res.render('index', { page: '/',items: result});
    });
  });
});

router.post('/insertamount', function(req, res, next){
  var item = {
    type : req.body.ttype,
    description : req.body.description,
    amount : req.body.amount
  };
  var names = item["type"];
	//console.log(names);
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection(names).insertOne(item, function(err, result){
    assert.equal(err, null);
    console.log("Item Successfully Inserted.");
    db.close();
    });
  });

  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection("history").insertOne(item, function(err, result){
    assert.equal(err, null);
    db.close();
    });
  });
  
  res.redirect('/' );
});

module.exports = router;
