var chai = require("chai");
var expect = chai.expect;
var lib = require("../src/lib");
var load = require("./load");


var weatherParams = load.weather();

describe("lib",function(){
	it("#info",function(){
		expect(lib.info([[2,3]]).toFixed(3)).to.equal('0.971');
		expect(lib.info([[2,3],[4,0],[3,2]]).toFixed(3)).to.equal('0.694');
	});
	/*it("#updateTreeInfo",function(){
		var tree = {
			attribute:"outlook",
			possibleValues:{
				"sunny":{"yes":2,"no":3},
				"overcast":{"yes":4,"no":0},
				"rainy":{"yes":3,"no":2}
			}
		};
		lib.updateTreeInfo(tree);

		expect(tree.info.toFixed(3)).to.equal('0.694')
		expect(tree.gain.toFixed(3)).to.equal('0.247')
	});*/
	it("#getTreeStumps",function(){
		var treeStumps = lib.getTreeStumps(weatherParams);

		//console.log(treeStumps['outlook']);

		expect(treeStumps['outlook'].info.toFixed(3)).to.equal('0.694');
		expect(treeStumps['outlook'].gain.toFixed(3)).to.equal('0.247');
		expect(treeStumps['temperature'].info.toFixed(3)).to.equal('0.911');
		expect(treeStumps['temperature'].gain.toFixed(3)).to.equal('0.029');
		expect(treeStumps['humidity'].info.toFixed(3)).to.equal('0.788');
		expect(treeStumps['humidity'].gain.toFixed(3)).to.equal('0.152');
		expect(treeStumps['windy'].info.toFixed(3)).to.equal('0.892');
		expect(treeStumps['windy'].gain.toFixed(3)).to.equal('0.048');
	});

	it("#getClassProbability",function(){
		var P = lib.getClassProbability(weatherParams);
		expect(P["yes"].count).to.equal(9);
		expect(P["yes"].p.toFixed(3)).to.equal("0.643");
		expect(P["no"].count).to.equal(5);
		expect(P["no"].p.toFixed(3)).to.equal("0.357");

	});

	it("#getMostProbableClass",function(){
		var P = lib.getClassProbability(weatherParams);
		var M = lib.getMostProbableClass(P);

		expect(M.class).to.equal("yes");
	});

	it("#getSplittingAttribute",function(){
		var splitAttribute = lib.getSplittingAttribute(weatherParams);

		expect(splitAttribute.attribute).to.equal("outlook");
	});

	it("#extend",function(){
		var params1 = {a:"test",b:"bvalue"};
		var params2 = lib.extend({},params1,{b:"bvalue2"});
		
		expect(params1.b).to.equal("bvalue");
		expect(params2.b).to.equal("bvalue2");
	});
});