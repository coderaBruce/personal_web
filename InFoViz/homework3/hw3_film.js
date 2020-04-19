// Homework3 Scatter Plot + LassoG on film 
// reference to: http://bl.ocks.org/weiglemc/6185069
// @Author: Xinyu(Bruce) Li
// TODO: tooltip, study axis text compared to reference
console.log("Loading homework2.js");

// 1. Margin;
var outWidth = 1200, outHeight = 600;
var margin = {top: 50, right: 150, bottom: 70, left: 100},
	width = outWidth - margin.left - margin.right,
	height = outHeight - margin.top - margin.bottom;
var rmin = 1, rmax = 10;

// 2. Scale
	// var yScale = d3.scaleBand().rangeRound([0, 500]).padding(5);
//Year vs Caleroies
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
			.attr("height", outHeight)
			.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				
// Lasso declaration
// Lasso functions
var lasso_start = function() {
	d3.selectAll("table > *").remove()	
	console.log("start");
	lasso.items()
		// When start, reset all size
		.attr("r", function(d){
					return rScale(d.Length);})
		.classed("not_possible",true)
		.classed("selected",false);
};

var lasso_draw = function() {
	console.log("draw");

	// Style the possible dots
	lasso.possibleItems()
		.attr("r", 7);
		// .style("fill", "lightgray");
		// .classed("not_possible",false)
		// .classed("possible",true);

	// Style the not possible dot
	lasso.notPossibleItems();
		// .classed("not_possible",true)
		// .classed("possible",false);
};

var lasso_end = function() {
	console.log("end");
	// Reset the color of all dots
	lasso.items()
		.classed("not_possible",false)
		.classed("possible",false);

	// Style the selected dots
	lasso.selectedItems()
	   // .classed("selected",true)
	   .attr("r", 7);
		// .attr("r", function(d){
		// 			return rScale(d.Length);});
	
	//Draw a detailed chart
	var s = lasso.selectedItems();

	var r = Math.round(s._groups[0][0].r.baseVal.value);
	var cx = Math.round(s._groups[0][0].cx.baseVal.value);
	var cy = Math.round(s._groups[0][0].cy.baseVal.value);

	console.log(Math.round(111.777));
	console.log(s._groups[0]);
	drawTable(s._groups[0]);
	// console.log(s._groups[0].length);
	// console.log(s._groups[0][0].__data__.Title);
	// console.log(s._groups[0][0].r.baseVal.value);
	// console.log(rScale.invert(r));

	// console.log(s._groups[0][0].cx.baseVal.value);
	// console.log(xScale.invert(cx));

	// console.log(s._groups[0][0].cy.baseVal.value);
	// console.log(yScale.invert(cy));
 


	// Reset the style of the not selected dots
	lasso.notSelectedItems()
		.classed("not selected",false);

};
var lasso_area = svg.append("rect")
			  .attr("width",width)
			  .attr("height",height)
			  .style("opacity",0);

var lasso = d3.lasso()
	.closePathSelect(true)
	.closePathDistance(100)
	// .items(svg.selectAll("circle"))
	.targetArea(lasso_area)
	.on("start",lasso_start)
	.on("draw",lasso_draw)
	.on("end",lasso_end);


// 5. Loading Data, start plotting
d3.csv("../Data/a1-film.csv").then(function(data){
	// change string (from CSV) into number format	
	data.forEach(function(d) {
		d.Length = +d.Length;
		d.Popularity = +d.Popularity;
		d.Year = +d.Year;
	//    console.log(d);
  });
	// 5.1 Associate scale:  domain with range
	// don't want circles overlapping axis, so add in buffer to data domain
	xScale.domain([ d3.min( data, function(d){return d.Year;})-1,
					d3.max( data, function(d){return d.Year;})+1]);
	yScale.domain([ d3.min( data, function (d){ return d.Popularity;})-1,
					d3.max( data, function (d){ return d.Popularity;})+1]); 
	rScale.domain([ d3.min( data, function (d){ return d.Length;}),
					d3.max( data, function (d){ return d.Length;})]); 
	console.log(d3.max( data, function (d){ return d.Length;}));
	// yScale.domain(d3.range(data.length));

	// 5.2 开始画circles
	// 先整体transform svg, 为了空出坐标轴的距离
	//svg = svg.append("g")
	//        //这是字符串加法，因为translate要是字符串
	//		.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 


	console.log(data);
	var dots = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		// .style("fill","red")
		// animation: use 10000ms to change from red to blue
		// .transition()
		// .duration(10000)
		// .style("fill", "steel blue")
		.attr("cx", function(d) {
					return xScale(d.Year); })
		.attr("cy", function(d){
					return yScale(d.Popularity)})
		.attr("r", function(d){
					return rScale(d.Length);})
		.attr("Year",function(d){ return d.Year;})
		.attr("Length",function(d){ return d.Length;})
		.attr("Title",function(d){ return d.Title;})
		.attr("Subject",function(d){ return d.Subject;})
		.attr("Director",function(d ){return d.Director;})
		.attr("Popularity",function(d ){return d.Popularity;})
		.attr("Awards",function(d ){return d.Awards;})
		.attr("fill",    function (d){ 
						return   colorScale(d.Subject); });
	// 5.3 开始画轴
	// x axis
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
//	add 轴标识
	svg .append("text")
		.style("text-anchor", "end")
		.attr("x", width + 20)
		.attr("y", 475)
		.text("Year");
	// y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	 svg.append("text")
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "middle")
		.attr("x", -30)
		.attr("y", 20)
		.text("Popularity");


//Lasso item selection: This is so weired, lasso.items has to be here or lassoed
//area will be totall black

// lasso.items(svg.selectAll("circle"));
// Call lasso
svg.call(lasso);
lasso.items(dots);


// draw legend
  var legend = svg.selectAll(".legend")
      .data(colorScale.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width + 120)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);

  // draw legend text
  legend.append("text")
      .attr("x", width + 100)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});

  // draw title
  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .text("Popularity VS. Year Figure");

	console.log(xScale.invert(40));
});

	



