app.controller('testController', function($scope, $http) {

    const BASE_URL = "http://guarded-depths-89920.herokuapp.com/skills"
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

    /*
     * Load data from server
     */
    $scope.loadData = function() {
        $http.get(BASE_URL + '/get').then(function(res) {
            if (res.status !== 200) {
                alert("Could not fetch data from server. Try again.");
                return;
            }
            $scope.skillList = res.data;
        });
    }

    $scope.loadData();

    /*
     * addSkill: Add a new skill through Add 
     * skil API
     */
    $scope.addSkill = function() {

        $http
            .post(BASE_URL + '/add', {
                name: $scope.addSkills.name,
                status: $scope.addSkills.status
            })
            .then(function(res) {

                if (res.status !== 200) {
                    alert("Could not fetch data from server. Try again.");
                    return;
                }
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

    /*
     * editSkill: Edit an existing skill through 
     * Edit skill API
     */
    $scope.editSkill = function(obj) {
        $http
            .post(BASE_URL + '/edit', {
                id: obj.id,
                name: obj.name
            })
            .then(function(res) {

                if (res.status !== 200) {
                    alert("Could not fetch data from server. Try again.");
                    return;
                }
                var a = $scope.skillList.indexOf(obj);
                $scope.skillList[a] = {
                    "id": obj.id,
                    "name": obj.name,
                    "status": obj.status
                }
                $scope.openEdit = false;
            });
    }

    /*
     * changeStatus: Change the status of an existing 
     * skill through the change of skill API 
     */
    $scope.changeStatus = function(id, name, status) {

        $http
            .post(BASE_URL + '/status', {
                id: id,
                status: status
            })
            .then(function(res) {

                if (res.status !== 200) {
                    alert("Could not fetch data from server. Try again.");
                    return;
                }
                
                let statusCode = res.status;

                if (statusCode !== 200)
                    return;
                let newStatus = res.data;
                if (res.data === "null")
                    newStatus = null;

                let obj = {

                    "id": id,
                    "name": name,
                    "status": status
                }

                for (let skill of $scope.skillList) {

                    if (skill.id === id) {
                        skill.status = newStatus;
                        break;
                    }
                }
                $scope.openEdit = false;
            });
    }

    /*
     * search: Fetch results corresponding to a 
     * term through the Skill search API
     */
    $scope.search = function() {
        console.log('ssdfsdf', $scope.searchSkill)
        $http.get(BASE_URL + '/search?term=' + $scope.searchSkill.term).then(function(res) {
            if (res.status === 204) {
                alert("Skill not found");
                return;
            }
            $scope.skillList = res.data;
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
