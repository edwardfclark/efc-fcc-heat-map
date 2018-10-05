document.addEventListener("DOMContentLoaded", function() {

    let request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", true);
    request.send();

    request.onload = function() {
        const dataset = JSON.parse(request.responseText);

        const months = {1:"January", 2:"February", 3:"March", 4:"April", 5:"May", 6:"June", 7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12: "December"};

        //The pickColor() function takes a datapoint and calculates the color based on that input. It uses the d3.scaleLinear() functionality to map the input to an array value.
        function pickColor(datapoint) {
            
            let colors = ["#313695", "#4575b4", "#74add1", "#abd9e9", "#e0f3f8", "#ffffbf", "#fee090", "#fdae61", "#f46d43", "#d73027", "#a50026"];
            const max = d3.max(dataset.monthlyVariance, (d) => d.variance);
            const min = d3.min(dataset.monthlyVariance, (d) => d.variance);
            const colorScale = d3.scaleLinear().domain([min, max]).range([0, 10]);

            return colors[Math.round(colorScale(datapoint.variance))];
            
        }

        function generateTooltip(d) {
            let html = "<p>";
            html += d.year + " - " + months[d.month] + "<br />";
            html += Number.parseFloat(d.variance + dataset.baseTemperature).toFixed(2)+"&#8451;"+"<br />";
            html += d.variance + "&#8451;"
            html += "</p>";
            return html;
        }

        const div = d3.select("body").append("div").attr("id", "tooltip").style("opacity", 0);
    
        //Constants for defining the structure of the SVG.
        const width = 1500;
        const height = 750;
        const padding = {top: 25, right: 75, bottom: 75, left: 75};
        const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

        //Constants for defining the scales and the axes.
        const yearMin = d3.min(dataset.monthlyVariance, (d) => d["year"]);
        const yearMax = d3.max(dataset.monthlyVariance, (d) => d["year"]);
        const yScale = d3.scaleLinear().domain([12.5, 0.5]).range([height-padding.bottom, padding.top]);
        const xScale = d3.scaleLinear().domain([yearMin, yearMax]).range([padding.left, width-padding.right]);
        
        const yAxis = d3.axisLeft(yScale).tickFormat((d) => {
            return months[d];
        });
        const xAxis = d3.axisBottom(xScale).ticks(26).tickFormat(d3.format("d"));


        //Rect elements indicating each datapoint.
        svg.selectAll("rect")
        .data(dataset.monthlyVariance)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale(d.month-0.5)) 
        .attr("width", xScale(2015) - xScale(2014))
        .attr("height", yScale(2) - yScale(1))
        .attr("fill", pickColor)
        .on("mouseover", (d) => {
            div.transition().duration(200).style("opacity", 1);
            div.html(generateTooltip(d))
            .style("left", (d3.event.pageX)-60+"px")
            .style("top", (d3.event.pageY)-75+"px")
            .attr("data-year", "PLACEHOLDER");
        })
        .on("mouseout", (d) => {
            div.transition().duration(200).style("opacity", 0);
        });
        
        //Y-Axis.
        svg.append("g")
        .attr("transform", "translate(" + (padding.left) +", 0)")
        .attr("id", "y-axis")
        .call(yAxis);

        //X-Axis.
        svg.append("g")
        .attr("transform", "translate(0," + (height-padding.bottom) + ")")
        .attr("id", "x-axis")
        .call(xAxis);

        //This is for testing, delete later.
        document.getElementById("test").innerHTML = d3.max(dataset.monthlyVariance, (d) => d.variance) + dataset.baseTemperature;
    }
});