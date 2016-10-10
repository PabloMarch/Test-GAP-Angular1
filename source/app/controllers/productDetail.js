'use strict';
module.exports = function($scope, $routeParams, $filter, $sce, RequestData) {
  var productKey = $routeParams.productId;

  function getProduct(products) {
    return $filter('filter')(products, {key: productKey}, true);
  };

  RequestService.getPromise().then(function(data) {
    $scope.product = getProduct(data)[0];
    $scope.description = $sce.trustAsHtml($scope.product.description);

    console.log($scope.description);
  });
};