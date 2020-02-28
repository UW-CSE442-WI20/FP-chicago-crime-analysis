// set the dimensions and margins of the graph
var margin = {top: 80, right: 50, bottom: -30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var active = d3.select(null);
var isclick = false;
var clickpart = null;

var year = 2010;
var dist1 = -1;
var format = d3.timeFormat("%Y");

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



//Bind data and create one path per GeoJSON feature
/*svg4.selectAll("path")
  .data(json.features)
  .enter()
  .append("path")
  .attr("d", path)
  .attr("class", "zipcode");*/

var distName = ["Central","Wentworth","Grand Crossing","South Chicago","Calumet","Gresham","Englewood",
"Chicago Lawn","Deering","Ogden","Harrison","Near West","Dist 13","Shakespeare","Austin","Jefferson Park","Albany Park",
"Near North","Town Hall","Lincoln","Dist 21","Morgan Park","Dist 23","Rogers Park","Grand Central"];

var tip2 = d3.tip().attr('class', 'd3-tip2').offset([0,0])
         .html(function(d) {
          dist = parseInt(d.properties.dist_num);
          if (dist != 31) {
            name = distName[dist-1];
          } else {
            name = "Norridge and Harwood Heights";
          }
         	if (d.properties.value == null) {
         		num = 0; 
         	} else {
         		num = d.properties.value
         	}
            var content = "<span style='margin-left: 2.5px;'>District: " + name + "<br>Case Count: " + num + "</span><br>";   
             return content;
         });

color5 = ["rgb(215,224,232)","rgb(175,194,210)", "rgb(135,164,188)","rgb(95,134,166)", "rgb(56,104,144)"];
function color4(legend_data, maxV, minV, difference, x) {
            for (var i = 1; i < legend_data.length; i++) {
              var min = Math.floor(legend_data[i]);
              if (i > 1) {
                min++;
              }
              var max = Math.floor(legend_data[i] + difference);
              if (maxV - minV >= 5) {
                if (x >= min && x <= max) {
                  return color5[i - 1];
                }
              } else {
                if (x == minV && x != maxV) {
                        return color5[0];
                      }
                      if (x == minV + 1 && maxV - minV == 2) {
                        return color5[2];
                      }
                      var n = 3 - maxV + minV + x;
                    return color5[n];
              }

            }
}

var mapData = {};
mapData["all"] = require('./all.csv');
mapData["arson"] = require('./arson.csv');
mapData["assualt"] = require('./assualt.csv');
mapData["battery"] = require('./battery.csv');
mapData["burglary"] = require('./burglary.csv');
mapData["conceal_carry_license_violation"] = require('./conceal_carry_license_violation.csv');
mapData["crim_sexaul_assault"] = require('./crim_sexaul_assault.csv');
mapData["criminal_damage"] = require('./criminal_damage.csv');
mapData["ciminal_trespass"] = require('./ciminal_trespass.csv');
mapData["deceptive_practice"] = require('/deceptive_practice.csv');
mapData["domestic_violence"] = require('./domestic_violence.csv');
mapData["gambling"] = require('./gambling.csv');
mapData["homicide"] = require('./homicide.csv');
mapData["human_trafficking"] = require('./human_trafficking.csv');
mapData["interference_with_public_officer"] = require('./interference_with_public_officer.csv');
mapData["intimidation"] = require('./intimidation.csv');
mapData["kidnapping"] = require('./kidnapping.csv');
mapData["liquor_law_violation"] = require('./liquor_law_violation.csv');
mapData["motor_vehicle_theft"] = require('./motor_vehicle_theft.csv');
mapData["narcotics"] = require('./narcotics.csv');
mapData["obscenity"] = require('./obscenity.csv');
mapData["offense_involving_children"] = require('./offense_involving_children.csv');
mapData["other_narcotic_violation"] = require('./other_narcotic_violation.csv');
mapData["other_offense"] = require('./other_offense.csv');
mapData["prostitution"] = require('./prostitution.csv');
mapData["public_indecency"] = require('./public_indecency.csv');
mapData["public_peace_violation"] = require('./public_peace_violation.csv');
mapData["ritualism"] = require('./ritualism.csv');
mapData["robbery"] = require('./robbery.csv');
mapData["sex_offense"] = require('./sex_offense.csv');
mapData["stalking"] = require('./stalking.csv');
mapData["theft"] = require('./theft.csv');
mapData["weapons_violation"] = require('./weapons_violation.csv');

var svg4 = d3.select("#mapArea").append("svg")
           .attr("width", width4)
            .attr("height", height4)
            .attr("id", "map");
    svg4.call(tip2);
    svg4.append("text")
        .attr("x", 480)             
        .attr("y", 18)
        .attr("text-anchor", "middle")  
        .style("font-size", "22px") 
        .style("font-family", "STFangsong")
        .style("font-weight", "bold")
        .text("Chicago Map");
var g4 = svg4.append("g")
    .style("stroke-width", "1.5px");
g4.selectAll("path")
            	.data(json.features)
            	.enter()
            	.append("path")
            	.attr("d", path)
            	.attr("class", "zipcode")

function drawMap(type, year) {
	var csvFile4 = mapData[type];
    	d3.csv(csvFile4).then(function(data) {
       		var minV = d3.min(data, function(d) { 
            if (parseInt(d[year]) == 0) {
                return Number.MAX_SAFE_INTEGER;
              } 
              return parseInt(d[year]);
              });
          var maxV = d3.max(data, function(d) { return parseInt(d[year]); });

          var legend_data = [];
          var difference;

          legend_data.push(-1);
          if (maxV - minV >= 5) {
            for (var i = 0; i < 5; i++) {
              difference = (maxV - minV) / 5.0; 
                var tmp = parseInt(minV) + (difference * i);
                legend_data.push(tmp);
            }
          } else {
            for (var i = 0; i < (maxV - minV) + 1; i++) {
                var tmp = parseInt(minV) + i;
                legend_data.push(tmp);
            }
            difference = 0;
  
          }
       
        	//Merge the ag. data and GeoJSON
        	//Loop through once for each ag. data value
        	for (var j = 0; j < 25; j++) {
            	//Grab state name
            	
                
            	var jsonState = json.features[j].properties.dist_num;
            	var flag = false;
            	//Find the corresponding state inside the GeoJSON
            	for (var i = 0; i < data.length; i++) {
                	var dataState = data[i].District;

            		//Grab data value, and convert from string to float
            		var dataValue = parseInt(data[i][year]);

                	if (dataState == jsonState) {

                   		//Copy the data value into the JSON
                    	json.features[j].properties.value = dataValue;
                    	flag = true;
                    	break;
                	}
            	}

            	if (flag == false) {
            		json.features[j].properties.value = 0;	
            	}
        	}
        	//Bind data and create one path per GeoJSON feature
        	g4.selectAll("path")
            .on("click", clicked)
              .on("mouseover", over)
              .on("mouseout", out)  
              .attr("value", function(d) {return d.properties.dist_num;})
              .style("fill", function(d) {
                //Get data value
                  var value = d.properties.value;


                  if (value > 0) {
                    //If value exists…
                      //return color4(value);
                      return color4(legend_data, maxV, minV, difference, value);
                  } else {
                    //If value is undefined…
                      return "#ccc";
                  }
              });

              if (isclick) {
                g4.selectAll("path")
              .on("mouseover", tip2.show)
              .on("mouseout", tip2.hide);
              } 


        	//create legend
        	//create legend
        	d3.select('#legendId').select("svg").remove();
          var svgLegend = d3.select('#legendId')
                          .append("svg")
                          .attr("id", "legend")
                          .attr("width", 130)
                          .attr("height", 200);

          

          var legend_box_size = 13;
          svgLegend.selectAll("legendSquares")
                  .data(legend_data)
                  .enter()
                  .append("rect")
                  .attr("x", 3)
                  .attr("y", function(d, i) { return 10 + i*(legend_box_size+8)})
                  .attr("width", legend_box_size)
                  .attr("height", legend_box_size)
                  .style("fill", function(d, i) {
                  if  (maxV - minV >= 5) {
                      if (d == -1) {
                        return "#ccc";
                      }
                      return color5[i - 1];
                    //return color4(Math.log(d + (-15+4*i)*difference))
                  } else {
                    if (d == -1) {
                        return "#ccc";
                      }
                      if (d == minV && d != maxV) {
                        return color5[0];
                      }
                      if (d == minV + 1 && maxV - minV == 2) {
                        return color5[2];
                      }
                      var n = 3 - maxV + minV + i;
                    return color5[n];
                  }
                  }); 

          svgLegend.selectAll("legendLabels")
                  .data(legend_data)
                  .enter()
                  .append("text")
                  .attr("x", 3 + legend_box_size * 1.2)
                  .attr("y", function(d, i) { return 10 + i*(legend_box_size+8) + 8})
                  .text(function(d) {
                  	// console.log(difference);
                    if (d == -1) {
                        return 0;
                    }
                    if (difference == 0) {
                    	return Math.floor(d);
                    }
                    if (d == minV  || maxV - minV < 5) {
                        return (Math.floor(d) + " - " + Math.floor(d + difference));  
                    }
                    return (Math.floor(d + 1) + " - " + Math.floor(d + difference));
                  })
                  .attr("text-anchor", "left")
                  .style("alignment-baseline", "middle");
      });
 }

 function over(d) {
    tip2.show(d);
    svg4.selectAll("path").transition().duration('50').attr('opacity', '0.2');
    d3.select(this).transition().duration('50').attr('opacity', '1');
}

function out(d) {
    tip2.hide(d);
    svg4.selectAll("path").transition().duration('50').attr('opacity', '1');
}

function getdata(dist1) {
  var csvFile5 = mapData[type];
      d3.csv(csvFile5).then(function(data) {
        var datad = [];
        f1 = false;
        for (var i = 0; i < data.length; i++) {
                  var dataState = data[i].District;
                  if (dataState == dist1) {
                    for (var j = 2001; j < 2020; j++) {
                    var dataValue = parseInt(data[i][j]);
                    var part = {}
                    part["Year"] = j
                    part["Number"] = dataValue;
                    datad.push(part);
                  }
                  f1 = true;
                  break;
                }
            }
            if (!f1) {
              for (var j = 2001; j < 2020; j++) {
                var part = {}
                part["Year"] = j
                part["Number"] = 0  
                datad.push(part);
              } 
            }
            getNum(year);
        svg.selectAll("*").remove();
        drawLine(datad, type, 2001);
        sliderTime.value(new Date(2001,1,1));
        });
        
}


// zoom in
function clicked(d) {
  isclick = true;
  clickpart = d;
  g4.selectAll("path")
      .on("mouseover", tip2.show)
      .on("mouseout", tip2.hide);
  dist1 = parseInt(d.properties.dist_num);
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);
  getdata(dist1);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .75 / Math.max(dx / width4, dy / height4),
      translate = [width4 / 2 - scale * x, height4 / 2 - scale * y];
      svg4.selectAll("path").transition().duration('50').attr('opacity', '0.2');
      d3.select(this).transition().duration('50').attr('opacity', '1');
     

  g4.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

//zoom out
function reset() {
  clickpart = null;
  active.classed("active", false);
  dist1 = -1;
  svg.selectAll("*").remove();
  getNum(year);
  isclick = false;
  drawLine(file_data[type], type, 2001);
  sliderTime.value(new Date(2001,1,1));
  active = d3.select(null);
  svg4.selectAll("path").transition().duration('50').attr('opacity', '1');
  g4.selectAll("path")
    .on("mouseover", over)
    .on("mouseout", out) 
  g4.transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "");
}



// Line-Chart start here

var file_data = require('./line_data.json');

var type = "all";

var type_arr = ["all","arson","assualt","battery","burglary","conceal_carry_license_violation","crim_sexaul_assault",
"criminal_damage","ciminal_trespass","deceptive_practice","domestic_violence","gambling","homicide","human_trafficking",
"interference_with_public_officer","intimidation","kidnapping","liquor_law_violation","motor_vehicle_theft","narcotics",
"obscenity","offense_involving_children","other_narcotic_violation","other_offense","prostitution","public_indecency",
"public_peace_violation","ritualism","robbery","sex_offense","stalking","theft","weapons_violation"];

var margin = {top: 30, right: 50, bottom: 50, left: 100},
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y");

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Number); });


// slider start here
var current = new Date(2001, 1, 1);
var target = new Date(2019, 1, 1);
var playButton = document.getElementById("button1");
var resetButton = document.getElementById("button2");

var dataTime = d3.range(0, 19).map(function(d) {
    return new Date(2001 + d, 1, 1);
});
var sliderTime = d3
.sliderBottom()
.min(d3.min(dataTime))
.max(d3.max(dataTime))
.step(1000 * 60 * 60 * 24 * 365)
.width(650)
.tickFormat(d3.timeFormat('%Y'))
.tickValues(dataTime)
.default(new Date(2001, 1, 1))
.on('onchange', val => {
    svg.selectAll("line").remove();
    svg.select("#highlight").remove();
    var year = format(val);

    getNum(year);
    drawMap(type, year);
    drawBar(type, year);

    var x_pos = ((year - 2001) * 650)/18;

    svg.append("line")
    .attr("x1", x_pos)  //<<== change your code here
    .attr("y1", 0)
    .attr("x2", x_pos)  //<<== and here
    .attr("y2", height)
    .attr("class", "h")
    .style("stroke-width", 2)
    .style("stroke", "gray")
    .style("stroke-dasharray", ("5, 5"))
    .style("opacity", "0.7")
    .style("fill", "none");

    var path = svg.select("path");
    var pathEl = path.node();
    var pos = pathEl.getPointAtLength(x_pos);

    var beginning = x_pos, end = 1200;

    while (true) {
      target = Math.floor((beginning + end) / 2);
      pos = pathEl.getPointAtLength(target);
      if ((target === end || target === beginning) && pos.x !== x) {
          break;
      }
      if (pos.x > x_pos)      end = target;
      else if (pos.x < x_pos) beginning = target;
      else                break; //position found
    }
    var circle = svg.append("circle")
        .attr("cx", pos.x)
        .attr("cy", pos.y)
        .attr("r", 7)
        .attr("opacity", 0.9)
        .attr("fill", "gray")
        .attr("id", "highlight");

    svg.append("line")
    .attr("x1", 0)  //<<== change your code here
    .attr("y1", pos.y)
    .attr("x2", width)  //<<== and here
    .attr("y2", pos.y)
    .attr("class", "v")
    .style("stroke-width", 2)
    .style("stroke-dasharray", ("5, 5"))
    .style("stroke", "grey")
    .style("opacity", "0.5")
    .style("fill", "none");


});

var gTime = d3
    .select('#slider')
    .append('svg')
    .attr('width', 800)
    .attr('height', 80)
    .append('g')
    .attr('transform', 'translate(100,30)');

gTime.call(sliderTime);
// slider ends here

// play starts here
playButton.onclick =  function() {
    var button = d3.select(this);
    if (button.text() == "Pause") {
        clearInterval(timer);
        button.text("Play");
    } else {
        timer = setInterval(step, 1200);
        button.text("Pause");
    }
}

 function step(){
      current = sliderTime.value().setFullYear(sliderTime.value().getFullYear() + 1);
      sliderTime.value(current);
      if (current >= new Date(2018,3,10).getTime()) {
        playButton.click();
      }
  }

  resetButton.onclick =  function() {
    sliderTime.value(new Date(2001,1,1));
    if (playButton.textContent == "Pause") {
        playButton.click();
    }
    current = new Date(2001,1,1);
  }
// play ends here

function getNum(year) {
    var data = file_data[type];
    data.forEach(function(d) {
      var y = d.Year;
      var districtName;
      if (dist1 == -1) {
        districtName = "all";
      } else {
        districtName = distName[dist1-1];
      }
      if (y == year) {
        d3.select('#year')
        .text("Type: " + type + " | District: " + districtName + " | Year: "+ year + " | Number of Cases: " + d.Number);
        return;
      }
    }); 
}

function drawLine(data, type, year) {
  
  // format the data
  data.forEach(function(d) {
      d.Year = parseTime(d.Year);
      d.Number = d.Number;
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.Number; })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke-width", 2);
  
  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(20))
      .style("font-size", "12px");

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
      .transition(100)
      .style("font-size", "12px");

  var path = svg.select("path");
  var pathEl = path.node();
  for (var i = 2001; i < 2020; i++) {
  	var x_pos = ((i - 2001) * 650)/18;
  	var pos = pathEl.getPointAtLength(x_pos);
  	var beginning = x_pos, end = 1200;
  	while (true) {
      target = Math.floor((beginning + end) / 2);
      pos = pathEl.getPointAtLength(target);
      if ((target === end || target === beginning) && pos.x !== x) {
          break;
      }
      if (pos.x > x_pos)      end = target;
      else if (pos.x < x_pos) beginning = target;
      else                break; //position found
    }
  	var circle = svg.append("circle")
        .attr("cx", pos.x)
        .attr("cy", pos.y)
        .attr("r", 5)
        .attr("fill", "steelblue")
        .style("opacity", "1")
        .attr("id", "dot" + i);
  }

   svg.append("text")
            .attr("x", 320)
            .attr("y", 260)
            .text("Year")
            .style("font-size", "15px");

    svg.append("text")
        .attr("x", -125)
        .attr("y", -65)
        .attr("transform", "rotate(-90)")
        .text("Total Cases")
        .style("font-size", "15px");
        
    data.forEach(function(d) {
      d.Year = format(d.Year);
      d.Number = d.Number;
  });
}
// Line chart ends here

//Bar chart start here
var marginBar = {top: 30, right: 50, bottom: 50, left: 110},
    widthBar = 550 - marginBar.left - marginBar.right,
    heightBar = 300 - marginBar.top - marginBar.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#barChart")
    .append("svg")
    .attr("width", widthBar + marginBar.left + marginBar.right)
    .attr("height", heightBar + marginBar.bottom + marginBar.top)
    .append("g")
    .attr("transform",
          "translate(" + marginBar.left + "," + marginBar.top + ")");

function drawBar(type, year) {
  svg2.selectAll("*").remove();

  var typeName = type;
  if (typeName == "all") {
    typeName = "All Crime";
  } else {
    var words = typeName.split('_');
    typeName = "";
    for (var i = 0; i < words.length; i++) {
      typeName += words[i].charAt(0).toUpperCase() + words[i].slice(1) + " ";
    }
  }

  svg2.append("text")
        .attr("x", 150)             
        .attr("y", -15)
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .text("Top 5 Districts of " + typeName + " in Chicago " + year);

  var csvFile4 = mapData[type];
  d3.csv(csvFile4).then(function(data) {

    data = data.sort(function(a, b) {
              return d3.descending(+a[year], +b[year]);
          }).slice(0, 5);

    data = data.sort(function(a, b) {
              return d3.ascending(+a[year], +b[year])});

    var xBar = d3.scaleLinear()
              .range([0, widthBar])
              .domain([0, d3.max(data, function(d) { 
                return parseInt(d[year]); })]);

    svg2.append("g")
      .attr("transform", "translate(0," + heightBar + ")")
      .call(d3.axisBottom(xBar).ticks(3).tickFormat(d3.format("d")))
      .style("font-size", "12px");

    svg2.append("text")
            .attr("x", 150)
            .attr("y", 260)
            .text("Number of Cases")
            .style("font-size", "15px");

    var yBar = d3.scaleBand()
            .rangeRound([heightBar, 0], .1)
            .domain(data.map(function (d) {
              return distName[d.District-1];
            }));

    var yAxis = d3.axisLeft()
            .scale(yBar)
            .tickSize(0);

    svg2.append("g")
      .call(yAxis)
      .style("font-size", "15px");

    if (xBar.domain()[1] != 0) {

       svg2.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("width", function(d) { return xBar(d[year])})
        .attr("y", function(d) {return yBar(distName[d.District-1]); })
        .attr("height", yBar.bandwidth() - 7)
        .attr("fill", function(d) {
          console.log(d.District);
          console.log("clicked: " + dist1);
          if (d.District == dist1) {
            return "tomato";
          } else {
            return "steelblue";
          }});

        svg2.selectAll(".text")     
        .data(data)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", 5)
        .attr("y", function(d) {return yBar(distName[d.District-1]) + 5;})
        .attr("dy", ".75em")
        .text(function(d) { return d[year];})
        .attr("fill", "white");
    }  else {
         svg2.selectAll(".text")     
        .data(data)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", 5)
        .attr("y", function(d) {return yBar(distName[d.District-1]) + 5;})
        .attr("dy", ".75em")
        .text(function(d) { return 0;})
        .attr("fill", "black");
    }  
  });
}
// bar chart ends here

function update(type) {
  if (!isclick) {
    svg.selectAll("*").remove();
    drawLine(file_data[type], type, 2001);
    sliderTime.value(new Date(2001,1,1));
    drawMap(type, 2001);
  } else {
    getdata(dist1);
    drawMap(type, 2001);
    drawBar(type, 2001);
  }
}

document.getElementById("inds").onchange = function(d) {
    // recover the option that has been chosen
    type = type_arr[parseInt(d3.select(this).property("value"))];
    // run the updateChart function with this selected option
    update(type);
}

update("all");


// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

// var tip = d3.tip().attr('class', 'd3-tip').direction('n').offset([-5, 0])
//     .html(function(d) {
//         var content = "<span style='margin-left: 2.5px;'><b>" + d.number + "</b></span><br>";
//         return content;
//     });

// goBack();

// const radius = Math.min(width,height) / 2;

// const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
//     "#e78ac3","#a6d854","#ffd92f"]);

// const pie = d3.pie()
//     .value(d => d.count)
//     .sort(null);

// const arc = d3.arc()
//     .innerRadius(100)
//     .outerRadius(radius);

// function type(d) {
//     d.time_percentage = Number(d.time_percentage);
//     d.arrested_percentage = Number(d.arrested_percentage);
//     return d;
// }

// function arcTween(a) {
//     const i = d3.interpolate(this._current, a);
//     this._current = i(1);
//     return (t) => arc(i(t));
// }

// function update(val = this.value) {

//     svg.selectAll("text").remove();

//     var butt = document.getElementById("control");
//     butt.style.display = "block";

//     var note = document.getElementById("note");
//     note.style.display = "block";

//     var ex1 = document.getElementById("explain1");
//     ex1.style.display = "none";

//     var ex2 = document.getElementById("explain2");
//     ex2.style.display = "block";

//     svg.attr("transform", `translate(${300}, ${height - 120})`);

//     svg.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 1).attr("id", "center").attr("opacity", 0).style("fill", "#66c2a5");

//     var data = require('./data.json');
    
//     d3.selectAll("input")
//         .on("change", update);

//     svg.append("circle").attr("cx", 300).attr("cy", 0).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#66c2a5");
//     svg.append("circle").attr("cx", 300).attr("cy", 30).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#fc8d62");
//     svg.append("circle").attr("cx", 300).attr("cy", 60).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#8da0cb");
//     svg.append("circle").attr("cx", 300).attr("cy", 90).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#e78ac3");
//     svg.append("circle").attr("cx", 300).attr("cy", 120).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#a6d854");
//     svg.append("circle").attr("cx", 300).attr("cy", 150).attr("r", 6).attr("class", "label1").attr("opacity", 0).style("fill", "#ffd92f");
//     svg.append("text").attr("x", 320).attr("y", 0).text("0:00-4:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
//     svg.append("text").attr("x", 320).attr("y", 30).text("4:00-8:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
//     svg.append("text").attr("x", 320).attr("y", 60).text("8:00-12:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
//     svg.append("text").attr("x", 320).attr("y", 90).text("12:00-16:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
//     svg.append("text").attr("x", 320).attr("y", 120).text("16:00-20:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");
//     svg.append("text").attr("x", 320).attr("y", 150).text("20:00-0:00").attr("class", "label1").attr("opacity", 0).style("font-size", "15px").attr("alignment-baseline", "middle");

//     svg.append("circle").attr("cx", 300).attr("cy", 0).attr("r", 6).attr("opacity", 0).attr("class", "label2").style("fill", "#66c2a5");
//     svg.append("circle").attr("cx", 300).attr("cy", 30).attr("r", 6).attr("opacity", 0).attr("class", "label2").style("fill", "#fc8d62");
//     svg.append("text").attr("x", 320).attr("y", 0).text("arrested").attr("opacity", 0).attr("class", "label2").style("font-size", "15px").attr("alignment-baseline", "middle");
//     svg.append("text").attr("x", 320).attr("y", 30).text("not arrested").attr("opacity", 0).attr("class", "label2").style("font-size", "15px").attr("alignment-baseline", "middle");

//     const path2 = svg.selectAll("path")
//         .data(pie(data[val][year]));

//     // Update existing arcs
//     path2.transition().duration(200).attrTween("d", arcTween);


//     var tip2 = d3.tip().attr('class', 'd3-tip2').offset([0,0])
//         .html(function(d,i) {
//             var content = "<span style='margin-left: 2.5px;'><b>" + Math.round(d.data.count * 100) + "%" + "</b></span><br>";   
//             return content;
//         });

//     svg.call(tip2);

//     var str = "When did homicide cases happen in ";

//     if (val == "arrested_percentage") {
//         str = "How many percent of homicide commiters were arrested "
//     }

//     svg.append("text")
//         .attr("x", 20)             
//         .attr("y", -230)
//         .attr("text-anchor", "middle")  
//         .style("font-size", "20px") 
//         .style("font-family", "STFangsong")
//         .style("font-weight", "bold")
//         .text(str + year + " ?*");

//     // Enter new arcs
//     path2.enter().append("path")
//         .attr("fill", (d, i) => color(i))
//         .attr("d", arc)
//         .attr("stroke", "white")
//         .attr("stroke-width", "6px")
//         .on("mouseover", function(d,i) {
//             tip2.show(d,i,document.getElementById("center"));
//             d3.select(this).transition().duration('50').attr('opacity', '0.6');
//         })
//         .on("mouseout", function(d,i) {
//             tip2.hide(d,i);
//             d3.select(this).transition().duration('50').attr('opacity', '1');
//         })  
//         .each(function(d) { this._current = d; });

//     var app = document.getElementsByClassName("label1");
//     var app2 = document.getElementsByClassName("label2");
//     if (val == "time_percentage") {
//         for (var i = 0; i < app2.length; i++) {
//             app2[i].style.opacity = 0;
//         }
//         for (var k = 0; k < app.length; k++) {
//             app[k].style.opacity = 1;
//         }
//     } else {
//         for (var l = 0; l < app.length; l++) {
//             app[l].style.opacity = 0;
//         }
//         for (var j = 0; j < app2.length; j++) {
//             app2[j].style.opacity = 1;
//         }

//     }
// }


// document.getElementById("button").onclick = function() {goBack()};

// function goBack() {
//     var butt = document.getElementById("control");
//     butt.style.display = "none";
//     var r = document.getElementById("r");
//     r.checked = true;

//     var note = document.getElementById("note");
//     note.style.display = "none";

//     var ex1 = document.getElementById("explain1");
//     ex1.style.display = "block";

//     var ex2 = document.getElementById("explain2");
//     ex2.style.display = "none";

//     svg.selectAll("*").remove();
//     svg.attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

//     svg.call(tip);

//     svg.append("text")
//         .attr("x", 350)             
//         .attr("y", -30)
//         .attr("text-anchor", "middle")  
//         .style("font-size", "22px") 
//         .style("font-family", "STFangsong")
//         .style("font-weight", "bold")
//         .text("Number of Homicide Cases over Years");

//     // get the data
//     //d3.csv('./crime_number.csv', type).then(data => {
//     var csvFile = require('./crime_number.csv');
//     d3.csv(csvFile).then(function(data) {
//         // format the data
//         data.forEach(function(d) {
//             d.number = +d.number;
//         });
//         // Scale the range of the data in the domains
//         x.domain(data.map(function(d) { return d.year; }));
        
//         y.domain([0, 800]);

//         // append the rectangles for the bar chart
//         svg.selectAll(".bar")
//             .data(data)
//             .enter().append("rect")
//             .attr("class", "bar")
//             .attr("x", function(d) { return x(d.year); })
//             .attr("width", x.bandwidth())
//             .attr("height", function(d) { return height - y(0); }) // always equal to 0
//             .attr("y", function(d) { return y(0); })
//             .on("mouseover", tip.show)
//             .on("mouseout", tip.hide)
//             .on("click", function(d) {
//                 year = d.year;
//                 svg.selectAll("*").remove();                    
//                 update("time_percentage");  
//                 d3.select(".d3-tip").remove(); 
//             });

//         svg.selectAll("rect")
//        .transition()
//        .duration(800)
//        .attr("y", function(d) { return y(d.number); })
//        .attr("height", function(d) { return height - y(d.number); });


//        // add the y Axis
//         svg.append("g")
//             .call(d3.axisLeft(y))
//             .style("font-size", "12px");

//         // add the x Axis
//         svg.append("g")
//             .attr("transform", "translate(0," + height + ")")
//             .call(d3.axisBottom(x))
//             .style("font-size", "12px");

//         svg.append("text")
//             .attr("x", 300)
//             .attr("y", 495)
//             .text("Year");

//         svg.append("text")
//             .attr("x", -250)
//             .attr("y", -50)
//             .attr("transform", "rotate(-90)")
//             .text("Total Cases");

//     });

// }

