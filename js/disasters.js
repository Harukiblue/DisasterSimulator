function Disasters(params){
	this.collection = new Array();
	this.year = 0;
	this.house_start_value = this.Default(params, "house_start_value", 250000);
	this.output = this.Default(params, "output", "output");
	this.house_value_label = this.Default(params, "house_value_label", "house_value");
	this.house_value = this.house_start_value;
}
Disasters.prototype.Default = function(params, key, value){
	if(params === undefined){ return value;}
	return params[key] === undefined || params[key] === null ? value : params[key];
}
Disasters.prototype.Add = function(item){
	this.collection.push(item);
}
Disasters.prototype.Encounter = function(odds, min, max){
	var hit = Math.random() <= odds;
	var factor = max - min;
	return hit ? Math.random() * factor : 0;
}
Disasters.prototype.Run = function(x){
	if(x === undefined || x === null){x=1;}
	var run_year = function(ctx){
		var output = document.getElementById(ctx.output);
		var house_value_output = document.getElementById(ctx.house_value_label);
		ctx.year++;
		var new_output = "";
		ctx.collection.forEach(function(disaster){
			for(var i = 0; i < disaster.rounds; i++){
				result = disaster.Evaluate({house_start_value: ctx.house_start_value});
				new_output = new_output + result.message;
				ctx.house_value = ctx.house_value - (ctx.house_start_value * result.damage);
			}	
			var pattern = new RegExp("{hit}","g");
			var matches = new_output.match(pattern);
			if(matches != null){
				if(matches.length > 0){
					new_output = new_output.replace(pattern, "");	

					if(matches == 1){
						new_output = "There was a " + disaster.title.singular + " in your area." + new_output;
					}else{
						new_output = "There were " + matches.length + " " + disaster.title.plural + " in your area." + new_output;
					}			
				}			
			}
		});	
		if(new_output == ""){
			new_output = "No Damage.";
		}
		output.innerHTML = output.innerHTML + "</br>Year " + ctx.year + ": " + new_output;
		house_value_output.innerHTML = "$" + ctx.house_value.toFixed(2);
		console.log(new_output);
	}
	
	for(var i = 0; i < x; i++){
		run_year(this);
	}
}
var disasters = new Disasters();