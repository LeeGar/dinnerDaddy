
'use strict';

describe('AuthController', function () {
  var $scope, $rootScope, $location, $window, $httpBackend, createAuthController, Auth;
  beforeEach(module('dinnerDaddy'));
  beforeEach(inject(function ($injector) {

    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    $httpBackend = $injector.get('$httpBackend');
    Auth = $injector.get('Auth');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createAuthController = function () {
      return $controller('AuthController', {
        $scope: $scope,
        $window: $window,
        $location: $location,
        Auth: Auth
      });
    };

    createAuthController();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.localStorage.removeItem('com.dinnerDaddy');
  });

  it('should have a signup method', function () {
    expect($scope.signup).to.be.a('function');
  });

  it('should store token in localStorage after signup', function () {
    // create a fake JWT for auth
    var token = 'abcd';

    // make a 'fake' reques to the server, not really going to our server
    $httpBackend.expectPOST('/api/users/signup').respond({token: token});
    $scope.signup();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.dinnerDaddy')).to.equal(token);
  });

  it('should have a signin method', function () {
    expect($scope.signin).to.be.a('function');
  });

  it('should store token in localStorage after signin', function () {
    // create a fake JWT for auth
    var token = 'efgh';
    $httpBackend.expectPOST('/api/users/signin').respond({token: token});
    $scope.signin();
    $httpBackend.flush();
    expect($window.localStorage.getItem('com.dinnerDaddy')).to.equal(token);
  });
});