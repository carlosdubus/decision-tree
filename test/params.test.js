var TBParams = new require("../src/params").TreeBuilderParams;

var chai = require("chai");
var expect = chai.expect;


describe("TreeBuilderParams",function(){
	it("should define the classes and attributes",function(){
		var params = new TBParams({
			attributes:['temp'],
			target:"play",
		});

		params.addInstance({play:"yes",serial:"12",temp:12});
		params.addInstance({play:"no",serial:"12",humidity:13});
		params.addInstance({play:"maybe",serial:"12",humidity:13,another:12});

		//expect(params.attributes).to.deep.equal(["temp","humidity","another"]);
		expect(params.classes).to.deep.equal(["yes","no","maybe"]);
	});
});