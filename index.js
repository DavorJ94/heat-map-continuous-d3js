// ! Defining width and height of SVG container
const width = 1400;
const height = 700;

// ! Create SVG Element
const heatMap = d3
  .select("body")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .attr("id", "heatMap")
  .style("background-color", "white")
  .style("margin-top", "10px")
  .style("margin", "auto")
  .style("box-shadow", "2px 1px 20px 6px #000000");

// ! Rendering the chart using the function
const renderHeatMap = (data) => {
  // prettier-ignore
  const monthNames = ["January","February","March","April",
  "May","June","July","August","September","October","November","December"];
  const baseTemp = +data.baseTemperature;
  data = data.monthlyVariance;
  // ! Margin convention
  margin = { top: 100, right: 50, bottom: 90, left: 110 };
  const innerWidth = width - margin.right - margin.left;
  const innerHeight = height - margin.top - margin.bottom;

  // ! Setting the domain and scale of x and y axis

  const xScale = d3
    .scaleBand()
    .range([0, innerWidth])
    .domain(
      d3.map(data, function (d) {
        return d.year;
      })
    );

  const yScale = d3
    .scaleBand()
    .range([0, innerHeight])
    .domain(
      d3.map(data, function (d) {
        return d.month;
      })
    );

  // ! Introducing subgroup "g"
  const gheatMap = heatMap
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // ! Defining tooltip
  var tooltipForData = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // ! Creating the chart
  var myColor = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => baseTemp + d.variance),
      d3.median(data, (d) => baseTemp + d.variance),
      d3.max(data, (d) => baseTemp + d.variance),
    ])
    .range(["#3575B4", "#FFFFAA", "#D73027"])
    .interpolate(d3.interpolateHcl);

  gheatMap
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", function (d) {
      return xScale(d.year);
    })
    .attr("y", function (d) {
      return yScale(d.month);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .style("fill", function (d) {
      return myColor(baseTemp + d.variance);
    })
    .attr("data-month", (d) => monthNames.indexOf(d.month))
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemp + d.variance)
    .on("mouseover", function (event, d) {
      tooltipForData.transition().duration(100).style("opacity", 1);
      tooltipForData
        .html(
          d.year +
            " - " +
            d.month +
            "<br>" +
            "Average: " +
            parseFloat(baseTemp + d.variance).toFixed(2) +
            "℃" +
            "<br>" +
            "Variance: " +
            `${
              d.variance > 0
                ? "+" + d.variance.toFixed(2)
                : d.variance.toFixed(2)
            }` +
            "℃"
        )
        .attr("data-year", d.year)
        .style("left", d3.select(this).attr("x") + "px")
        .style("top", d3.select(this).attr("y") - 20 + "px");
    })

    .on("mouseout", function (d) {
      tooltipForData.transition().duration(100).style("opacity", 0);
    });

  // ! Introducing x axis
  const xAxisG = gheatMap
    .append("g")
    .call(
      d3
        .axisBottom(xScale)
        .tickValues(
          xScale.domain().filter(function (d, i) {
            return !(d % 10);
          })
        )
        .tickSizeOuter(0)
    )
    .attr("class", "forColoring")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`);

  // ! Introducing y axis
  const yAxisG = gheatMap
    .append("g")
    .attr("class", "forColoring")
    .attr("id", "y-axis")
    .call(d3.axisLeft(yScale).tickSizeOuter(0));
  // ! Introducing axis labels and title of chart
  xAxisG
    .append("text")
    .attr("class", "xAxisLabel")
    .text("Years")
    .attr("x", innerWidth / 2)
    .attr("y", 45);
  yAxisG
    .append("text")
    .attr("class", "yAxisLabel")
    .text("Months")
    .attr("x", -innerHeight / 2)
    .attr("y", -70)
    .style("transform", "rotate(-90deg)");
  gheatMap
    .append("text")
    .text("Monthly Global Land-Surface Temperature")
    .attr("id", "title")
    .attr("x", innerWidth / 2)
    .attr("y", -50);
  gheatMap
    .append("text")
    .text("1753 - 2015: base temperature is 8.66℃")
    .attr("id", "description")
    .attr("x", innerWidth / 2)
    .attr("y", -20);

  // ! Creating the legend
  var linearGradient = heatMap
    .append("linearGradient")
    .attr("id", "linear-gradient");
  //Horizontal gradient
  linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");
  //Append multiple color stops by using D3's data/enter step
  linearGradient
    .selectAll("stop")
    .data([
      { offset: "0%", color: "#3575B4" },
      { offset: "50%", color: "#FFFFAA" },
      { offset: "100%", color: "#D73027" },
    ])
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });
  minLegend = d3.min(data, (d) => baseTemp + d.variance);
  maxLegend = d3.max(data, (d) => baseTemp + d.variance);
  sumMinMaxLegend =
    d3.max(data, (d) => baseTemp + d.variance) +
    d3.min(data, (d) => baseTemp + d.variance);
  var legendWidth = width * 0.3,
    legendHeight = 8;
  //Color Legend container
  var legendsvg = heatMap
    .append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      "translate(" + (margin.left + legendWidth / 2) + "," + (height - 50) + ")"
    );
  //Draw the Rectangle
  legendsvg
    .append("rect")
    .attr("class", "legendRect")
    .attr("x", -legendWidth / 2 + 0.5)
    .attr("y", 10)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#linear-gradient)")
    .style("stroke", "black")
    .style("stroke-width", "1px");
  //Append title
  legendsvg
    .append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", 2)
    .text("Average Global Surface Temperature");
  //Set scale for x-axis
  var xScale2 = d3
    .scaleLinear()
    .range([0, legendWidth])
    .domain([
      d3.min(data, (d) => baseTemp + d.variance),
      d3.max(data, (d) => baseTemp + d.variance),
    ]);
  var xAxis = legendsvg
    .append("g")
    .call(
      d3
        .axisBottom(xScale2)
        .tickValues([
          minLegend,
          (sumMinMaxLegend / 2 + minLegend) / 2,
          sumMinMaxLegend / 2,
          (sumMinMaxLegend / 2 + maxLegend) / 2,
          maxLegend,
        ])
        .tickFormat((x) => x.toFixed(2))
    )
    .attr("class", "legendAxis")
    .attr("id", "legendAxis")
    .attr(
      "transform",
      "translate(" + -legendWidth / 2 + "," + (10 + legendHeight) + ")"
    );

  // ! Adding source
  const divSource = d3
    .select("svg")
    .append("g")
    .attr("transform", `translate(${width - margin.right}, ${height - 30})`);
  divSource
    .append("text")
    .attr("class", "textSource")
    .text("Data source: ")
    .append("a")
    .attr("class", "linkSource")
    .attr(
      "href",
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    )
    .attr("target", "_blank")
    .text("https://raw.githubusercontent.com/freeCodeCamp...");

  // ! Adding author
  const author = d3
    .select("body")
    .append("h1")
    .attr("class", "nameAuthor")
    .text("Created by ")
    .append("a")
    .attr("href", "https://www.linkedin.com/in/davor-jovanovi%C4%87/")
    .attr("target", "_blank")
    .text("DavorJ");
};

// ! Getting the data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
).then((data) => {
  // prettier-ignore
  const monthNames = ["January","February","March","April",
  "May","June","July","August","September","October","November","December"];
  data.monthlyVariance.forEach((d) => {
    var parseTime = d3.timeFormat("%Y");
    d.month = monthNames[d.month - 1];
    // d.year = +d.year;
    d.year = parseTime(new Date(d.year, 0));
    d.variance = +d.variance;
  });
  renderHeatMap(data);
});
