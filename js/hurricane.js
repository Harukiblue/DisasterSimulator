function Hurricane(params){
	this.title = {
		singlular:"hurricane",
		plural: "hurricanes"
	};
	this.rounds = this.Default(params, "rounds", 2);
	this.diameter = {
		threshold: this.Default(params, "diameter_threshold", 125),
		min: this.Default(params, "min", 125)
	};
	this.damage = {
		tornado: {
			odds:this.Default(params, "tornado_odds", .0025),
			min: this.Default(params, "tornado_min", .1),
			max: this.Default(params, "tornado_max", 1),
			message: this.Default(params, "tornado_message", "You were hit by a tornado for %{damage-percent} damage worth ${damage-cost}. ")
		},
		wind: {
			odds:this.Default(params, "wind_odds", .05),
			min: this.Default(params, "wind_min", .1),
			max: this.Default(params, "wind_max", .75),
			message: this.Default(params, "wind_message", "You were hit by a hurricane winds for %{damage-percent} damage worth ${damage-cost}. ")
		},
		water: {
			odds:this.Default(params, "water_odds", .0025),
			min: this.Default(params, "water_min", .1),
			max: this.Default(params, "water_max", .5),
			message: this.Default(params, "water_message", "You were hit by a surging flood for %{damage-percent} damage worth ${damage-cost}. ")
		}
	};
	this.location = {
		population : this.Default(params, "population", 32811245),
		average_house_size : this.Default(params, "average_house_size", 4),
		area_of_state : this.Default(params, "area_of_state", 70725)
	};

}
Hurricane.prototype.Default = Disasters.prototype.Default;
Hurricane.prototype.Encounter = Disasters.prototype.Encounter;

Hurricane.prototype.Evaluate = function(params){
	var state_houses = Math.floor(this.location.population/this.location.average_house_size);
	var average_house_area = this.location.area_of_state/ state_houses;
	average_house_area = average_house_area <= 0 ? 1 : average_house_area;
	var average_houses_per_mile = Math.floor(1/ average_house_area);
	var house_start_value = this.Default(params, "house_start_value", disasters.house_start_value);
	
	var hurricane_location = Math.floor(Math.random() * state_houses);
	var hurricane_radius = Math.floor((Math.random() * this.diameter.threshold)+ this.diameter.min)/2;
	var hurricane_size = Math.PI * (hurricane_radius * hurricane_radius);
	var houses_hit = Math.floor(hurricane_size * average_houses_per_mile);
	var low_end_hit = hurricane_location - (houses_hit /2);
	var high_end_hit = hurricane_location + (houses_hit /2);
	
	var your_location = Math.floor(Math.random() * state_houses);
	var was_hit = (low_end_hit <= your_location) && (your_location <= high_end_hit);
	
	var return_message = "";
	var total_damage = 0;
	
	var damage_event = function(odds, min, max){
		var hit = Math.random() <= odds;
		var factor = max - min;
		return hit ? Math.random() * factor : 0;
	}
	
	if(was_hit){
		var tornado_damage = this.Encounter(this.damage.tornado.odds, this.damage.tornado.min, this.damage.tornado.max);
		var wind_damage = this.Encounter(this.damage.wind.odds, this.damage.wind.min, this.damage.wind.max);
		var water_damage = this.Encounter(this.damage.water.odds, this.damage.water.min, this.damage.water.max);
		total_damage = was_hit ? tornado_damage + wind_damage + water_damage : 0;
		
		return_message = "{hit}";
		return_message = tornado_damage > 0 ? return_message + this.damage.tornado.message.replace("{damage-percent}", Math.floor(tornado_damage * 100)).replace("{damage-cost}",(tornado_damage * house_start_value).toFixed(2)) : return_message;
		return_message = wind_damage > 0 ? return_message + this.damage.wind.message.replace("{damage-percent}", Math.floor(wind_damage * 100)).replace("{damage-cost}",(wind_damage * house_start_value).toFixed(2)) : return_message;
		return_message = water_damage > 0 ? return_message + this.damage.water.message.replace("{damage-percent}", Math.floor(water_damage * 100)).replace("{damage-cost}",(water_damage * house_start_value).toFixed(2)) : return_message;
	}
	return {
		message: return_message,
		damage: total_damage
	};
}
disasters.Add(new Hurricane());