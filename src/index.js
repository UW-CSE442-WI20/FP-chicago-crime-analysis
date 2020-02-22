// set the dimensions and margins of the graph
var margin = {top: 80, right: 50, bottom: -30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var year = 2010;

// set the ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.2);
var y = d3.scaleLinear()
    .range([height, 0]);

var json = require('./chicago.json');

//Width and height
var width4 = 1000;
var height4 = 500;

// create a first guess for the projection
var center = d3.geoCentroid(json)
var scale = 150;
var projection = d3.geoMercator().scale(scale).center(center);
//Define path generator
var path = d3.geoPath()
                .projection(projection);

// using the path determine the bounds of the current map and use
// these to determine better values for the scale and translation
var bounds = path.bounds(json);
var hscale = scale * width4 / (bounds[1][0] - bounds[0][0]);
var vscale = scale * height4 / (bounds[1][1] - bounds[0][1]);
var scale = (hscale < vscale) ? hscale : vscale;
var offset = [width4 - (bounds[0][0] + bounds[1][0]) / 2,
                     height4 - (bounds[0][1] + bounds[1][1]) / 2];

// new projection
projection = d3.geoMercator().center(center)
     .scale(scale * 0.9).translate(offset);
path = path.projection(projection);


//Create SVG element
var svg4 = d3.select("body").append("svg")
           .attr("width", width4)
            .attr("height", height4)
            .attr("id", "map");

//Bind data and create one path per GeoJSON feature
/*svg4.selectAll("path")
  .data(json.features)
  .enter()
  .append("path")
  .attr("d", path)
  .attr("class", "zipcode");*/

svg4.append("text")
        .attr("x", 250)             
        .attr("y", 18)
        .attr("text-anchor", "middle")  
        .style("font-size", "22px") 
        .style("font-family", "STFangsong")
        .style("font-weight", "bold")
        .text("Chicago Map");


var color4 = d3.scaleQuantize()
            .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

var csvFile4 = require('./2001_all.csv');
    d3.csv(csvFile4).then(function(data) {
        color4.domain([
            d3.min(data, function(d) { return Math.log(d.Number); }),
            d3.max(data, function(d) { return Math.log(d.Number); })
        ]);
       
        //Load in GeoJSON data
        
            //Merge the ag. data and GeoJSON
            //Loop through once for each ag. data value
            for (var i = 0; i < data.length; i++) {
                //Grab state name
                var dataState = data[i].District;

                //Grab data value, and convert from string to float
                var dataValue = parseInt(data[i].Number);
                

                //Find the corresponding state inside the GeoJSON
                for (var j = 0; j < 25; j++) {
                    var jsonState = json.features[j].properties.dist_num;

                    if (dataState == jsonState) {

                        //Copy the data value into the JSON
                        json.features[j].properties.value = Math.log(dataValue);

                        break;
                    }
                }
            }
            //Bind data and create one path per GeoJSON feature
            svg4.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", "zipcode")
                .style("fill", function(d) {
                //Get data value
                var value = d.properties.value;

                if (value) {
                    //If value exists…
                    console.log(color4(value));
                    return color4(value);
                } else {
                    //If value is undefined…
                    return "#ccc";
                }
            });
        
    });

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.tip().attr('class', 'd3-tip').direction('n').offset([-5, 0])
    .html(function(d) {
        var content = "<span style='margin-left: 2.5px;'><b>" + d.number + "</b></span><br>";
        return content;
    });

goBack();

const radius = Math.min(width,height) / 2;

const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
    "#e78ac3","#a6d854","#ffd92f"]);

const pie = d3.pie()
    .value(d => d.count)
    .sort(null);

const arc = d3.arc()
    .innerRadius(100)
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

function update(val = this.value) {

    svg.selectAll("text").remove();

    var butt = document.getElementById("control");
    butt.style.display = "block";

    var note = document.getElementById("note");
    note.style.display = "block";

    var ex1 = document.getElementById("explain1");
    ex1.style.display = "none";

    var ex2 = document.getElementById("explain2");
    ex2.style.display = "block";

    svg.attr("transform", `translate(${300}, ${height - 120})`);

    svg.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 1).attr("id", "center").attr("opacity", 0).style("fill", "#66c2a5");

    var data = require('./data.json');
    
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

    const path2 = svg.selectAll("path")
        .data(pie(data[val][year]));

    // Update existing arcs
    path2.transition().duration(200).attrTween("d", arcTween);


    var tip2 = d3.tip().attr('class', 'd3-tip2').offset([0,0])
        .html(function(d,i) {
            var content = "<span style='margin-left: 2.5px;'><b>" + Math.round(d.data.count * 100) + "%" + "</b></span><br>";   
            return content;
        });

    svg.call(tip2);

    var str = "When did homicide cases happen in ";

    if (val == "arrested_percentage") {
        str = "How many percent of homicide commiters were arrested "
    }

    svg.append("text")
        .attr("x", 20)             
        .attr("y", -230)
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
        .style("font-family", "STFangsong")
        .style("font-weight", "bold")
        .text(str + year + " ?*");

    // Enter new arcs
    path2.enter().append("path")
        .attr("fill", (d, i) => color(i))
        .attr("d", arc)
        .attr("stroke", "white")
        .attr("stroke-width", "6px")
        .on("mouseover", function(d,i) {
            tip2.show(d,i,document.getElementById("center"));
            d3.select(this).transition().duration('50').attr('opacity', '0.6');
        })
        .on("mouseout", function(d,i) {
            tip2.hide(d,i);
            d3.select(this).transition().duration('50').attr('opacity', '1');
        })  
        .each(function(d) { this._current = d; });

    var app = document.getElementsByClassName("label1");
    var app2 = document.getElementsByClassName("label2");
    if (val == "time_percentage") {
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


document.getElementById("button").onclick = function() {goBack()};

function goBack() {
    var butt = document.getElementById("control");
    butt.style.display = "none";
    var r = document.getElementById("r");
    r.checked = true;

    var note = document.getElementById("note");
    note.style.display = "none";

    var ex1 = document.getElementById("explain1");
    ex1.style.display = "block";

    var ex2 = document.getElementById("explain2");
    ex2.style.display = "none";

    svg.selectAll("*").remove();
    svg.attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    svg.append("text")
        .attr("x", 350)             
        .attr("y", -30)
        .attr("text-anchor", "middle")  
        .style("font-size", "22px") 
        .style("font-family", "STFangsong")
        .style("font-weight", "bold")
        .text("Number of Homicide Cases over Years");

    // get the data
    //d3.csv('./crime_number.csv', type).then(data => {
    var csvFile = require('./crime_number.csv');
    d3.csv(csvFile).then(function(data) {
        // format the data
        data.forEach(function(d) {
            d.number = +d.number;
        });
        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.year; }));
        
        y.domain([0, 800]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.year); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(0); }) // always equal to 0
            .attr("y", function(d) { return y(0); })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)
            .on("click", function(d) {
                year = d.year;
                svg.selectAll("*").remove();                    
                update("time_percentage");  
                d3.select(".d3-tip").remove(); 
            });

        svg.selectAll("rect")
       .transition()
       .duration(800)
       .attr("y", function(d) { return y(d.number); })
       .attr("height", function(d) { return height - y(d.number); });


       // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .style("font-size", "12px");

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .style("font-size", "12px");

        svg.append("text")
            .attr("x", 300)
            .attr("y", 495)
            .text("Year");

        svg.append("text")
            .attr("x", -250)
            .attr("y", -50)
            .attr("transform", "rotate(-90)")
            .text("Total Cases");

    });

}

