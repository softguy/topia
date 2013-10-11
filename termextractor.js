"use strict";

window.anod.Topia.TermExtraction = Backbone.Model.extend({
	SEARCH: 0,
	NOUN: 1,
	
	defaults : {
		tagger: null,
		filter: null,
	},
	
	initialize: function() {
		
	},

	call: function(text) {
        var terms = this.get('tagger').call(text);
        return this.extract(terms);
	},

	extract: function(taggedTerms) {
		var terms = {};
        //# Phase 1: A little state machine is used to build simple and
        //# composite terms.
        var multiterm = [];
        var state = this.SEARCH;
        var word;
        
        while (taggedTerms.length > 0) {
            var tagged_term = taggedTerms.shift();
            var term = tagged_term[0];
            var tag = tagged_term[1];
            var norm = tagged_term[2];
            var startsWithN = this._startsWith(tag,'N');
            
            if (state == this.SEARCH && startsWithN) {
                state = this.NOUN;
                multiterm.push(term);
                terms[norm] = this._incdefault(norm, terms);
            } else if (state == this.SEARCH && tag == 'JJ' && this._isUpper(term[0])) {
                state = this.NOUN;
                multiterm.push(term);
                terms[norm] = this._incdefault(norm, terms);
            } else if (state == this.NOUN && startsWithN) {
                multiterm.push(term);
                terms[norm] = this._incdefault(norm, terms);
            } else if (state == this.NOUN && !startsWithN) {
                state = this.SEARCH;
                if (multiterm.length > 1) {
                    word = multiterm.join(' ');
                    terms[word] = this._incdefault(word, terms);
                }
                multiterm = [];
            }
        }

         //# Phase 2: Only select the terms that fulfill the filter criteria.
        //# Also create the term strength.
        var result = [];
        for (word in terms) {
            var occur = terms[word];
            var strength = word.split(" ").length;
            if (this.get('filter').call(word, occur, strength)) {
                result.push(word);//[word, occur, strength]);
            }
        }
        return result;
    },
	
	_incdefault: function(word, terms) {
		return (terms[word]) ? terms[word]+1 : 1;
	},

	_startsWith: function(str, prefix) {
		return str.substring(0, prefix.length) === prefix;
	},
	
	_isUpper: function(ch) {
        return (ch == ch.toUpperCase()); 
	}

});