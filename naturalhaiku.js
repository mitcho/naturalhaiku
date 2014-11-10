// naturalhaiku.js
// Michael Yoshitaka Erlewine <mitcho@mitcho.com>
// Dedicated to the public domain, 2014
// https://github.com/mitcho/naturalhaiku/

var util = require('util'),
	Twit = require('twit'),
	MeCab = new require('mecab-async'),
	fs = require('fs');
	
var credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

var mecab = new MeCab();
function validate(input, cb) {
	mecab.parse(input, function(err, result) {
		if (err)
			return cb(false, null);
		var ret = [], array, word, length = 0, totalLength = 0;
		for (i in result) {
			array = result[i];
			if (array.length < 8)
				continue;

// 			console.log(word);

			word = (9 in array) ? array[9] : '*';
			if (array[7] == '*') // if unchanged
				word = array[0];

// 			console.log(array[1], word, word.length);
			length = word.length;
			// adjustments for ya, yu, yo

			if (array[1] == '記号') // skip
				continue;
			else
				ret.push(word);
			
// 			console.log(length);
			if (totalLength < 5 && totalLength + length > 5)
				return cb('fail5', null);
			if (totalLength < 5+7 && totalLength + length > 5+7)
				return cb('fail57', null);
			if (totalLength < 5+7+5 && totalLength + length > 5+7+5)
				return cb('fail575', null);
			if (totalLength < 5+7+5+7 && totalLength + length > 5+7+5+7)
				return cb('fail5757', null);
			if (totalLength < 5+7+5+7+7 && totalLength + length > 5+7+5+7+7)
				return cb('fail57577', null);
			
			totalLength += length;
		}
// 		console.log(ret);

		if (length != 5+7+5 && length != 5+7+5+7+7)
			return cb('fail', null);
		
		// success!
		cb(null, ret);
	});
}

	
var T = new Twit(credentials);

// console.log(util.inspect(T));
var japan = '132.2,29.9,146.2,39.0,138.4,33.5,146.1,46.20';
var stream = T.stream('statuses/filter', { locations: japan, language: 'ja' });

stream.on('tweet', function(data) {
// 	console.log(data.id);
	var text = data.text;
	text = text.replace(/^(@\w+\s+)+/,''); // filter out replies

	validate(text, function(err, result) {
		if (err) return; // ignore errors

		// if we made it this far, it's a haiku (or tanka)
		console.log(text, result);
	});
	// 	util.inspect(data)
});
