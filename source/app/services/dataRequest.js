'use strict';
module.exports = function($http){
  this.promise = null;

  function makeRequest() {
    return $http.get('./data.json')
      .then(function(resp){
        return resp.data;
      });
  };

  this.getPromise = function(update){
    if (update || !this.promise) {
      this.promise = makeRequest();
    }
    return this.promise;
  };
};