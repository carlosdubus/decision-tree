var fs = require("fs");
var TBParams = new require("../src/params").TreeBuilderParams;
exports.weather = function(){
	var attributes = ["outlook","temperature","humidity","windy","play"];
	var lines = fs.readFileSync(__dirname+"/fixtures/weather.data",{encoding:"utf8"}).split("\r\n");
	//console.log(lines);return;
	var builder = new TBParams({
		attributes:["outlook","temperature","humidity","windy"],
		target:"play"
	});
	for(var i=0;i<lines.length;i++){
		var instance = {};
		var insData = lines[i].split(",");
		for(var h =0;h<attributes.length;h++){
			instance[attributes[h]] = insData[h];
		}

		builder.addInstance(instance);
	}
	return builder;
}