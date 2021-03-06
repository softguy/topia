"use strict";
var Backbone=require('backbone');

//window.anod.Topia.
module.exports = Backbone.Model.extend({

	defaults: {
		singleStrengthMinOccur: 3,
		noLimitStrength: 2
	},
	
	call: function(word, occur, strength) {
			return ((strength == 1 && occur >= this.get('singleStrengthMinOccur')) ||
							(strength >= this.get('noLimitStrength')));
	}
});
