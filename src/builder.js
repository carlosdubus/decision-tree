var lib = require("./lib");

/**
 * [AttributeNode description]
 * @param {[type]} attr [description]
 */
function AttributeNode(attr){
	this.attr = attr;
	this.branches = {};
}

/**
 * [LeafNode description]
 * @param {[type]} result [description]
 */
function LeafNode(result){
	this.result = result;
}

/**
 * [buildTree description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var createDecisionTree = exports.createDecisionTree = function (params){
	var instances = params.instances;
	var attributes = params.attributes;
	if(!instances.length || instances.length < 0){
		throw "empty instances";
	}

	var classPr = lib.getClassProbability(params);
	//console.log(classPr);return;
	var mostProbableClass = lib.getMostProbableClass(classPr);

	if(mostProbableClass.p == 1 || attributes.length == 0){
		return new LeafNode(mostProbableClass.class);
	}

	//console.log(lib.getTreeStumps(params));return;
	var splitAttribute = lib.getSplittingAttribute(params);
	var newAttributes = attributes.filter(function(a){
		return a != splitAttribute.attribute;
	});

	var node = new AttributeNode(splitAttribute.attribute);
	node.classPr = classPr;
	node.mostProbableClass = mostProbableClass;

	for(var k in splitAttribute.possibleValues){
	//var possibleValues = [1,2,3,4,5,6,7,8,"NA"];
	//for(var k=0;k<possibleValues.length;k++){
		var possibleValue = splitAttribute.possibleValues[k].attrValue;
		//var possibleValue = possibleValues[k];
		var newInstances = instances.filter(function(a){
			return a[splitAttribute.attribute] === possibleValue;
		});


		node.branches[possibleValue] = createDecisionTree(lib.extend({},params,{
			attributes:newAttributes,
			instances:newInstances
		}));
	
	}

	return node;


}

/**
 * [predictClass description]
 * @param  {[type]} decisionTree [description]
 * @param  {[type]} data         [description]
 * @return {[type]}              [description]
 */
var createModel = exports.createModel = function(decisionTree){

	function predict(data,node){
		if(!node){
			return "NA";
		}

		if(node.result !== undefined){
			return node.result;
		}
		//console.log(node.attr+" == "+data[node.attr]);
		var value = data[node.attr] === undefined ? "NA" : data[node.attr];
		/*if(!node.branches[value]){
			return node.mostProbableClass.class;
		}*/
		return predict(data,node.branches[value]);
	}

	return function(data){
		return predict(data,decisionTree);
	};


}
