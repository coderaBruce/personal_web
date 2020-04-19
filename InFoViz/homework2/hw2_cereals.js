//Scatter Plot
// reference to: http://bl.ocks.org/weiglemc/6185069
// @Author: Xinyu(Bruce) Li
// TODO: tooltip, study axis text compared to reference
console.log("Loading homework2.js");


// 1. Margin;
var outWidth = 600, outHeight = 600;
var margin = {top: 50, right: 50, bottom: 70, left: 100},
	width = outWidth - margin.left - margin.right,
	height = outHeight - margin.top - margin.bottom;
var rmin = 1, rmax = 10;

// 2. Scale
	// var yScale = d3.scaleBand().rangeRound([0, 500]).padding(5);
//Fat vs Caleroies
var xScale = d3.scaleLinear([0, width]);
var yScale = d3.scaleLinear([height, 0]);
var rScale = d3.scaleLinear([rmin, rmax]);
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// 3. Axis
var xAxis = d3.axisBottom(xScale);//,.ticks(5);
var yAxis = d3.axisLeft(yScale);

// 4. 定义一个svg区域（圈一块地）, 定图的范围
var svg = d3.select("body")//("#myspace01")
			.append("svg")
			.attr("width", outWidth)
			.attr("height", outHeight);
// 5. Loading Data, start plotting
d3.csv("../Data/a2-cereals.csv").then(function(data){
	// change string (from CSV) into number format	
	data.forEach(function(d) {
		d.Calories = +d.Calories;
		d.Carbohydrates = +d.Carbohydrates;
		d.Fat = +d.Fat;
		// d["Protein (g)"] = +d["Protein (g)"];
	//    console.log(d);
  });
	// 5.1 Associate scale:  domain with range
	// don't want circles overlapping axis, so add in buffer to data domain
	xScale.domain([ d3.min( data, function(d){return d.Fat;})-1,
					d3.max( data, function(d){return d.Fat;})+1]);
	yScale.domain([ d3.min( data, function (d){ return d.Carbohydrates;})-1,
					d3.max( data, function (d){ return d.Carbohydrates;})+1]); 
	rScale.domain([0, d3.max( data, function (d){ return d.Calories;})]); 
	// yScale.domain(d3.range(data.length));

	// 5.2 开始画circles
	// 先整体transform svg, 为了空出坐标轴的距离
	svg = svg.append("g")
	        //这是字符串加法，因为translate要是字符串
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		// .style("fill","red")
		// animation: use 10000ms to change from red to blue
		// .transition()
		// .duration(10000)
		// .style("fill", "steel blue")
		.attr("cx", function(d) {
					return xScale(d.Fat); })
		.attr("cy", function(d){
					return yScale(d.Carbohydrates)})
		.attr("r", function(d){
					return rScale(d.Calories);})
		.attr("fill",    function (d){ 
						return   colorScale(d.Manufacturer); });
	// 5.3 开始画轴
	// x axis
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
//	add 轴标识
	svg .append("text")
		.style("text-anchor", "end")
		.attr("x", width)
		.attr("y", 475)
		.text("Fat");
	// y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	svg .append("text")
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "middle")
		.attr("x", -30)
		.attr("y", 20)
		.text("Caleroies");
// draw legend
  var legend = svg.selectAll(".legend")
      .data(colorScale.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});
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
