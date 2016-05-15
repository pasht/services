/**
 * Created by administrator on 5/7/16.
 */


describe('Change Password Test Suite',function(){
    // Set fixture path
    jasmine.getFixtures().fixturesPath = 'base/tests/fixtures';

    it('should have fixtures installed',function(){
        expect(loadFixtures).toBeDefined();
    });


    describe('JQuery watch',function(){
        beforeEach(function(){
          setFixtures('<input id="test" type="text">');

        });

        it('watch should be defined',function(){
            expect(jQuery.fn.watch).toBeDefined();
        });

        xit('should watch value change',function(){
            var spyEvent = spyOnEvent('#test','change');
            $('input').val('2').trigger('change');
            expect(spyEvent).toHaveBeenTriggered();
            expect($('input').val()).toEqual('2');

            var obj = { prop: 123 };
            $(obj).watch('prop', function(propName, oldVal, newVal){
                log('Prop has been changed to ' + newVal);
            });
        });
    });

    describe('Login In Form',function(){
        beforeEach(function(){
            jasmine.getFixtures().load('login.html');
            CHPWDModule.init();
            jasmine.Ajax.install();
        });

        afterEach(function() {
            jasmine.Ajax.uninstall();
        });

        it('should be a form with two input elements and a submit button',function(){
            expect($('form')[0]).toBeInDOM();
            expect($('input').length).toBe(3);
        });

        it('should disable submit button',function(){
            var username = $('#username');
            expect(username).toBeDefined();
            username.val('123');
            expect($('input[type="submit"]')).not.toBeDisabled();
        });

        it('should submit to correct address',function(){
            $('form').submit();
            var response = jasmine.Ajax.requests.mostRecent();
            // Check correct url
            expect(response.url).toEqual('/services/rest/resetpwd');
            // Check correct method
            expect(response.method).toEqual('POST');
        });

        it('should error growl appear',function(){
            spyOn($.growl,'error');
            $('form').submit();
            jasmine.Ajax.requests.mostRecent().respondWith({
                "status": 401,
                "contentType": "application/json",
                "responseText": '{"error": "A Error has occured"}'
            });
            expect($.growl.error).toHaveBeenCalled();
        });

        it('should success growl appear',function(){
            spyOn($.growl,'notice');
            $('form').submit();
            jasmine.Ajax.requests.mostRecent().respondWith({
                "status": 200,
                "contentType": "application/json"
            });
            expect($.growl.notice).toHaveBeenCalled();
        });

    });





});
