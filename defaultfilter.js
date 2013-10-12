"use strict";

//window.anod.Topia.DefaultFilter = Backbone.Model.extend({
(function(){


	defaults: {
		singleStrengthMinOccur: 3,
		noLimitStrength: 2
	},
	
	call: function(word, occur, strength) {
			return ((strength == 1 && occur >= this.get('singleStrengthMinOccur')) ||
							(strength >= this.get('noLimitStrength')));
	}
//});


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = DefaultFilter;
  else
    window.DefaultFilter = DefaultFilter;		
})();