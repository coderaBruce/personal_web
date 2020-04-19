// hw3_table.js
// Draw a talbe in hw3_film.html
// @Author: Bruce(XinyuLi)


console.log("in table.js");

// draw table
function drawTable(data){
	console.log("in drawTable function");
	console.log(data);
	
	// Reformat data into array, needs to be optimized
	// We create newData, cleanData, it is too much.
	dataLength = data.length;
	newData = [];

	for (i = 0; i < dataLength; i++){
		tempData = data[i].__data__;
		newData.push(tempData);	
	}
	console.log(newData);
	cleanData = [];
	for (i = 0; i < dataLength; i++){
		tempObj = newData[i];
		var tempArray = Object.keys(tempObj).map(function (key) { 
			// Using Number() to convert key to number type 
			// Using obj[key] to retrieve key value 
			console.log(newData[key]);
			return tempObj[key]; 
		}); 
		temp = tempArray[0];
		tempArray[0] = tempArray[2];
		tempArray[2] = temp;
		cleanData.push(tempArray);
	}
	console.log(cleanData);
	// Creat the table
	var table = d3.select("body").append("table"); 
	var header = table.append("thead").append("tr");
	// Hardcode Header;
	header.selectAll('th')
		.data(["Title", "Length", "Year", "Subject", "Actor", "Actress", "Director", "Popularity", "Awards", "*Image"])
		.enter()
		.append('th')
		.text(function(d){console.log(d);return d;});

	var tableBody = table.append("tbody");
	var rows = tableBody.selectAll("tr")
		.data(cleanData)
		.enter()
		.append("tr");
	cells = rows.selectAll("td")
		.data(function(d){
			console.log("asfdasdf");
			console.log(d);	
			return d;
		})
	.enter()
		.append("td")
		.text(function(d){return d;});
	console.log("end of drawTalbe");
}
