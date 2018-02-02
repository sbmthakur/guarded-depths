app.controller('testController', function($scope, $http) {

    $scope.skillList = [];
    $scope.showAdd = false;
    $scope.addSkills = {
        "id": "",
        "name": "",
        "status": null
    }
    
    $scope.searchSkill = {
        "term": ""
    }
    
    $scope.loadData = function(){
              $http.get('http://l:3000/skills/get').then(function(res){
                console.log('RS:', res.data)
                   $scope.skillList = res.data;
                   console.log('LEN', $scope.skillList.length)
              })
         }

    $scope.loadData();

//    $scope.skillList.push(JSON.parse(localData))

    $scope.addSkill = function() {

        $http
            .post('http://l:3000/skills/add', {
                name: $scope.addSkills.name,
                status: $scope.addSkills.status
            })
            .then(function(res) {
                console.log('RRR: ', res)
                alert('Skill added successfully!');
                //To be removed..
                let newData = {

                    id: res.data.id,
                    name: $scope.addSkills.name,
                    status: $scope.addSkills.status
                }
                console.log(newData)
                $scope.skillList.push(newData);
                $scope.addSkills = {
                    "id": "",
                    "name": "",
                    "status": null
                }
            });
    }

    $scope.editSkill = function(obj) {
        $http
            .post('http://l:3000/skills/edit', {
                id: obj.id,
                name: obj.name
            })
            .then(function(res) {

                var a = $scope.skillList.indexOf(obj);
                $scope.skillList[a] = {
                    "id": obj.id,
                    "name": obj.name,
                    "status": obj.status
                }

                $scope.openEdit = false;
                //localStorage.setItem('data', JSON.stringify(obj))


            });
    }

    $scope.changeStatus = function(id, name, status) {
        console.log("Your skill is ", id, status)
        
        $http
            .post('http://l:3000/skills/status', {
                id: id,
                status: status
            })
            .then(function(res) {
                let statusCode = res.status;

                if( statusCode !== 200)
                  return;
                let newStatus = res.data;
                if(res.data === "null")
                  newStatus = null;
                
                let obj = {

                  "id": id,
                  "name": name,
                  "status": status
                }


                  for(let skill of $scope.skillList) {

                    if(skill.id === id) {
                      skill.status = newStatus;
                      break;
                    }
                  }
                  

                   $scope.openEdit = false;
                  //localStorage.setItem('data', JSON.stringify(obj))
                  

            });
    }
    
     $scope.search = function(){
         console.log('ssdfsdf', $scope.searchSkill)
         $http.get('http://l:3000/skills/search?term=' + $scope.searchSkill.term).then(function(res){
        console.log(res.status)
                if(res.status === 204){ 
                  alert("Skill not found");
                  return;
                }
                console.log('RSdd:', res.data)

                   $scope.skillList = res.data;
                   console.log('LEN', $scope.skillList.length)
          })
     }
     
})

/***************************************************************************************

            Please refer below angular code for calling apis

***************************************************************************************/

/*

   $http.get('/api/skills').then(function(res) {

        Must return below array of json
        *******************************************************
          Sample JSON
        *******************************************************
        [{
          "id": "",
          "name": "",
          "status": null   //for approval (0 or 1)
        }]


    $scope.skillList = res.data;
 });



  //Add
  $scope.add = function() {
   $http
    .post('/api/skills', { name: $scope.data.name, status: $scope.data.status })
    .then(function(res) {
      alert('Skill added successfully!');
    });
  }

  Edit

  $scope.edit = function(index) {
    $scope.data = $scope.skillList[index];
    $http
      .put('/api/skills/'+ id +'/update', { name: $scope.data.name })
      .then(function(res) {
        alert('Skill updated Successfully');
      });
    $scope.openEdit = false;
  }


  //Change Statuys

  $scope.status = function(index, status){
    //Approve
    $http
      .put('/api/skills/'+ id +'/approve', { status: status })
      .then(function(res) {
        alert('This skill is ' + (status === 1 ? 'Approved' : 'Rejected'));
      });
  }

*/