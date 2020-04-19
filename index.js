// 抄抄code search d3 bar chart, 找bl.ock
// e.g.: https://bl.ocks.org/d3noob/8952219是barchart 
// 改data即可
// add.transimition等加interaction
// 可以一个vertical barchart,一个horizontal barchar
// filezilla: sftp://wasp.cs.kent.edu

// Lasso selection
// http://bl.ocks.org/skokenes/511c5b658c405ad68941

// Grouped Bar Chart toggle series
// https://bl.ocks.org/Andrew-Reid/64a6c1892d1893009d2b99b8abee75a7
//
// 3/10/2020
// console.log(d3);
//  var svg = d3.select('#myspace')
// 		.append('svg')
// 		.attr('width', '500')
// 		.attr('height', '500');
// var rect = svg.append('rect')
// 		.attr('x', 50)
// 		.attr('y', 50)
// data.enter() does not update the old indexed data: svg.append().attr()
// 要有update phase:
// 必须另起一个表达式 svg.append(rect); 完了再另起一行svg.attr(....) 
console.log(33333);
d3.csv('./score.csv').then(function(data){
	//slect body tag
	d3.select('body')
		.append('button')
		//以下等价于在body 中：
		//<button>click me</button>,
		.attr('html', 'click me')
	//scale: 是container的wdith and height
	var xScale = d3.scaleLinear()  //xScale return x,y position of a data tuple
		.domain([0, 100])   //data space;
		.range([0, 500]);  //pixels space
	
	// Ordinal scale
	var yScale = d3.scaleOridinal()
		.domain(['A','B','C'])
		.range([0, 100]);
	// var yScale = d3.scaleOrdinal();
	
	// draw a svg to cover
	var svg = d3.select('#myspace').append('svg')
		.attr('width', 500)
		.attr('height', 500);

	for (var i = 0; i < data.length; i++){
		student = data[i];
		console.log(xScale(student['score']));
		console.log(yScale(student['name']));
		var circle = svg.append('circle')
			.attr('cx',xScale(studnet['score']))
			.attr('cy',yScale(studnet['name']))
			.attr('r', 5)
			.attr(fill, red);

		var circle = svg.append('rect')
			.attr(x, 0)
			.attr('width',xScale(studnet['score']))
			.attr(y, i * 20)
			.attr('height',yScale(studnet['name']))
			.attr(fill, red);
		//Add animation
		var circle = svg.append('rect')
			.transition().delay(1000)//这个延时会从左上到右下
			.attr(x, 0)
			.attr('width',xScale(studnet['score']))
			//加一个延时(animate哪个，就在哪个前面加animation,比如这个就是在height前面加)
			.transition().delay(1000)
			.attr(y, i * 20)
			.attr('height',yScale(studnet['name']))
			.style(fill, red)
			//Interaction
			.on('mouseover',function(){
				d3.select(this).style('fill', 'blue')	
			})
			.on('mouseout',function(){
				de.select(this).style('fill','red')	
			});
	}

	//de.enter(),update(),exit()
	//Enter 的用法;Good programming pattern
	d3.selectALL('rect')
		.data(data) //when new data comes, data attribute is updated
		.enter()  
		.append('rect')
		.attr('x',0)
		//d 在这里就是data的没一个tuple
		.attr('y',function(d,i){return i;})//i是index
		.attr('width',function(d){
			return xScale(d['score']);	
		})

	console.log(data)
	for (var i = 0; i < data.length(); i++){
		var student = data[i];
		Object.keys(student).forEach(function(key){
			console.log(4);	
		})
	}

});
