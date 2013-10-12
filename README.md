# Topia TermExtract 1.1.0 for nodejs 

## Introduction

	Allow use topia term extraction from server side js such as node

## Install

	$ npm install topia
	or get it from the github
		
## Usage & Examples

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
		

## Orginal Packages

 [1]: http://pypi.python.org/pypi/topia.termextract/
 [2]: https://www.github.com/anod/TopiaTermExtractionJS
	
## LICENSE
	MIT
	
## TODO
	* support other languages


