// Scatter Plot Matrix
// reference to:
// https://bl.ocks.org/Fil/6d9de24b31cb870fed2e6178a120b17d#index.html 
// @Author: Xinyu(Bruce) Li
// TODO: legend: how to associate data with d3
console.log("Loading homework2.js");


// 1. Margin;
var width = 900,
    size = 230,
    padding = 20;
	margin = 100;

// 2. Scale
var x = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scaleLinear()
    .range([size - padding / 2, padding / 2]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

// 3. Axis
var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(6);

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(6);

// 4. 圈地
function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}

console.log(11111);

// 5. Loading data
// Note: .then(function(data)): 这样是load完data再处理data
// 		d3.csv(url, function()): 这样function内部是N次循环，N为tuple数
d3.csv("../Data/a1-mutualfunds.csv").then( function(data) {

	console.log(data[1]);
  var domainByTrait = {},
      // traits = d3.keys(data[0]).filter(function(d) { return d !== "Occupation"; }),
	  traits = ["3MO", "1YR", "3YR"];
      n = traits.length;

	// change string (from CSV) into number format	
	data.forEach(function(d){

		d["3MO"] = +d["3MO"];
		d["1YR"] = +d["1YR"];
		d["3YR"] = +d["3YR"];
		// d["Protein (g)"] = +d["Protein (g)"];
	//    console.log(d);
  });
  traits.forEach(function(trait) {
    domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
  });

console.log(domainByTrait);
  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  // var brush = d3.brush()
  //     .on("start", brushstart)
  //     .on("brush", brushmove)
  //     .on("end", brushend)
  //     .extent([[0,0],[size,size]]);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", width)
    .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

  svg.selectAll(".x.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

  svg.selectAll(".y.axis")
      .data(traits)
    .enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

  var cell = svg.selectAll(".cell")
      .data(cross(traits, traits))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);
	// Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });


  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByTrait[p.x]);
    y.domain(domainByTrait[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", function(d) { return x(d[p.x]); })
        .attr("cy", function(d) { return y(d[p.y]); })
        .attr("r", 2)
        .style("fill", function(d) { return color(d.Category); });
  }

// draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {console.log(d); return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 100)
	  .attr("y", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 100)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;});
  // var brushCell;

  // // Clear the previously-active brush, if any.
  // function brushstart(p) {
  //   if (brushCell !== this) {
  //     d3.select(brushCell).call(brush.move, null);
  //     brushCell = this;
  //   x.domain(domainByTrait[p.x]);
  //   y.domain(domainByTrait[p.y]);
  //   }
  // }

// // Highlight the selected circles.
  // function brushmove(p) {
  //   var e = d3.brushSelection(this);
  //   svg.selectAll("circle").classed("hidden", function(d) {
  //     return !e
  //       ? false
  //       : (
  //         e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0]
  //         || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
  //       );
  //   });
  // }

  // // If the brush is empty, select all circles.
  // function brushend() {
  //   var e = d3.brushSelection(this);
  //   if (e === null) svg.selectAll(".hidden").classed("hidden", false);
  // }
});



