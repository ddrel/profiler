'use strict';
(function(){
    FCC.config(['$stateProvider','$urlRouterProvider', '$httpProvider',function($stateProvider, $urlRouterProvider, $httpProvider) {
                $urlRouterProvider.otherwise('main');
                $stateProvider
                            .state('home', {
                                  url: '/',
                                  templateUrl: '/home/views/index.html'
                              })
                              .state('home.faqs', {
                                  url: 'main',
                                  templateUrl: '/profiler/views/faqs.html'
                              })
                              .state('home.main', {
                                  url: 'main',
                                  templateUrl: __user__.isAdmin?'/home/views/main.html':'/home/views/guest.html'
                              })
                              .state('home.question', {
                                  url: 'question',
                                  templateUrl: '/home/views/question.html'
                              })
                              .state('home.users', {
                                  url: 'users',
                                  templateUrl: __user__.isAdmin?'/home/views/user.html':'/home/views/noaccess.html'
                              })
                              .state('home.manage', {
                                  url: 'manage',
                                  templateUrl:  __user__.isAdmin?'/questionnaire/views/questionnaire.html':'/home/views/noaccess.html'
                              })
                              .state('home.events', {
                                  url: 'events',
                                  templateUrl: __user__.isAdmin?'/home/views/events.html':'/home/views/noaccess.html'
                              })

         }]).run(function($rootScope, $state, $urlMatcherFactory) {
                $rootScope.$state = $state;
                function message(to, toP, from, fromP) { return from.name  + angular.toJson(fromP) + " -> " + to.name + angular.toJson(toP); }
                $rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) { console.log("Start:   " + message(to, toP, from, fromP)); });
                $rootScope.$on("$stateChangeSuccess", function(evt, to, toP, from, fromP) { console.log("Success: " + message(to, toP, from, fromP)); });
                $rootScope.$on("$stateChangeError", function(evt, to, toP, from, fromP, err) { console.log("Error:   " + message(to, toP, from, fromP), err); });
            });
})();
