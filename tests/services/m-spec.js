/**
 * Created by administrator on 5/13/16.
 */
'use strict';
define(['mocks','../../js/Services'],function(mocks,Services){

    describe('Test Server Pattern',function(){
        var Server;
        beforeEach(function(){
            module('services.Services');
            var $injector = angular.inject(['services.Services']);
            var q = $injector.get('$q');
            Server = new Services.ServerAPI($injector.get('$q'),
                                            $injector.get('$http'));
            jasmine.Ajax.install();
        });

        it('should call ajax request',function(){
            var spySB = jasmine.createSpy('Success callback');
            var spyFC = jasmine.createSpy('Failure callback');

            Server.get('url',spySB,spyFC);
            jasmine.ajax.requests.mostRecent().respondWith({
                status: 200,
                response :{ data:{"msg":"Hello"}}
            });

            expect(spySB).toHaveBeenCalled();




        });


        afterEach(function(){
           jasmine.Ajax.uninstall();
        });

    });

    var q,http;
    it('angular mocks should be defined',function(){
        expect(mocks).toBeDefined();
    });
    beforeEach(module('services.Services'));



    /*beforeEach(inject(function(_$injector_){
        var $injector = _$injector_;
        q= $injector.get('$q');
        http = $injector.get('$http');
        var ds = $injector.get('DataService');
    }));*/
    //
    //describe('SERVICE Test Suite',function(){
    //   it('should have injected dependencies',function(){
    //      expect(q).toBeDefined();
    //       expect(http).toBeDefined();
    //   });
    //});
});
