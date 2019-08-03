function stackedBarchart(){
var svg = d3.select("#stacked"),
    margin = {top: 20, right: 10, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set x scale
var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);
var sc_tooltip = floatingTooltip('sc_tooltip', 240);

// set y scale
var y = d3.scaleLinear()
    .range([height-60, 0]);

// set the colors 
var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


// load the csv and create the chart
d3.csv("data/Automobile_stacked.csv", function(d, i, columns) {

  return d;
}, 

function(error, data) {
  if (error) throw error;
  
  var keys = data.columns.slice(1,5);

  data.sort(function(a, b) { return b.total - a.total; });
  x.domain(data.map(function(d) { return d.Make; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Make); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
    .on("mouseover", showSCDetail)
    .on("mouseout", hideSCDetail)
    .on("mousemove", function(d) {

    });


function showSCDetail(d) {
    var content = '<span class="name">Avg Price: </span><span class="value">' +
       +Math.round(d[1]-d[0]) +
        '</span><br/>' +
        '<span class="name">Make : </span><span class="value">' +
        d.data.Make + ""+
        '</span>';
    
    sc_tooltip.showTooltip(content, d3.event);
}


function hideSCDetail(d) {
    sc_tooltip.hideTooltip();
}
var heightForAxis = height - 60;
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + heightForAxis  + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
      
      svg.append('text')
                .attr('x', -200)
                .attr('y', 10)
                .attr('class', 'label')
                .attr("transform", "rotate(-90)")
                .text('Avg Price($)');
        svg.append("g")
            .attr("class", "annotation-group")
            .attr("id", "stacked_chart_annotation")
            .call(stacked_chart_makeAnnotations);
}
        
 );


}
stackedBarchart();