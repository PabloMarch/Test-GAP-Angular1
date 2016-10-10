'use strict';
module.exports = function($scope, RequestData) {

  $scope.selectedProducts = [];

  $scope.compare = function (product, index) {

    if($scope.selectedProducts.length < 2 || product.selected) {

      if(product.selected) {
        $scope.selectedProducts.splice(index, 1);
      } else {
        $scope.selectedProducts.push(product);
      }

      product.selected = !product.selected;

    } else {
      alert('You can\'t compare more than two cars');
    }

    console.log(index, $scope.selectedProducts);
  };

  RequestService.getPromise().then(function(data) {
    $scope.products = data;
  });
};