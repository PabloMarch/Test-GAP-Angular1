/* GAP SHOWCASE TEST
 * This app metodology was based on bit.ly/ng-browserify
 */
'use strict';

var angular = require('angular');

require('angular-route');

var app = angular.module('showcaseApp', ['ngRoute']);

require('./services');
require('./controllers');

app.config(['$routeProvider', function($routeProvider) {

  $routeProvider
    .when('/', {
      templateUrl : './views/product-list.html',
      controller  : 'ProductList'
    })
    .when('/products/:productId', {
      templateUrl : './views/product-detail.html',
      controller  : 'ProductDetail'
    })
    .otherwise({
      redirectTo: '/'
    });

}]);
