const width = 540;
const height = 540;
const radius = Math.min(width, height) / 2;

const svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
    "#e78ac3","#a6d854","#ffd92f"]);

const pie = d3.pie()
    .value(d => d.count)
    .sort(null);

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);



function type(d) {
    d.time_percentage = Number(d.time_percentage);
    d.arrested_percentage = Number(d.arrested_percentage);
    return d;
}

function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
}

d3.json("./data.json", type).then(data => {
    d3.selectAll("input")
        .on("change", update);

    svg.append("circle").attr("cx", 300).attr("cy", 0).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#66c2a5");
    svg.append("circle").attr("cx", 300).attr("cy", 30).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#fc8d62");
    svg.append("circle").attr("cx", 300).attr("cy", 60).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#8da0cb");
    svg.append("circle").attr("cx", 300).attr("cy", 90).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#e78ac3");
    svg.append("circle").attr("cx", 300).attr("cy", 120).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#a6d854");
    svg.append("circle").attr("cx", 300).attr("cy", 150).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#ffd92f");
    svg.append("text").attr("x", 320).attr("y", 0).text("0:00-4:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
    svg.append("text").attr("x", 320).attr("y", 30).text("4:00-8:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
    svg.append("text").attr("x", 320).attr("y", 60).text("8:00-12:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
    svg.append("text").attr("x", 320).attr("y", 90).text("12:00-16:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
    svg.append("text").attr("x", 320).attr("y", 120).text("16:00-20:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
    svg.append("text").attr("x", 320).attr("y", 150).text("20:00-0:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");

    svg.append("circle").attr("cx", 300).attr("cy", 0).attr("r", 6).attr("opacity", 0).attr("class", "label2").style("fill", "#66c2a5");
    svg.append("circle").attr("cx", 300).attr("cy", 30).attr("r", 6).attr("opacity", 0).attr("class", "label2").style("fill", "#fc8d62");
    svg.append("text").attr("x", 320).attr("y", 0).text("arrested").attr("opacity", 0).attr("class", "label2").style("font-size", "15px").attr("alignment-baseline", "middle");
    svg.append("text").attr("x", 320).attr("y", 30).text("not arrested").attr("opacity", 0).attr("class", "label2").style("font-size", "15px").attr("alignment-baseline", "middle");

    function update(val = this.value, year) {
        // Join new data
        const path = svg.selectAll("path")
            .data(pie(data[val][year]));

        // Update existing arcs
        path.transition().duration(200).attrTween("d", arcTween);

        // Enter new arcs
        path.enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "6px")
            .each(function(d) { this._current = d; });

        var app = document.getElementsByClassName("label1");
        var app2 = document.getElementsByClassName("label2");
        if (val.localeCompare("arrested_percentage")) {
            for (var i = 0; i < app2.length; i++) {
                app2[i].style.opacity = 0;
            }
            for (var k = 0; k < app.length; k++) {
                app[k].style.opacity = 1;
            }
        } else {
            for (var l = 0; l < app.length; l++) {
                app[l].style.opacity = 0;
            }
            for (var j = 0; j < app2.length; j++) {
                app2[j].style.opacity = 1;
            }

        }

    }


    update("time_percentage", year);
});
