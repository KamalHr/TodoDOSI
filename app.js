'use strict';

var myApp = angular.module('myApp', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {   
	$routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
    })
    .when('/posts', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
    })
    .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl',
    })
    .when('/users/:id/todos', {
        templateUrl: 'views/todos.html',
        controller: 'TodoCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);
myApp.factory('data', ['$http', ($http) => {
    return {
        getPosts : () => {
            return $http.get('http://jsonplaceholder.typicode.com/posts');
        },
        getUsers : () => {
            return $http.get('http://jsonplaceholder.typicode.com/users');
        },
        getTodos : () => {
            return $http.get('http://jsonplaceholder.typicode.com/todos');
        },
        getUser : (id) => {
            return $http.get('http://jsonplaceholder.typicode.com/users/'+id);
        }
    }
}]);
myApp.controller('HomeCtrl', ['$scope', ($scope) => {
    
}]);
myApp.controller('PostsCtrl', ['$scope', 'data', ($scope, data) => {
    $scope.search = '';
    $scope.reverse = false;
    $scope.orderBy = 'name';
    data.getPosts().then((res) => {
        $scope.posts = res.data;
        data.getUsers()
        .then((resp) => {
            $scope.users = resp.data;
            setTimeout(() => {
                $(document).ready(() => {
                    $('.collapsible').collapsible();
                    $('select').material_select();
                });
            }, 0);
        });
    });
}]);
myApp.controller('UsersCtrl', ['$scope', 'data', ($scope, data) => {
    data.getUsers()
    .then((resp) => {
        $scope.users = resp.data;
    });
}]);
myApp.directive('todo', function() {
    return {
        templateUrl: './views/todo.html',
        controller: ['$scope', '$rootScope', 'data', ($scope, $rootScope, data) => {
            if(!$rootScope.todos)
            data.getTodos()
            .then((res) => {
                $rootScope.todos = res.data;
            })
        }]
    }
});
myApp.controller('TodoCtrl', ['$scope', '$routeParams', 'data', ($scope, $routeParams, data) => {
    $scope.userId = { userId:  $routeParams.id};
    data.getUser($scope.userId.userId)
    .then((res) => {
        $scope.user = { name : res.data.name};
    });
}]);