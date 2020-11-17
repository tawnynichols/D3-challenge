var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Import Data
d3.csv("assets/data/data.csv", function(err, hairData) {
        if (err) throw err;

        console.log(hairData);

        // Step 1: Parse Data/Cast as numbers
        // ==============================
        hairData.forEach(function(data) {
            data.smokes = +data.smokes;
            data.age = +data.age;
            data.poverty = +data.poverty;
        });

        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([20, d3.max(hairData, d => d.age)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(hairData, d => d.smokes)])
            .range([height, 0]);

        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart
        // ==============================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(hairData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.age))
            .attr("cy", d => yLinearScale(d.smokes))
            .attr("r", "12")
            .attr("stroke-width", "1")
            .classed("stateCircle", true)
            .attr("opacity", 0.75);

        chartGroup.append("g")
            .selectAll('text')
            .data(hairData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d.age))
            .attr("y", d => yLinearScale(d.smokes))
            .classed(".stateText", true)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", "9px")
            .attr("alignment-baseline", "central")

        // Step 6: Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .attr("font-size", "9px")
            .html(function(d) {
                return (`${d.state}<br>Average Age: ${d.age}<br>Smoking %: ${d.smokes}`);
            });

        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("mouseover", function(data) {
                toolTip.show(data, this);
            })
            // onmouseout event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Median Age of State");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Percentage of Smoking in each State");
    }) //.catch(function(error) {
    //console.log(error);
    //});