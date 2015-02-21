/**
 * Returns the values of an object as an array
 * @param  {Object} obj [description]
 * @return {Array}     [description]
 */
function values(obj){
	var v = [];
	for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
	        var val = obj[key];
	        v.push(val);
	    }
	}
	return v;
}

/**
 * [extend description]
 * @return {[type]} [description]
 */
var extend = exports.extend = function extend(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

/**
 * log2
 * @param  {Number} x [description]
 * @return {Number}   [description]
 */
function log2(x){
	return Math.log(x) / Math.LN2;
}

/**
 * entropy function
 * @param  {Array} px Array of probabilities
 * @return {Number}    Returns the entropy
 */
var entropy = exports.entropy = function(px){
	var sum = 0;
	for(var i=0;i<px.length;i++){
		if(px[i]>0){
			sum += -1 * px[i] * log2(px[i]);
		}
	}

	return sum;
}

/**
 * [info description]
 * @param  {[type]} values [description]
 * @return {[type]}        [description]
 */
var info = exports.info = function info(values){

	var result = 0,a,b,s,i=0,total = getTotal();
	for(i=0;i<values.length;i++){
		s = sum(values[i]);
		a = s/total;
		b = entropy(fractions(values[i],s));

		//console.log(a,b);
		result += a * b;
	}
	return result;

	function fractions(v,s){
		var n = [];
		for(var i=0;i<v.length;i++){
			n.push(v[i]/s);
		}
		return n;
	}

	function sum(v){
		var s = 0;
		for(var i=0;i<v.length;i++){
			s += v[i];
		}
		return s;
	}

	function getTotal(){
		var i =0,s=0;
		for(i=0;i<values.length;i++){
			s += sum(values[i]);
		}
		return s;
	}
}


/**
 * [TreeStumpPossibleValue description]
 * @param {[type]} attrValue [description]
 */
function TreeStumpPossibleValue(attrValue){
	/**
	 * example: sunny
	 * @type {[type]}
	 */
	this.attrValue = attrValue;
	/**
	 * example: {"yes":9,"no":4}
	 * @type {Object}
	 */
	this.classCount = {};
}

TreeStumpPossibleValue.prototype = {
	/**
	 * [pushClass description]
	 * @param  {[type]} classValue [description]
	 * @return {[type]}            [description]
	 */
	pushClass:function(classValue){
		if(this.classCount[classValue] === undefined){
			this.classCount[classValue] = 0;
		}
		this.classCount[classValue]++;
	}
};

/**
 * [TreeStump description]
 * @param {[type]} attr [description]
 */
function TreeStump(attr){
	this.info = null;
	this.gain = null;
	this.possibleValues = {};
	this.attribute = attr;
}

TreeStump.prototype = {
	/**
	 * [pushClass description]
	 * @param  {[type]} attrValue  [description]
	 * @param  {[type]} classValue [description]
	 * @return {[type]}            [description]
	 */
	pushClass:function(attrValue,classValue){
		if(this.possibleValues[attrValue] === undefined){
			this.possibleValues[attrValue] = new TreeStumpPossibleValue(attrValue);
		}

		this.possibleValues[attrValue].pushClass(classValue);
	},
	/**
	 * [updateInfo description]
	 * @return {[type]} [description]
	 */
	updateInfo:function(){
		var attrTree = this;
		var targetCount = {},count,leafs = [];
		for(var attrValue in attrTree.possibleValues){
			leafs.push(values(attrTree.possibleValues[attrValue].classCount));
			for(var cls in attrTree.possibleValues[attrValue].classCount){
				count = attrTree.possibleValues[attrValue].classCount[cls];
				if(targetCount[cls]===undefined){
					targetCount[cls] = 0;
				}
				targetCount[cls] += count;
			}
		}
		//console.log(leafs);
		var inf = info(leafs);

		attrTree.info = inf;
		attrTree.gain = info([values(targetCount)]) - inf;
	}
};


/**
 * [getTreeStumps description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var getTreeStumps = exports.getTreeStumps = function getTreeStumps(params){
	var i,h,trees={};

	for(i=0;i<params.instances.length;i++){
		for(h=0;h<params.attributes.length;h++){
			handle(params.instances[i],params.attributes[h]);
		}
	}

	for(i in trees){
		trees[i].updateInfo();
	}

	return trees;

	function handle(instance,attr){

		if(trees[attr] === undefined){
			trees[attr] = new TreeStump(attr);
		}
		var i=0;
		var tree = trees[attr];

		var attrValue = instance[attr];
		var targetValue = instance[params.target];
		
		tree.pushClass(attrValue,targetValue);
	}
}

/**
 * [getClassProbability description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var getClassProbability = exports.getClassProbability = function(params){
	var i,targetValueCount = {},instances = params.instances;
	for(i=0;i<params.instances.length;i++){
		addToTargetCount(params.instances[i]);
	}

	for(i in targetValueCount){
		targetValueCount[i].p = targetValueCount[i].count/instances.length;
	}

	return targetValueCount;

	function addToTargetCount(instance){
		var targetValue = instance[params.target];
		if(targetValueCount[targetValue] === undefined){
			targetValueCount[targetValue] = {count:0,p:0};
		}
		targetValueCount[targetValue].count++;
	}

};

/**
 * [getMostProbableClass description]
 * @param  {[type]} classPr [description]
 * @return {[type]}         [description]
 */
var getMostProbableClass = exports.getMostProbableClass = function (classPr){
	var maxP = 0,maxClass=null;
	for(var c in classPr){
		if(classPr[c].p > maxP ){
			maxP = classPr[c].p;
			maxClass = c;
		}
	}
	return {
		p:maxP,
		class:maxClass
	};
};

/**
 * [getSplittingAttribute description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
var getSplittingAttribute = exports.getSplittingAttribute = function(params){
	var maxGain = -1,treeStumps = getTreeStumps(params),maxAttr=null;
	for(var attr in treeStumps){
		if(treeStumps[attr].gain > maxGain){
			maxGain = treeStumps[attr].gain;
			maxAttr = treeStumps[attr];
		}
	}
	return maxAttr;
};