/**
 * Created by administrator on 5/7/16.
 */

xdescribe('Watch Object Test Suite',function(){
    // Define an object
    var Shape = function(x,y){
        this.x = x;
        this.y = y;
    };
    // Test watch functionality
    it('should watch a value',function(){

           var shape = new Shape(1,1);
           expect(shape.x).toBe(1);

           var observer = function(prop,oldValue,newValue){
               expect(newValue).toBe(2);
               return newValue;
           };

           shape.watch('x',observer);
           shape.x = 2;
           expect(shape.x).toBe(2);
       }) ;
});
