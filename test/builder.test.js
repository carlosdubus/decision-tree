var chai = require("chai");
var expect = chai.expect;
var lib = require("../src/lib");
var builder = require("../src/builder");
var TBParams = require("../src/params").TreeBuilderParams;
var load = require("./load");


var weatherParams = load.weather();

describe("builder",function(){
	describe("#createModel",function(){
		var decisionTree = builder.createDecisionTree(weatherParams);
		var data = {
			outlook:"sunny",
			temperature:"mild",
			humidity:"normal",
			windy:"true"
		};

		var predict = builder.createModel(decisionTree);

		expect(predict(data)).to.equal("yes");

	});
	describe("#createDecisionTree",function(){
		it("should return a LeafNode when there is only one class in the instances",function(){
			var params = new TBParams({
				attributes:["asd","asds"],
				target:"play"
			});
			params.addInstance({play:"yes",asd:1,asds:2});
			params.addInstance({play:"yes",asd:12,asds:22});
			params.addInstance({play:"yes",asd:13,asds:23});

			var tree = builder.createDecisionTree(params);
			expect(tree.result).to.equal("yes");
		});
		it("should return a LeafNode when there is no attributes",function(){
			var params = new TBParams({
				attributes:["asd","asds"],
				target:"play"
			});
			params.addInstance({play:"no",asd:1,asds:2});
			params.addInstance({play:"no",asd:12,asds:22});
			params.addInstance({play:"yes",asd:13,asds:23});

			params.attributes = [];

			var tree = builder.createDecisionTree(params);
			expect(tree.result).to.equal("no");
		});

		it("should build tree",function(){
			var tree = builder.createDecisionTree(weatherParams);
			expect(tree.attr).to.equal("outlook");
			expect(tree.branches["sunny"].attr).to.equal("humidity");
			expect(tree.branches["sunny"].branches["high"].result).to.equal("no");
			expect(tree.branches["sunny"].branches["normal"].result).to.equal("yes");
			expect(tree.branches["overcast"].result).to.equal("yes");
		});
	});
});