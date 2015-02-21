function TreeBuilderParams(params){
	this.attributes = params.attributes;
	this.instances = [];
	this.target = params.target;
	this.exclude = params.exclude ? params.exclude : [];
	this.classes = [];
}

TreeBuilderParams.prototype = {
	addInstance:function(instance){
		//this.instances.push(instance);
		var newInstance = {};
		this.attributes.forEach(function(attr){
			//console.log(attr);
			newInstance[attr] = instance[attr]===undefined ? "NA" : instance[attr];
		});

		/*for(var  in instance){
			if(this.attributes.indexOf(k)<0 && this.exclude.indexOf(k)<0 && k !== this.target){
				this.attributes.push(k);
			}
		}*/

		var targetValue = instance[this.target] !== undefined ? instance[this.target] : "NA";
		if(this.classes.indexOf(targetValue)<0){
			this.classes.push(targetValue);
		}

		newInstance[this.target] = targetValue;

		this.instances.push(newInstance);
	}
}

exports.TreeBuilderParams = TreeBuilderParams;