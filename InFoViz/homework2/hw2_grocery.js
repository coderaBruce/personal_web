//Scatter Plot
// reference to: http://bl.ocks.org/weiglemc/6185069
// @Author: Xinyu(Bruce) Li
// TODO: tooltip, study axis text compared to reference
console.log("Loading homework2.js");


// 1. Margin;
var outWidth = 1000, outHeight = 800;
var margin = {top: 50, right: 50, bottom: 70, left: 100},
	width = outWidth - margin.left - margin.right,
	height = outHeight - margin.top - margin.bottom;

// 2. Scale
// var xScale = d3.scaleLinear([0, width]);
var xScale = d3.scaleOrdinal().domain(["Income", "PurchaseAmount"]).range([width /4, width * 3/4]);
var yScale = d3.scaleBand().range([0, height]).padding(0,1);
var yScale2 = d3.scaleBand().range([0, height]).padding(0,1);

var colorScale = d3.scaleSequential(d3.interpolateBlues);
var colorScale2 = d3.scaleSequential(d3.interpolateBlues);
console.log(colorScale(0.1));

// 3. Axis
var xAxis = d3.axisTop(xScale);//,.ticks(5);
var yAxis = d3.axisLeft(yScale);

// 4. 定义一个svg区域（圈一块地）, 定图的范围
var svg = d3.select("body")//("#myspace01")
			.append("svg")
			.attr("width", outWidth)
			.attr("height", outHeight);
// 5. Loading Data, start plotting
d3.csv("../Data/a1-grocerystoresurvey.csv").then(function(data){
	var data = d3.nest()
			  .key(function(d) { return d.Age;})
			  .rollup(function(d) { 
				  		newTuple = {};
						newTuple.Income  = d3.mean(d, function(g) {return g.Income; });
						newTuple.PurchaseAmount  = d3.mean(d, function(g) {return g.PurchaseAmount; });
						return newTuple;
			   			// return d3.sum(d, function(g) {return g.Income; });
  			   })
			  .entries(data);
	//sort data based on age;
	data.sort(function(x, y){
		return d3.ascending(x.key, y.key)});
	console.log(data);
	// 5.1 Associate scale:  domain with range
	// don't want circles overlapping axis, so add in buffer to data domain
	// xScale.domain([ d3.min( data, function(d){return d.Fat;})-1,
	// 				d3.max( data, function(d){return d.Fat;})+1]);
	
	yScale.domain(data.map( function (d){ return d.key;})); 
	yScale2.domain(data.map( function (d){ return d.key;})); 
		var minIncome = d3.min( data, function (d){ return d.value.Income;});
		var maxIncome = d3.max( data, function (d){ return d.value.Income;});
		var minPurchaseAmount = d3.min( data, function (d){ return d.value.PurchaseAmount;});
		var maxPurchaseAmount = d3.max( data, function (d){ return d.value.PurchaseAmount;});
	// yScale.domain([ d3.min( data, function (d){ return d.key;}),
	// 				d3.max( data, function (d){ return d.key;})]); 
	// rScale.domain([0, d3.max( data, function (d){ return d.Calories;})]); 
	// yScale.domain(d3.range(data.length));

	// 5.2 开始画circles
	// 先整体transform svg, 为了空出坐标轴的距离
	svg = svg.append("g")
	        //这是字符串加法，因为translate要是字符串
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		// .style("fill","red")
		// animation: use 10000ms to change from red to blue
		// .transition()
		// .duration(10000)
		// .style("fill", "steel blue")
		.attr("x", function(d) {
					return 0; })
		.attr("y", function(d){
					return yScale(d.key)})
		.attr("width", function(d){
					return width/2;})
		.attr("height", yScale.bandwidth())
						
		.attr("fill",    function (d){ 
						var normIncome = (d.value.Income- minIncome) / (maxIncome - minIncome);
						console.log(normIncome);
						return   colorScale(normIncome); });
	svg.selectAll("rect1")
		.data(data)
		.enter()
		.append("rect")
		// .style("fill","red")
		// animation: use 10000ms to change from red to blue
		// .transition()
		// .duration(10000)
		// .style("fill", "steel blue")
		.attr("x", function(d) {
					return width/2; })
		.attr("y", function(d){
					return yScale(d.key)})
		.attr("width", function(d){
					return width/2;})
		.attr("height", yScale.bandwidth())
						
		.attr("fill",    function (d){ 
						var normPurchase = (d.value.PurchaseAmount- minPurchaseAmount) / (maxPurchaseAmount - minPurchaseAmount);
						console.log(normPurchase);
						return   colorScale2(normPurchase); });
	// 5.3 开始画轴
	// x axis
	svg.append("g")
		.attr("transform", "translate(0," + 0 + ")")
		.call(xAxis)
		.selectAll('text')
        .attr('font-weight', 'normal')
        .attr('font-size', '20')
        .style("text-anchor", "middle")
        .attr("dx", "20")
        .attr("dy", "0")
        .attr("transform", function (d) {
            return "rotate(0)";
        });
	// y axis
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	svg .append("text")
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "middle")
		.attr("x", -30)
		.attr("y", -30)
        .attr('font-size', '20')
        .attr('font-weight', 'normal')
		.text("Age");
// draw legend
  var legend = svg.selectAll(".legend")
      .data(colorScale.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width+ 10 )
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScale);

  // draw legend text
  legend.append("text")
      .attr("x", width + 50)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});
});

