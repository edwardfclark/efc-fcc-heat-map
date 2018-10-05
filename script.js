document.addEventListener("DOMContentLoaded", function() {

    let request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", true);
    request.send();

    request.onload = function() {
        const dataset = JSON.parse(request.responseText);

        const months = {1:"January", 2:"February", 3:"March", 4:"April", 5:"May", 6:"June", 7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12: "December"};

        function pickColor(d) {
            if (d.variance + dataset.baseTemperature > 12.8) {
                return "#a50026";
            } else if (d.variance + dataset.baseTemperature > 11.7) {
                return "#d73027";
            } else if (d.variance + dataset.baseTemperature > 10.6) {
                return "#f46d43";
            } else if (d.variance + dataset.baseTemperature > 9.5) {
                return "#fdae61";
            } else if (d.variance + dataset.baseTemperature > 8.3) {
                return "#fee090";
            } else if (d.variance + dataset.baseTemperature > 7.2) {
                return "#ffffbf";
            } else if (d.variance + dataset.baseTemperature > 6.1) {
                return "#e0f3f8";
            } else if (d.variance + dataset.baseTemperature > 5) {
                return "#abd9e9";
            } else if (d.variance + dataset.baseTemperature > 3.9) {
                return "#74add1";
            } else if (d.variance + dataset.baseTemperature > 2.8) {
                return "#4575b4";
            } else {
                return "#313695";
            }
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
            .style("left", (d3.event.pageX+10)+"px")
            .style("top", (d3.event.pageY-28)+"px")
            .attr("data-year", "PLACEHOLDER");
        })
        .on("mouseout"), (d) => {

        };
        
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
        document.getElementById("test").innerHTML = yearMax;
    }
});