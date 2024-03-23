import * as d3 from "d3";
import $ from 'jquery'
const D3Line = {};

D3Line.create = (el, data, conf) => {
    if ($(conf.id).children().children().length >= 1){return}
    const color = conf.colors,
          width = parseInt($(conf.id).css("width")) - parseInt($(conf.id).css("padding-left")) - parseInt($(conf.id).css("padding-right")),
          height = parseInt($(conf.id).css("height")) - parseInt($(conf.id).css("padding-top")) - parseInt($(conf.id).css("padding-bottom")) - conf.legendHeight
    D3Line.width = width
    D3Line.height = height
    let svg = d3.select(el)
                .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("vertical-align", "center")
                    .attr("viewBox", [0, 0, width, height])
    D3Line[conf.id] = svg
    D3Line.createGraph(svg, data, conf)
    return [null, svg]

};

D3Line.update = (el, data, conf, chart) => {
if (typeof chart != "undefined"){
        D3Line[conf.id].selectAll("path").remove()
        D3Line[conf.id].selectAll("rect").remove()
        D3Line[conf.id].selectAll(".yAxes").remove()
        D3Line[conf.id].selectAll(".xAxes").remove()
        D3Line[conf.id].selectAll(".markers").remove()
        D3Line.createGraph(D3Line[conf.id], data, conf)
    }
};

D3Line.destroy = (node) => {
    $(node).children().remove()
};

D3Line.createGraph = (svg, data, conf) => {
  
    const color = conf.colors,
        width = parseInt($(conf.id).css("width")) - parseInt($(conf.id).css("padding-left")) - parseInt($(conf.id).css("padding-right")),
        height = parseInt($(conf.id).css("height")) - parseInt($(conf.id).css("padding-top")) - parseInt($(conf.id).css("padding-bottom")) - conf.legendHeight,
        allData = data.map((line) => line.values).flat()

      const xAxis = d3.scaleLinear()
        .domain(d3.extent(allData, (d, idx) =>
            {
                return d.x
            }))
        .range([conf.ml, width - conf.mr]),
      yAxis = d3.scaleLinear()
        .domain([0, d3.max(allData, (d) => +d.value)])
        .range([height - conf.mb, conf.mt]);

    svg.append("g")
        .attr("class", "yAxes")
        .attr("color",conf.strokeColor)


    svg.append("g")
        .attr("transform", "translate(0," + (height - conf.mb) + ")")
        .attr("class", "xAxes")
        .attr("color",conf.strokeColor)
        .call(d3.axisBottom(xAxis));

  svg.append("g")
      .attr("class", "markers")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${conf.ml},0)`)
      .call(d3.axisLeft(yAxis).ticks(height / 40))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", (width - conf.mr - conf.ml))
          .attr("stroke-opacity", 0.1))

    svg.selectAll(".line")
      .data(data)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", (d) => color[d.key].color)
        .attr("stroke-width", "0.2rem")
        .attr("d", function(d){
          return d3.line()
            .x((d, idx) =>  {
                return xAxis(d.x)
                })
            .y((d) =>  yAxis(+d.value))
            (d.values)
          })
}
export default D3Line;