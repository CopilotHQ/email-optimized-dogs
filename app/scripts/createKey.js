/**
 * Creates a key
 */
function createKey(htmlStr) {
	// This function will store the location in the bits of an array of INTs.
	var storeLocation = function(a, v){
		var x = Math.floor(v/31);
		var o = v%31;
		a[x] = a[x] | (1 << o);
		return a;
	}

	var rows = (htmlStr.match(/<tr>/g) || []).length;
	var columns = (htmlStr.match(/<td/g) || []).length / rows;
	var storeLength = Math.ceil((rows * columns) / 31);

	var pixels = htmlStr.replace(/ height="[0-9]+"/g, "")  					// remove height attribute
											.replace(/ width="[0-9]+"/g, "")  					  // remove width attribute
											.replace(/ bgcolor(="")?/g, "")  				// remove bgcolor attribute <- bug fix
          						.match(/<td[^>]*>/g)                    // remove everything that isn't a <td> tag
          						.join()                                 // join the matches into a single string
          						.replace(/<td>/g, "0")                  // replace all empty cells with a 0
          						.match(/[0-9a-fA-F]{6}|0/g);            // match all HEX numbers, leaving us with an array

  // Filter our array to isolate each unique color used and save where it's being used.
	var uniqueColors = [];
	for(var i=0; i<pixels.length; i++) {
		// Search our array to see if this color has already been seen.
		var index = uniqueColors.findIndex(function(itm){return itm.col == pixels[i]});
		if(-1 != index) {
			// Color was found so lets just store it's location
			uniqueColors[index].idx = storeLocation(uniqueColors[index].idx, i);
		} else {
			// Color was not found, so we need to create a new storage array and pass that into our function.
			uniqueColors.push({col:pixels[i],idx: (storeLocation((function(k){var a=[];for(var n=0; n<k; n++){a.push(0);}return a;}(storeLength)), i))});
		}
	}

	// Create our final string
	var result = [rows,columns];
	for(i=0; i<uniqueColors.length; i++) {
		result.push(uniqueColors[i].col);
		for(var j=0; j<storeLength; j++) {
			// Encode our storage variables as Base36 numbers.
			result.push(uniqueColors[i].idx[j].toString(36));
		}
	}

	return result.join();
}

function decodeKey(str, size) {
	var size = (undefined==size)? 5 : size;
	var key = str.split(',');
	var rows = key[0];
	var columns = key[1];
	var storeLength = Math.ceil((rows * columns) / 31);

	var index = 2;
	var uniqueColors = [];
	while(index < key.length) {
		uniqueColors.push({
			col: key[index++],
			idx: key.slice(index, storeLength+index)
		});
		index += storeLength;
	}

	var pixels = new Array(rows*columns); // Create a new array with RxC elements
	uniqueColors.forEach(function(itm) 
	{
		var count = 0;
		for(var i=0; i<itm.idx.length; i++) 
		{
			// Convert to binary
			var val = ('0000000000000000000000000000000' + parseInt(itm.idx[i], 36).toString(2)).substr(-31);
			for(var j=val.length-1; j>=0; j--) 
			{
				if(val.charAt(j) == "1") 
				{
					pixels[count] = itm.col;
				}
				count++;
			}
		}
	});

	var result = '<table style="display: inline-block;" cellpadding="0" cellspacing="0"><tbody>';
	for(var i=0; i<rows; i++)
	{
		result += "<tr>";
		for(var j=0; j<columns; j++)
		{
			result += '<td'+
				(0==i? ' width="'+size+'"' : '')+
				(0==j? ' height="'+size+'"' : '')+
				('0'==pixels[i*columns+j]? '' : ' bgcolor="#'+pixels[i*columns+j]+'"')+
				"></td>";
		}
		result += "</tr>";
	}
	result += '</tbody></table>';
	
	return result;
}











