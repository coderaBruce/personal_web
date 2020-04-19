//Bar chart:D3 V5 和网上现有资料不一样，要注意
// @Author: Xinyu(Bruce) Li
console.log("Loading homework2.js");


// 1. Margin;
var margin = {top: 50, right: 50, bottom: 70, left: 100},
	width = 600 - margin.left - margin.right,
	height = 5000 - margin.top - margin.bottom;

// 2. Scale
	// var yScale = d3.scaleBand().rangeRound([0, 500]).padding(5);
var xScale = d3.scaleLinear([0, width]);

var yScale = d3.scaleBand()
			.range([0, height]).padding(0.1);
// var yScale = d3.scaleOrdinal().range([0, 5000]);

// 3. Axis
var xAxis = d3.axisTop(xScale).ticks(5);
var yAxis = d3.axisLeft(yScale);

// 4. 定义一个svg区域（圈一块地）, 定图的范围
var svg = d3.select("body")//("#myspace01")
			.append("svg")
			.attr("width", 600)
			.attr("height", 5000);
// 5. Loading Data, start plotting
d3.csv("../Data/a1-cars.csv").then(function(data){
	// 5.1 Associate scale:  domain with range
	xScale.domain([0, d3.max( data, function(d){return d.Cylinders;})]);
	yScale.domain(data.map( function (d){ return d.Car;})); 
	// yScale.domain(d3.range(data.length));

	// 5.2 开始画bars
	// 先整体transform svg
	svg = svg.append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //这是字符串加法，因为translate要是字符串
	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.style("fill","red")
		// animation: use 10000ms to change from red to blue
		.transition()
		.duration(10000)
		.style("fill", "steel blue")
		.attr("y", function(d) {
			return yScale(d.Car); })
		.attr("x", 0)
		.attr("width", function(d){
			return xScale(d.Cylinders);})
		.attr("height", yScale.bandwidth());
	// 5.3 开始画轴
	svg.append("g")
		.call(xAxis);
	// add 轴标识
	svg .append("text")
		.style("text-anchor", "middle")
		.attr("x", width/2)
		.attr("y", -20)
		.text("Number Of Cylinders");
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
});

// 文字说明
// var texts = 
// `This is a bar chart of dataset "a1-cars", from this bar chart we can 
// see that most 
// cars' cylinders are 4 and 8, only a few of them are 6`;
// var textBox = d3.select("body").append("svg")
// 				.attr('width', width)
// 				.attr('height', height);

// textBox.append("text")
// 			.attr("x", 0)
// 			.attr("y",20)
// 			.text(texts);
