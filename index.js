var _=require('lodash');

var a = [0.1,3,5,3.2,4.67,8];

function partition(values,ranges){
	// Is ranges a numberic 
	if(!Array.isArray(values))
		throw new Error('The first argument must be an array');

	// Sort are
	values.sort();
	var _range = [];
	if (!isNaN(ranges) && isFinite(ranges)){
		var fValue = values[0],lValue = values[values.length-1],
			step = Math.floor((lValue-fValue)/ranges),
			val = fValue;
		_range.push(val);
		while(val<lValue){
			val += step;
			_range.push(val);
		}
	}
	else
		_range = ranges;
	return _range;

}


console.log('Lodash successfully loaded');
var b = partition([1,10],2);
console.log(b);
