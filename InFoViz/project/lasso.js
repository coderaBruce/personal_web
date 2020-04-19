// Project Scatter Plot + LassoG on mutalfund 
// reference to: http://bl.ocks.org/weiglemc/6185069
// @Author: Xinyu(Bruce) Li
// TODO: tooltip, study axis text compared to reference
// function detailPlot(xMeaning, yMeaning){
function lassoDraw(xMeaning, yMeaning){
	// xMeaning = "3MO";
	// yMeaning = "1YR"
	console.log("Loading Lasso Scatter Plot.js");
	// 这个很重要，每次开始画图时，选定id, remove掉
	d3.select("#lassoFigure").remove();

	// 1. Margin;
	var outWidth = 1000, outHeight = 600;
	var margin = {top: 50, right: 150, bottom: 70, left: 100},
		width = outWidth - margin.left - margin.right,
		height = outHeight - margin.top - margin.bottom;
	var rmin = 5, rmax = 12;

	// 2. Scale
		// var yScale = d3.scaleBand().rangeRound([0, 500]).padding(5);
	//xMeaning vs Caleroies
	var xScale = d3.scaleLinear([0, width]);
	var yScale = d3.scaleLinear([height, 0]);
	var rScale = d3.scaleLinear([rmin, rmax]);
	var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

	// 3. Axis
	var xAxis = d3.axisBottom(xScale);//,.ticks(5);
	var yAxis = d3.axisLeft(yScale);

	// 4. 定义一个svg区域（圈一块地）, 定图的范围
	var svg = d3.select("div.myCss02")//("#myspace01")
				.append("svg")
				.attr("width", outWidth)
				.attr("height", outHeight)
				.attr("id", "lassoFigure")
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var borderPath = svg.append("rect")
       			.attr("x", 0)
       			.attr("y", -50)
       			.attr("height", height+50)
       			.attr("width", outWidth-110)
       			.style("stroke", "black")
       			.style("fill", "none")
       			.style("stroke-width", 1);	

					
	// Lasso declaration
	// Lasso functions
	var lasso_start = function() {
		d3.selectAll("table > *").remove()	
		console.log("start");
		lasso.items()
			// When start, reset all size
			.attr("r", function(d){
						return rScale(d.Yield);})
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
			// 			return rScale(d.Yield);});
		
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
	d3.csv("../Data/a1-mutualfunds.csv").then(function(data){
		// change string (from CSV) into number format	
		console.log(data.columns);
		console.log("xMeaning" in data.columns);	
		console.log(data[1]);;
		data.forEach(function(d) {
			d[xMeaning] = +d[xMeaning];
			d[yMeaning] = +d[yMeaning];
			// "Yield" here referes to r
			d[ "Yield" ] = +d[ "Yield" ];
			d[ "3YR" ] = +d[ "3YR" ];
			d[ "Symbol" ] = d[ "Symbol" ].toString();
			// d.xMeaning = d.xMeaning;
		   // 这里用[] 来index可以,而不能用console."xMeaning" 
		   // console.log(d["3YR"]);
	  });
		// 5.1 Associate scale:  domain with range
		// don't want circles overlapping axis, so add in buffer to data domain
		xScale.domain([ d3.min( data, function(d){return d[xMeaning];})-1,
						d3.max( data, function(d){return d[xMeaning];})+1]);
		yScale.domain([ d3.min( data, function (d){ return d[yMeaning];})-1,
						d3.max( data, function (d){ return d[yMeaning];})+1]); 
		// xScale.domain([-10,40]);
		// yScale.domain([-40,80]);
		rScale.domain([ d3.min( data, function (d){ return d["Yield"];}),
						d3.max( data, function (d){ return d["Yield"];})]); 
		console.log(d3.max( data, function (d){ return d[yMeaning];}));
		// yScale.domain(d3.range(data.length));

		// 5.2 开始画circles
		// 先整体transform svg, 为了空出坐标轴的距离
		//svg = svg.append("g")
		//        //这是字符串加法，因为translate要是字符串
		//		.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 


		// console.log(data);
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
						return xScale(d[xMeaning]); })
			.attr("cy", function(d){
						return yScale(d[yMeaning])})
			.attr("r", function(d){
						return rScale(d.Yield);})
			// 把以下数据加入attr,方便引用
			.attr("Name",function(d){ return "asdf";})
			.attr("Symbol",function(d){ return d.Symbol;})
			.attr("YTD",function(d){ return d.YTD;})


			.attr("_1YR",function(d ){return d["1YR"];})
			.attr("_3YR",function(d ){return d["3YR"];})
			.attr("_5YR",function(d ){return d["5YR"];})
			.attr("Yield",function(d ){return d.Yield;})
			.attr("Category",function(d ){return d.Category;})
			.attr("fill",    function (d){ 
							return   colorScale(d.Category); });
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
			.text(xMeaning);
		// y axis
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		 svg.append("text")
			.attr("transform", "rotate(-90)")
			.style("text-anchor", "middle")
			.attr("x", -30)
			.attr("y", 20)
			.text(yMeaning);


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
			.text(yMeaning +" VS. "+ xMeaning+" Figure");

		console.log(xScale.invert(40));
	});
}	



