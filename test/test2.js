var topia=require('../index.js');

var tagger = new topia.Tagger({},{
  'lexicon' : topia.lexicon
});
var filter = new topia.DefaultFilter();
var extractor = new topia.TermExtraction({
  'tagger' : tagger, 'filter' : filter
});

var text="hello world, how are you? hello world, how are you? hello world, how are you? hello world, how are you?";
var tags = extractor.call(text);
tags.sort();
console.log(tags);


