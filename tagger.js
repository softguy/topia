"use strict";

window.anod.Topia.Tagger = Backbone.Model.extend({
	TERM_SPEC: /([^a-zA-Z]*)([a-zA-Z-\.]*[a-zA-Z])([^a-zA-Z]*[a-zA-Z]*)/g,
	
	tags_by_term: {},

	initialize: function(attrs, options) {
		this.tags_by_term = options.lexicon;
	},
	
	call: function(text) {
        var terms = this.tokenize(text);

        return this.tag(terms);
	},
        
	tokenize: function(text) {
		var terms = [];
		var words = text.split(/\s/g);
        for (var i=0; i<words.length; i++) {
            var term = words[i];
            // If the term is empty, skip it, since we probably just have
            // multiple whitespace cahracters.
            if (term === '') {
                continue;
            }
            // Now, a word can be preceded or succeeded by symbols, so let's
            // split those out
            var match;
            var matched = false;
            while(match = this.TERM_SPEC.exec(term)) {
                for(var j=1; j<match.length; j++) {
                    var subTerm = match[j];
                
                    if (subTerm !== '') {
                        terms.push(subTerm);
                    }
                }
                matched = true;
            }
            if (!matched) {
                terms.push(term);
            }
        }
        return terms;
	},

	tag: function(terms) {
		var tagged_terms = [];
        //# Phase 1: Assign the tag from the lexicon. If the term is not found,
        //# it is assumed to be a default noun (NND).
		for (var i=0; i<terms.length; i++) {
			var term = terms[i];
			var tag = (this.tags_by_term[term]) ? this.tags_by_term[term] : 'NND';
            tagged_terms.push(
                [term, tag, term]
            );
        }

        //# Phase 2: Run through some rules to improve the term tagging and
        //# normalized form.
		var modified_term, modified_idx_term;
        for (var idx = 0; idx<tagged_terms.length; idx++) {
			var tagged_term = tagged_terms[idx];
			modified_term = this._correctDefaultNounTag(idx, tagged_term, tagged_terms);
			if (modified_term) {
				tagged_terms[idx] = modified_term;
			}
			modified_term = this._verifyProperNounAtSentenceStart(idx, tagged_term, tagged_terms);
			if (modified_term) {
				tagged_terms[idx] = modified_term;
			}
			modified_idx_term = this._determineVerbAfterModal(idx, tagged_term, tagged_terms);
			if (modified_idx_term) {
				tagged_terms[modified_idx_term[0]] = modified_idx_term[1];
			}
			modified_term = this._normalizePluralForms(idx, tagged_term, tagged_terms);
			if (modified_term) {
				tagged_terms[idx] = modified_term;
			}
        }
        return tagged_terms;
	},
	
	
	//"""Determine whether a default noun is plural or singular."""
	_correctDefaultNounTag: function(idx, tagged_term, tagged_terms) {
		var term = tagged_term[0];
		var tag = tagged_term[1];
		if (tag == 'NND') {
			if (this._endsWith(term,'s')) {
				tagged_term[1] = 'NNS';
				tagged_term[2] = term.substring(0, term.length - 1);
			} else {
				tagged_term[1] = 'NN';
			}
			return tagged_term;
		}
		return null;
	},
	
	_endsWith: function(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	},
	
	
	//"""Verify that noun at sentence start is truly proper."""
	_verifyProperNounAtSentenceStart: function (idx, tagged_term, tagged_terms) {
		var term = tagged_term[0];
		var tag = tagged_term[1];
		var norm = tagged_term[2];
		if ((tag == 'NNP' || tag == 'NNPS') &&
			(idx === 0 || tagged_terms[idx - 1][1] == '.')) {
			var lower_term = term.toLowerCase();
			var lower_tag = this.tags_by_term[lower_term];
			if (lower_tag == 'NN' || lower_tag == 'NNS') {
				tagged_term[0] = tagged_term[2] = lower_term;
				tagged_term[1] = lower_tag;
				return tagged_term;
			}
		}
		return null;
	},
	
	//"Determine the verb after a modal verb to avoid accidental noun detection."
	_determineVerbAfterModal: function(idx, tagged_term, tagged_terms) {
		var term = tagged_term[0];
		var tag = tagged_term[1];
		var norm = tagged_term[2];
		if (tag != 'MD') {
			return;
		}
		var len_terms = tagged_terms.length;
		var i = idx + 1;
		while (i < len_terms) {
			if (tagged_terms[i][1] == 'RB') {
				i += 1;
				continue;
			}
			if (tagged_terms[i][1] == 'NN') {
				tagged_terms[i][1] = 'VB';
				return [i, tagged_terms[i]];
			}
			break;
		}
		return null;
	},
	
	_normalizePluralForms : function(idx, tagged_term, tagged_terms) {
		var term = tagged_term[0];
		var tag = tagged_term[1];
		var norm = tagged_term[2];
		if ((tag == 'NNS' || tag == 'NNPS') && term == norm) {
			// Plural form ends in "s"
			var singular = term.substring(0, term.length - 1);
			if (this._endsWith(term, 's') && this.tags_by_term[singular]) {
				tagged_term[2] = singular;
				return tagged_term;
			}
			// # Plural form ends in "es"
			singular = term.substring(0, term.length - 2);
			if (this._endsWith(term, 'es') && this.tags_by_term[singular]) {
				tagged_term[2] = singular;
				return tagged_term;

			}
			// # Plural form ends in "ies" (from "y")
			singular = term.substring(0, term.length - 3) + 'y';
			if (this._endsWith(term, 'ies')	&& this.tags_by_term[singular]) {
				tagged_term[2] = singular;
				return tagged_term;
			}
		}
		return null;
	}
});