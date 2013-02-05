 
// function tweetPace(){   
//now show the pace of the tweets, quantized per hour //    
 d3.csv('tweet-pace-hour.csv', function( data ){
 	
 format = d3.time.format("%Y-%m-%d %H:%M");   
 
 var w = 900,
     h = 200;
   
var m = [20, 40, 20, 40];
 w = w - m[1] - m[3];
 h = h - m[0] - m[2];
 
var parse = d3.time.format("%d-%b-%y");

// Scales and axes. Note the inverted domain for the y-scale: bigger is up!
var x = d3.time.scale().range([0, w]),
    y = d3.scale.linear().range([ 0, h]);

    
 var  min = Infinity,mindate= new Date(2011,10,1),
      max = -Infinity, maxdate= new Date(2010,1,15);

var count = [],
    dates = [];
     
   data.forEach(function(val) {     	
      count.push(+val.tweet_count);	 
      dates.push(val.tweet_date);     
    });
  //because date column is sorted //
   x.domain([new Date( format.parse(dates[0])), new Date( format.parse(dates[data.length-1]))] );//.ticks(d3.time.months);
   y.domain([d3.min(count), d3.max(count)]);

var  yAx = d3.scale.linear().domain( [d3.min(count), d3.max(count)] ).range([ h, 0]);

var xAxis = d3.svg.axis().scale(x).tickFormat(parse).tickSize(5).ticks(d3.time.months).tickSubdivide(true),
    yAxis = d3.svg.axis().scale(yAx).ticks(7).orient("left").tickSubdivide(true);
  
var chart = d3.select("#pace").append("svg:svg")
     .attr("class", "chart")     
     .attr("width", w + m[1] + m[3])
     .attr("height", h + m[0] + m[2])
     .attr("shape-rendering", "crispEdges")
     .append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");
     // .on("mouseover", function(){return tooltip.style("visibility", "visible").text("tooltip");})
  	 // text("Date:"+format.parse(d.tweet_date)+", Tweets "+d.tweet_count);})
     // .on("mousemove", function(){ console.log(d3.svg.mouse(this)[0]);  console.log(x.invert( d3.svg.mouse(this)[0]));
     		// return tooltip.style("top", d3.event.pageY-0.5+"px" ).style("left", d3.event.pageX-0.5+"px" );})
	 // .on("mouseout", function(){return  tooltip.style("visibility", "hidden");}); 	 
 
 
 chart.selectAll("rect")
     .data(data)
 	 .enter().append("rect")
 	 // .attr("class", "hist")
     .attr("x", function(d) { return x(format.parse(d.tweet_date)) - .5; })
     .attr("y", function(d) { return h -y(d.tweet_count) - .5; })
     .attr("width", 1)
     .attr("height", function(d) { return y(d.tweet_count); })
     .attr("fill", "#2d578b");
  	 // .on("mouseover", function(d){return tooltip.style("visibility", "visible").text("Date:");})
  	 // text("Date:"+format.parse(d.tweet_date)+", Tweets "+d.tweet_count);})
     // .on("mousemove", function(d,i){return tooltip.style(
     		// "top", ( h - y(d.tweet_count)-0.5+"px")).style("left", x(i)+"px");})
	 // .on("mouseout", function(){return  tooltip.style("visibility", "hidden");});
      

 chart.append("line")
     .attr("x1", 0)
     .attr("x2", w)
     .attr("y1", h - .5)
     .attr("y2", h - .5)
     .style("stroke", "#000");   
     
      // Add the x-axis.
  chart.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

  // Add the y-axis.
  chart.append("svg:g")
      .attr("class", "y axis")
      // .attr("transform", "translate(" + w + ",0)")
      .call(yAxis);
    
    
     });
    // }