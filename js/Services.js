
define(['angular','spin'],function(angular,spin){


	/**
	 * Created by Paschalis Thriskos
	 * Created on 15/05/2016
	 *
	 * Handle Server Response Pattern
	 * @param $q - injected AngularJS Deferred Service
	 * @param $http- injected AngularJS HTTP Service
	 * @constructor
	 */
	function ServerAPI($q,$http) {
		this.defered = $q.defer();
		this.$$http = $http;

	}
	// Inject $q, $http Services
	ServerAPI.$inject=['$q','$http'];
	ServerAPI.prototype.get = function(url, success_callback, failure_callback){
		var $this = this;
		$this.$$http({
			'method':'GET',
			'url': url,
			'cache': true
		}).then(
			function(response){
				$this.defered.resolve(success_callback(response));
			},
			function(response){
				$this.defered.reject(failure_callback(response));
			}
		);
	};

	/********************************************************
	 * Created by Paschalis Thriskos
	 * Created at 21/02/2016
	 * 
	 * Service to interact with backend
	 * 
	 ********************************************;************/
    
	DataService.$inject=['$http','$q','$cookies'];
	function DataService($http,$q,$cookies) {
		var userinfo;
		// Define our service
		var service = {
			getUserMenu : getUserMenu,
			updatePassword : changePassword,
			getUserInfo : getUserInfo,
			changePassword : changePassword,
			getDimoi : getPerfectureMap,
			ServerAPI : ServerAPI
		};
		
		// Retrieve user menu
		function getUserMenu(user){
			// Retrieve User Menu Data
			return $http.get('/auth/rs/umenu/'+user);			
		}

		// Retrieve user information
		function getUserInfo(){
			// Is user already retrieved
			userinfo = $cookies.getObject('userinfo');
			var deferred = $q.defer();
			if (angular.isDefined(userinfo))
				deferred.resolve(userinfo);
			else
				$http({ method: 'GET',
						url:'/auth/rs/umenu/info',
						cache: true})
					.then(function (response) {
						userinfo = new Object();
						var _names = response.data.name.split(" ");
						userinfo.firstName = _names[1];
						userinfo.lastName = _names[0];
						userinfo.loginName = response.data.uname;
						$cookies.putObject('userinfo',userinfo);
						deferred.resolve(userinfo);
					}, function (response) {						
						deferred.reject({msg:'Αδύνατη η ανάκτηση των πληροφοριών χρήστη'});
					});
			
			// Return the promise
			return deferred.promise;

		}
		
		// Change password
		function changePassword(user){

			if(angular.isDefined(user)){
				$http.post("/auth/rs/umenu/chgpwd",user).then(
					function(response){
						$('#infobody').html('<h4 class="text-success text-center">Επιτυχής αλλαγή συνθηματικού</h4>');
						$('#infobox').modal();						
					},
					function(response,status){
						//console.log(response.data);
						$('#infobody').html('<h4 class="text-danger text-center">'+response.data.error+'</h4>');
						$('#infobox').modal();
					});
			}
			else
				console.log('DataService - Change Password : User object is not defined');
		}

		// Retrieve Perfecture Map
		function getPerfectureMap(){
			// Create a promise object
			var deferred = $q.defer();

			// Retrieve perfectures topojson file
			$http({
				method: 'GET',
				url: '/data/dimoi.topojson',
				cache: true
			}).then(function(response){

			},function(response,status){
				deferred.reject({msg:'Αδύνατη η ανάκτηση των πληροφοριών χρήστη',status:status})
			});

			// Return promise object
			return defered;
		}


		// Return the factory service object
		return service;
	}
	
	// Define module and register services
	var services = angular.module('services.Services',[]);
	services.factory('DataService',DataService);

	return services;

});
