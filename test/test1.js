/*
		var tagger = new window.anod.Topia.Tagger({},{
			'lexicon' : window.anod.Topia.lexicon
		});
		var filter = new window.anod.Topia.DefaultFilter();
		var extractor = new window.anod.Topia.TermExtraction({
			'tagger' : tagger, 'filter' : filter
		});
		
		var tags = extractor.call(document.getElementById("source").innerHTML);
		tags.sort();
		document.getElementById("result").innerHTML = tags.join("<br/>");

*/


var Tagger=require('../lib/tagger')
  ,lexicon=require('../lib/lexicon')
  ,DefaultFilter=require('../lib/defaultfilter')
  ,TermExtraction=require('../lib/termextractor')
;


var tagger = new Tagger({},{
  'lexicon' : lexicon
});
var filter = new DefaultFilter();
var extractor = new TermExtraction({
  'tagger' : tagger, 'filter' : filter
});

var text="hello world, how are you? hello world, how are you? hello world, how are you? hello world, how are you?";
var tags = extractor.call(text);
tags.sort();
console.log(tags);


