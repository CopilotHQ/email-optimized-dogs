/**
 * Creates a key
 */
function createKey(htmlStr) {
	var storeLocation = function(a, v){
		var x = Math.floor(v/31);
		var o = v%31;
		a[x] = a[x] | (1 << o);
		return a;
	}

	var rows = (htmlStr.match(/<tr>/g) || []).length;
	var columns = (htmlStr.match(/<td/g) || []).length / rows;
	var storeLength = Math.ceil((rows * columns) / 31);
	// console.log("Counted: "+columns+" columns and "+rows+" rows");

	var pixels = htmlStr.replace(/ height="5" width="5"/g, "") 	// remove height and width attributes
						.match(/<td[^>]*>/g) 					// remove everything that isn't a <td> tag
						.join() 								// join the matches into a single string
						.replace(/<td>/g, "0") 					// replace all empty cells with a 0
						.match(/[0-9a-fA-F]{6}|0/g); 			// match all HEX numbers, leaving us with an array
	// console.log(pixels);

	var uniqueColors = [];
	for(var i=0; i<pixels.length; i++) {
		var index = uniqueColors.findIndex(function(itm){return itm.col == pixels[i]});
		if(-1 != index) {
			uniqueColors[index].idx = storeLocation(uniqueColors[index].idx, i);
		} else {
			uniqueColors.push({col:pixels[i],idx: (storeLocation((function(k){var a=[];for(var n=0; n<k; n++){a.push(0);}return a;}(storeLength)), i))});
		}
	}

	// console.log(uniqueColors);
	var result = [rows,columns];
	for(i=0; i<uniqueColors.length; i++) {
		result.push(uniqueColors[i].col);
		for(var j=0; j<storeLength; j++) {
			result.push(uniqueColors[i].idx[j].toString(36));
		}
	}
	console.log(result.join());
	return result.join();
}

function decodeKey(str) {

}