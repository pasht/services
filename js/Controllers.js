define(['angular','spinner'],function(angular){

	var _body = document.getElementsByTagName('body')[0],
		spinner;
	
	/*****************************************************************************
	 * Created by Paschalis Thriskos
	 * Created at 21/01/2016
	 * 
	 * Controller for menu, change password, change user data and statistics pages
	 * 
	 *****************************************************************************/
	// Inject Dependencies
   MenuController.$inject = ['$scope','DataService','userinfo'];
    
    //Controller definition
    function MenuController($scope,DataService,userinfo){

       
    };
        	
	/**********************************************************************************
	 * Created by Paschalis Thriskos
	 * Created at 05/02/2016
	 * 
	 * Controller for navigation bar
	 *
	 **********************************************************************************/

	//Inject Dependencies
	SiteController.$inject = ['$scope','$location','$rootScope','DataService','$cookies'];
	
	// Controller definition	
	function SiteController($scope,$location,$rootScope,DataService,$cookies,Specialty,Units){

	}

	//Create module and register controllers
	var controllers = angular.module('services.Controllers',[]);
	
	controllers
		.controller('MenuController',MenuController)
		.controller('SiteController',SiteController);
	
	
	return controllers;
});