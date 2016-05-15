/**
 * Created by Paschalis Thriskos on 15/2/2016.
 */

// RequireJS configuration 
requirejs.config({
    paths: {
        'jquery':           'jquery.min',
        'chroma':           'chroma.min',
        'angular':          'angular.min',
        'route':            'angular-route.min',
        'cookies':          'angular-cookies.min',
        'message':		    'angular-messages.min',
        'spinner':          'angular-spinner.min',
        'spin'  :           'spin.min',
        'leaflet':          'leaflet',
        'leaflet-providers': 'leaflet-providers',
        'topojson':         'topojson.v1.min',
        'map':              'map'
    },
    shim:{
        'jquery': {
            exports: '$'
        },
        'chroma': ['jquery'],
        'bootstrap': ['jquery'],
        'route': {
            deps:['angular'],
            exports:'angular'
        },
        'cookies': {
            deps:['angular'],
            exports:'angular'
        },
        'message': {
            deps:['angular'],
            exports:'angular'
        },
        'angular': {
            deps: ['jquery'],
            exports:'angular'
        },
        'spin' : {
        	deps: ['jquery'],
        	exports : 'spin'
        },
        'spinner': {
            deps: ['angular','spin'],
            exports:'angular'
        },
        'leaflet': {
            deps: ['jquery'],
            exports: 'L'
        },
        'leaflet-providers': ['leaflet'],
        'map': ['leaflet','topojson','chroma']

    }
});

// Kick-off application
require(['domReady','jquery','leaflet','route','message','cookies','leaflet-providers',
        'map','chroma','Services','Controllers','Directives','Filters'],
        function(domReady, $, L, angular){

            // Extend Leaflet to handle TopoJSON format
            L.TopoJSON = L.GeoJSON.extend({
                addData: function(jsonData) {
                    if (jsonData.type === "Topology") {
                        for (var key in jsonData.objects) {
                            geojson = topojson.feature(jsonData, jsonData.objects[key]);
                            L.GeoJSON.prototype.addData.call(this, geojson);
                        }
                    }
                    else {
                        L.GeoJSON.prototype.addData.call(this, jsonData);
                    }
                }
            });

            angular.module('maps',['ngRoute','ngMessages','ngCookies',
                                    'services.Services',
                                    'services.Controllers',
                                    'services.Directives']);

            // Bootstrap Angular Application
            angular.bootstrap(document,['maps']);


        },function(err){
            // Log requireJS errors
            console.log(err);
        });