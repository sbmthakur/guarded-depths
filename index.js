/*
 * Use shortid for generating identifiers
 */
const shortid = require("shortid");

/*
 * Use express for serving APIs and 
 * static files
 */
const express = require("express");
const path = require("path");
const app = express();

const MongoClient = require("mongodb").MongoClient;
/* 
 * Connection URL
 * 'mlab' provides free Mongo instance for quick
 * prototyping. A big thanks to them!
 */
const url = "mongodb://root:root@ds123258.mlab.com:23258/guarded-depths";
 
// Database Name
const dbName = "guarded-depths";
 
// Use connect method to connect to the server
let collection; 

MongoClient.connect(url, function(err, client) {
  let db = client.db(dbName);
  collection = db.collection("test");
  /*
   * The following index will be used
   * for searching
   */
  collection.createIndex({ "name": "text" });
});

app.use(express.json());

/*
 * Static file directory which contains out angular project
 */
app.use(express.static(path.resolve(__dirname, "ui")));

/*
 * Middleware for all API requests
 * Handle CORS
 */
app.use("/skills", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

/*
 * API: Fetch all skills
 * Method: GET
 * Request body parameters:
 *  -> id
 *  -> name
 */
app.get("/skills/get", (req, res) => {

  collection.find({}).toArray((err, docs) => {
  
    docs.map(doc => {
      doc.id = doc._id;
      delete doc._id;
    });
    res.send(docs);    
  });
});

/*
 * API: Add skill 
 * Method: POST
 * Request body parameters:
 *  -> name
 *  -> status
 */
app.post("/skills/add", (req, res) => {
  
  let newSkill = {
    name: req.body.name,
    status: req.body.status
  };
  const id = shortid.generate();
  newSkill._id = id;    
  /*
   * Add new skill to our Mongo database
   */
  collection.insertOne(newSkill, (err, result) => {
    if(err) 
      res.status(500).send("Internal Error");
    else {
      res.send({"id": id});
    }
  });
});

/*
 * editProperty: This is used to set the status or name 
 * property of a skill. This is called by Edit API or the 
 * Change status API
 */
function editProperty({id, property, value, responseObject}) {

  const filter = {
    "_id": id 
  };
  const modifiedData = {
    "$set": {}
  };

  modifiedData["$set"][property] = value;

  collection.updateOne(filter, modifiedData, (err, result) => {
  
    if(err) {
      responseObject.status(500).send("Internal Error");
    }
    else {
      if(result.result.n === 0) {
        responseObject.status(401).send("Unauthorized");
      }
      else if (result.result.n === 1) {
        if(value === null)
          responseObject.send("null");
        else
          responseObject.send(value);
      }
    }
  });
}

/*
 * API: Edit skill name
 * Method: POST
 * Request body parameters:
 *  -> id
 *  -> name
 */
app.post("/skills/edit", (req, res) => {
 
  const id = req.body.id;
  let property, value;
  if(req.body.hasOwnProperty("name")) {
    property = "name"; 
  }
  else {
    property = "status"; 
  }
  value = req.body[property];

  editProperty({ id: id, property: property, value: value, responseObject: res });
});

/*
 * API: Update skill status
 * Request body parameters:
 *  -> id
 *  -> status
 */
app.post("/skills/status", (req, res) => {

  const id = req.body.id;

  let property, value;
  if(req.body.hasOwnProperty("name")) {
    property = "name"; 
  }
  else {
    property = "status"; 
  }
  value = req.body[property];

  const findFilter = {
    "_id": id
  };
  /*
   * We need to fetch the existing status
   * of the skill. This will be used to 
   * decide whether skill should be set to 
   * null or not.
   */
  collection.findOne(findFilter,(err, doc) => {
    if(err) {
      return res.status(500).send("Internal Error");  
    }

    if(!doc) {
      return res.status(401).send("Unauthorized");   
    }

    if(doc.status === value) {
      value = null;
    }

    editProperty({ id: id, property: property, value: value, responseObject: res });
  });
});

/*
 * API: Search skill by term
 * Request body parameters:
 *  -> id
 *  -> status
 */
app.get("/skills/search", (req, res) => {

  const findFilter = { $text: { $search: req.query.term}};
  collection.find(findFilter).toArray( (err, docs) => {
   
    if(err) {
      return res.status(500).send("Internal Error"); 
    }
    if(docs.length === 0) {
      res.status(204).send("Not Found");    
    }
    else {
    
      docs.map(doc => {
        doc.id = doc._id;
        delete doc._id;
      });
      res.send(docs);    
    }
  });
});
 
app.listen(process.env.PORT || 3000);
