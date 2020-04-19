// PieChar 
// reference to: http://bl.ocks.org/weiglemc/6185069
// @Author: Xinyu(Bruce) Li
// TODO:  study how to associate data with pie/arc
console.log("Loading homework2.js");


// 1. Margin;
var outerRadius = 300, innerRadius = 0;
var outWidth = 800, outHeight = 800;
var margin = {top: 50, right: 50, bottom: 50, left: 50},
	width = outWidth - margin.left - margin.right,
	height = outHeight - margin.top - margin.bottom;
var rmin = 1, rmax = 10;

// 2. Scale
colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// 3. Arc generator;
var arc = d3.arc()
    .outerRadius(outerRadius - 10)
    .innerRadius(0);

// 3.1  Label Arc generator;
var labelArc = d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius + 100);


// 4. 定义一个svg区域（圈一块地）, 定图的范围
var svg = d3.select("body")//("#myspace01")
			.append("svg")
			.attr("width", 0) // why both 0 here?
			.attr("height", 0);
// 5. Loading Data, start plotting
d3.csv("../Data/a1-film.csv").then(function(data){
console.log(data);
// 5.1 Nest data to Subject;
var data = d3.nest()
			  .key(function(d) { console.log(d);return d.Subject; })
			  .rollup(function(v) { console.log(v);return v.length; })
			  .entries(data);

// 5.2 transform chart
svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height/2 + ")");

// 5.2 Generate pie chart;
var pie = d3.pie()
		    .sort(null)
			.value(function(d) { return d.value; });

// 5.3 Associate pie chart with data 
  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");
  
  // append path 
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return colorScale(d.data.key); }) //注意是d.data.key
        
  // append text
  g.append("text")
      .attr("dy", ".35em")
      .text(function(d) { return d.data.key; })
	  .attr("transform", function(d){
		  				console.log(d);
	 					var angle_pi = (d.endAngle + d.startAngle) / 2;
						var angle360 = angle_pi * 360 / (2 * 3.1415926);
							console.log(angle360);
						if (d.startAngle < 3.1415926){
							// return "rotate(90)";
							return "translate(" + labelArc.centroid(d) + ")" 
									+"rotate(" + (+270 + angle360) + ")";
						}else {
							return "translate(" + labelArc.centroid(d) + ")"
								   +"rotate(" + (+90 + angle360) + ")";
						}
					
	  				})


});
