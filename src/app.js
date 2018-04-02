import angular from 'angular';
import {Task} from './models';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {LengthValidator} from "./directives";
import 'angular-route';
import addTaskTemplate from "./views/add.html";
import editTaskTemplate from "./views/edit.html";
import 'angular-resource';

const app = angular.module('todoApp',['ngRoute', 'ngResource']);

app.factory('todoFactory', function(){
    const taskList = [];
    return {
        getTasks: function getTasks(isDone){
            return taskList.filter((item)=>{return item.isDone === isDone});
        },
        getTaskById: function getTaskById(id){
            return taskList.find((item)=>{
                console.log(Number.parseInt(id), item.id,item.id === Number.parseInt(id));
                return item.id === Number.parseInt(id);
            });
        },
        addTask: function addTask(text){
            taskList.push(Task.create(taskList[taskList.length-1].id+1, text));
        },
        finishTask: function finishTask(id){
            taskList.find((item)=>{return item.id===id}).finish();
        },
        editTask: function editTask(id, name){
            taskList.find((item)=>{return item.id===id}).name = name;
        },
        uploadTasks: function uploadTasks(tasks){
            taskList.push(...tasks.map((item)=>{
                const task = new Task(item.id, item.name);
                task.isDone = item.isDone;
                return task;
            }));
        },
        tasks: taskList
    }
});

app.controller('todoController', ['$scope', '$resource', 'todoFactory', function($scope, $resource, todoFactory){
    $scope.newTaskName ='';
    $scope.tasks = todoFactory.tasks;
    const todosUploader = $resource('/todos.json');
    todosUploader.query(function(data){
        todoFactory.uploadTasks(data);
    });
    $scope.finishTask = function(id) {
        todoFactory.finishTask(id);
    }
    $scope.getTasks = todoFactory.getTasks;
    $scope.$watchCollection('tasks', function(newNames, oldNames) {
    });
}]).controller('addTaskController',['$scope', '$routeParams', 'todoFactory', function($scope, $routeParams, todoFactory){
    $scope.addTask = function(task){
        const name = task.name;
        todoFactory.addTask(name);
    }
}]).controller('editTaskController',['$scope', '$routeParams', '$location', 'todoFactory', function($scope, $routeParams, $location, todoFactory){
    $scope.editTask = function(task){
        todoFactory.editTask(task.id, task.name);
    }
    console.log($routeParams.id);
    const task = todoFactory.getTaskById($routeParams.id);
    if(task){
        $scope.task = {};
        $scope.task.id = task.id;
        $scope.task.name = task.name;
    } else {
        $location.path('/');
    }
}])
.directive('lengthValidator', () => new LengthValidator)
.config(function($routeProvider) {
    $routeProvider
    .when("/admin/article/:id/edit", {
        template : editTaskTemplate,
        controller: "editTaskController"
    })
    .when("/admin/article/add", {
        template : addTaskTemplate,
        controller: "addTaskController"
    });
}).config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }]);