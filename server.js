const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

var users = [
    { "id": 1, "name": "John" },
    { "id": 2, "name": "Mike" },
    { "id": 3, "name": "Amber" },
    { "id": 4, "name": "Laura" }
];
var tasks = [];
var taskIdIncrementor = 0;

app.get('/users', function (req, res) {
    res.json({users:users})
});

app.get('/tasks', function (req, res) {
    res.json({tasks:tasks})
});

app.post('/authenticate', function (req, res) {
    var authStatus = false;

    if(req.body.username && req.body.password && req.body.username === req.body.password) {
        authStatus = true;
    }
    res.json({authenticated: authStatus})
});

app.post('/task/add', function (req, res) {
    var task = req.body.task;

    if(!task || !task.description) {
        return res.json({error:"Wrong data"});
    }
    taskIdIncrementor++;
    task.id = taskIdIncrementor;
    tasks.push(task);

    res.json({task: task})
});

app.get('/task/start/:userId/:taskId', function (req, res) {
    var userId = parseInt(req.params.userId);
    var taskId = parseInt(req.params.taskId);

    var user = getUserById(userId);
    var task = getTaskById(taskId);

    if(!user){
        return res.json({error:"Wrong user id"});
    }

    if(!task){
        return res.json({error:"Wrong task id"});
    }

    user.taskId = taskId;
    user.startTime = new Date().getTime();

    return res.json({task: task, user: user});
});

var getUserById = function(userId){
    for(var i=0; i<users.length; i++){
        if(users[i].id === userId){
            return users[i];
        }
    }
};

var getTaskById = function(taskId){
    for(var i=0; i<tasks.length; i++){
        if(tasks[i].id === taskId){
            return tasks[i];
        }
    }
};

app.listen(3000, function () {
    console.log('Running on 3000')
});