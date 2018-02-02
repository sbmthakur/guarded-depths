const shortid = require("shortid");
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "ui")));
app.use('/skills', function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const data = {};

/*
 * API: Fetch all skills
 * Method: GET
 * Request body parameters:
 *  -> id
 *  -> name
 */
app.get("/skills/get", (req, res) => {

  const skillIds = Object.keys(data);
  let skillList = []
  for(let skillId of skillIds) {
  
    skillList.push({
      "id": skillId,
      "name": data[skillId].name,
      "status": data[skillId].status
    });
  }
  res.send(skillList);
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
  data[id] = newSkill;
  console.log(data);
  res.send({"id": id});
});

/*
 * API: Edit skill name
 * Method: POST
 * Request body parameters:
 *  -> id
 *  -> name
 */
app.post("/skills/edit", (req, res) => {
 
  const id = req.body.id;

  if(data.hasOwnProperty(id)) {
    data[id].name = req.body.name;
    res.send("Success");
  }
  else {
    res.status(401).send("Unauthorized"); 
  }
});

/*
 * API: Update skill status
 * Request body parameters:
 *  -> id
 *  -> status
 */
app.post("/skills/status", (req, res) => {
console.log('ressss', req.body) 
  const id = req.body.id;
  if(data.hasOwnProperty(id)) {
    
    if(data[id].status === req.body.status) {
    
      data[id].status = null;
      console.log('lllol')
      res.send("null");
    }
    else {
    
      data[id].status = req.body.status;
      res.send(data[id].status);
    }
  }

  else {
    res.status(401).send("Unauthorized"); 
  }
});

/*
 * API: Search skill by term
 * Request body parameters:
 *  -> id
 *  -> status
 */
app.get("/skills/search", (req, res) => {
 
  let found = false;
  let id;
  let searchData = [];
  for(id in data) {
    
    if(data[id].name === req.query.term) {
      found = true;
      searchData.push({
        "id": id,
        "name": data[id].name,
        "status": data[id].status
      });
    }
  }

  if(found) {
    res.send(searchData); 
  }
  else {
    res.status(204).send("Not Found");   
  }
});
 
app.listen(process.env.PORT || 3000);
