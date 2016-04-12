$(document).ready(function() {
    console.log("Hello world.")
});


/* ---------------------- */
/* GLOBAL VARIABLES */
/* ---------------------- */


// We use the margins to offset the chartable space inside of the <svg> space.
// A great visual explanation of how this works is here: https://bl.ocks.org/mbostock/3019563
var margin = {
        top: 20,
        right: 20,
        bottom: 120,
        left: 50
    };

// Here, we define the width and height as that of the .chart div minus the margins.
// We do this to make sure our chart is responsive to the browser width/height
var width = $(".chart").width() - margin.left - margin.right;
var height = $(".chart").height() - margin.top - margin.bottom;

//copied from Blocks
formatDate = d3.time.format("%b %d, %Y");

// `x` and `y` are scale function. We'll use this to translate values from the data into pixels.
var x = d3.time.scale()
    .range([0, width]); //Range is an array of two *pixel* values.

var y = d3.scale.linear()
    .range([height, 0]);

// `xAxis` and `yAxis` are functions as well.
// We'll call them later in the code, but for now, we just want to assign them some properties:
// Axis have to abide by their scales: `x` and `y`. So we pass those to the axis functions.
// And we use the orient property to determine where the hashes and number labels show up.
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");;

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.observation_date); })
    .y(function(d) { return y(d.CLMUR); });

// We define svg as a variable here. It's a variable, so we could call it anything. So don't be confused by it being named the same as the tag.
var svg = d3.select(".chart").append("svg") // Appends the <svg> tag to the .chart div
    .attr("class", "parent-svg") // gives it class
    .attr("width", width + margin.left + margin.right) //gives the <svg> tag a width
    .attr("height", height + margin.top + margin.bottom) //gives the <svg> tag a height
    .append("g") // Appends a <g> (Group) tag to the <svg> tag. This will hold the actual chartspace.
    .attr("class", "chart-g") //assigns the <g> tag a class
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //Offsets the .chart-g <g> element by the values left and top margins. Basically the same as a left/right position.

/* END GLOBAL VARIABLES ---------------------- */


/* ---------------------- */
/* LOAD THE DATA */
/* ---------------------- */

// This is an ajax call. Same as when we load a json file.
d3.csv("data/columbia_unemployment.csv", function(error, data) {
    
    // Get observation_date values from the data.
    var datesDomain = d3.extent(data, function(d) {
        return +d.observation_date; // We use the `+` sign to parse the value as a number (rather than a string)   
    });

    // Get unemployment rates from the data.
    var unEmRate = d3.extent(data, function(d) {
        return +d.CLMUR;
    });
    

    // `minMaxParticipation` is an ARRAY OF TWO VALUES.
    // We'll assign it to the "domain" of the `x` scale. 
    x.domain(datesDomain);
  
    y.domain(unEmRate);
    // This is where we call the axis functions.
    // We do so by first giving it someplace to live. In this case, a new <g> tag with the class names `x` and `axis.`
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") //Assigns a left/right position.
        .call(xAxis) // This calls the axis function, which builds the axis inside the <g> tag.
        .append("text") // This and everyhing below just adds a label.
        .attr("class", "label")
        .attr("x", width)
        .attr("y", 18)
        .style("text-anchor", "end")
        .text("Date");

    // Same as above, but for the y axis.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Unemployment Rate")

    svg.append("path")
      .data(data)
      .attr("class", "line")
      .attr("d", line);
});

function type(d) {
  d.observation_date = formatDate.parse("%Y-%m-%d");
  d.CLMUR = +d.CLMUR;
  return d;
}