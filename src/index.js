Promise.all([
	d3.csv(require('./all.csv')),	
	d3.csv(require('./arson.csv')),	
    d3.csv(require('./assualt.csv')),
    d3.csv(require('./battery.csv')),   
    d3.csv(require('./burglary.csv')),    
    d3.csv(require('./conceal_carry_license_violation.csv')),   
    d3.csv(require('./crim_sexaul_assault.csv')),   
    d3.csv(require('./criminal_damage.csv')),   
    d3.csv(require('./ciminal_trespass.csv')),   
    d3.csv(require('/deceptive_practice.csv')),    
    d3.csv(require('./domestic_violence.csv')),   
    d3.csv(require('./gambling.csv')),   
    d3.csv(require('./homicide.csv')),   
    d3.csv(require('./human_trafficking.csv')),   
    d3.csv(require('./interference_with_public_officer.csv')),  
    d3.csv(require('./intimidation.csv')),  
    d3.csv(require('./kidnapping.csv')),  
    d3.csv(require('./liquor_law_violation.csv')),  
    d3.csv(require('./motor_vehicle_theft.csv')),  
    d3.csv(require('./narcotics.csv')),  
    d3.csv(require('./obscenity.csv')),  
    d3.csv(require('./offense_involving_children.csv')), 
    d3.csv(require('./other_narcotic_violation.csv')), 
    d3.csv(require('./other_offense.csv')),
    d3.csv(require('./prostitution.csv')),
    d3.csv(require('./public_indecency.csv')),
    d3.csv(require('./public_peace_violation.csv')),
    d3.csv(require('./ritualism.csv')),
    d3.csv(require('./robbery.csv')), 
    d3.csv(require('./sex_offense.csv')), 
    d3.csv(require('./stalking.csv')),   
    d3.csv(require('./theft.csv')), 
    d3.csv(require('./weapons_violation.csv')),
]).then(function(files) {
	mapData= {};
    mapData["all"] = files[0];
    mapData["arson"] = files[1];
    mapData["assualt"] = files[2];
    mapData["battery"] = files[3];
    mapData["burglary"] = files[4];
    mapData["conceal_carry_license_violation"] = files[5];
    mapData["crim_sexaul_assault"] = files[6];
    mapData["criminal_damage"] = files[7];
    mapData["ciminal_trespass"] = files[8];
    mapData["deceptive_practice"] = files[9];
    mapData["domestic_violence"] = files[10];
    mapData["gambling"] = files[11];
    mapData["homicide"] = files[12];
    mapData["human_trafficking"] = files[13];
    mapData["interference_with_public_officer"] = files[14];
    mapData["intimidation"] = files[15];
    mapData["kidnapping"] = files[16];
    mapData["liquor_law_violation"] = files[17];
    mapData["motor_vehicle_theft"] = files[18];
    mapData["narcotics"] = files[19];
    mapData["obscenity"] = files[20];
    mapData["offense_involving_children"] = files[21];
    mapData["other_narcotic_violation"] = files[22];
    mapData["other_offense"] = files[23];
    mapData["prostitution"] = files[24];
    mapData["public_indecency"] = files[25];
    mapData["public_peace_violation"] = files[26];
    mapData["ritualism"] = files[27];
    mapData["robbery"] = files[28];
    mapData["sex_offense"] = files[29];
    mapData["stalking"] = files[30];
    mapData["theft"] = files[31];
    mapData["weapons_violation"] = files[32];


    // set the dimensions and margins of the graph
var margin = {top: 80, right: 50, bottom: -30, left: 80},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var active = d3.select(null);
var isclick = false;
var clickpart = null;

var typename = "All Crime";
var year = 2001;
var dist1 = -1;
var maxN = 0;
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


var tip1 = d3.tip().attr('class', 'd3-tip1').offset([-5,0])
			.html(function(d, type1) {
				var typeName = type1;
			    if (typeName == "all") {
			      typeName = "All";
			    } else {
				    var words = typeName.split('_');
				    typeName = "";
				    for (var i = 0; i < words.length; i++) {
				      typeName += words[i].charAt(0).toUpperCase() + words[i].slice(1) + " ";
				    }
			    }
				var content = "<span style='margin-left: 2.5px;'>Type: " + typeName + "<br>Number: " + d.Number + "</span><br>";   
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

var type = "all";

var type_arr = ["all","arson","assualt","battery","burglary","conceal_carry_license_violation","crim_sexaul_assault",
"criminal_damage","ciminal_trespass","deceptive_practice","domestic_violence","gambling","homicide","human_trafficking",
"interference_with_public_officer","intimidation","kidnapping","liquor_law_violation","motor_vehicle_theft","narcotics",
"obscenity","offense_involving_children","other_narcotic_violation","other_offense","prostitution","public_indecency",
"public_peace_violation","ritualism","robbery","sex_offense","stalking","theft","weapons_violation"];


var svg4 = d3.select("#mapArea").append("svg")
           .attr("width", width4)
            .attr("height", height4)
            .attr("id", "map");
    svg4.call(tip2);
    svg4.append("text")
        .attr("x", 450)             
        .attr("y", 15)
        .attr("text-anchor", "middle")  
        .style("font-size", "20px") 
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
// dist_num to position map
var distPosMap = {};
var distPosElMap = {};

function findMax() {
	var max = 0
	for (var i = 2001; i < 2020; i++) {
		sum = sumSelected(i);
		max = Math.max(max, d3.max(sum, function(d) { return parseInt(d)}));
	}
	return max;
}

function findMin() {
	var min = Number.MAX_SAFE_INTEGER;
	for (var i = 2001; i < 2020; i++) {
		sum = sumSelected(i);
		min = Math.min(min, d3.min(sum, function(d) {
								 if (parseInt(d) == 0) {
               					 	return Number.MAX_SAFE_INTEGER;
            					 } else { 
			                       return parseInt(d);
			                     }}));
	}
	return min;
}

function drawMap(data, year) {
       		var minV = findMin();
            var maxV = findMax();

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
                	var dataState = data[i]["District"];
            		//Grab data value, and convert from string to float
            		var dataValue = parseInt(data[i]["value"]);

                	if (dataState == jsonState) {
                      // map position to dist_num
                      distPosMap[jsonState] = json.features[j];
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
              .attr("value", function(d) {
               distPosElMap[d.properties.dist_num] = this;
               return d.properties.dist_num;
              })
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

function getdata(dist1, type) {
  var curYear = sliderTime.value().getFullYear();
  var data = mapData[type];
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
        return datad;
        
}



// Line-Chart start here
var file_data = require('./line_data.json');

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

svg.call(tip1);

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
    updateBarMap(year);

    var x_pos = ((year - 2001) * 650)/18;

    d3.selectAll('.highlight').remove();
    if (document.getElementById("0").checked) {
    	highlightP('all',  x_pos);
    } else {
   		boxs = document.getElementsByName('check');
   		
    	for (var j =0; j < boxs.length; j++) {
			if (boxs[j].checked) {
				type = type_arr[parseInt(boxs[j].id)];	
				highlightP(type, x_pos);
				}
			}
		}
	}
);


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
  updateDistrct(dist1);
  var curYear = sliderTime.value().getFullYear();
  getNum(curYear);
  svg2.selectAll(".bar")
      .attr("fill", function(d) {
          	if (d.District == dist1) {
            	return "tomato";
          	} else {
            	return "steelblue";
          	}});

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

function updateDistrct(dist1) {
  var curYear = sliderTime.value().getFullYear();
  if (document.getElementById("0").checked) {
  	datad = getdata(dist1, 'all');
  	svg.selectAll("*").remove();
  	maxN = d3.max(datad, function(d) { return d.Number;});
  	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);
  	x.domain(d3.extent(datad, function(d) { return parseTime(d.Year); }));
  	y.domain([0, maxN]);
  	svg.append("g")
      			.attr("transform", "translate(0," + height + ")")
      			.call(d3.axisBottom(x).ticks(20))
      			.style("font-size", "12px");

  	// Add the Y Axis
  	svg.append("g")
    .call(d3.axisLeft(y))
    .transition(100)
    .style("font-size", "12px");
    drawLine(datad, type, 2001);
  } else {
  	boxs = document.getElementsByName('check');
	maxN = 0;
	var datad
	for (var i =0; i < boxs.length; i++) {
		if (boxs[i].checked) {
			type = type_arr[parseInt(boxs[i].id)];
			datad = getdata(dist1, type);
			maxN = Math.max(maxN, d3.max(datad, function(d) { return d.Number;}))
		}	
	}
	svg.selectAll("*").remove();
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);
	datad = getdata(dist1, 'all');
  	x.domain(d3.extent(datad, function(d) { return parseTime(d.Year); }));
  	y.domain([0, maxN]);
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
	for (var j =0; j < boxs.length; j++) {
		if (boxs[j].checked) {
			type = type_arr[parseInt(boxs[j].id)];
			datad = getdata(dist1, type);
			drawLine(datad, type, 2001);
		}
	}
  }
  
}

//zoom out
function reset() {
  var curYear = sliderTime.value().getFullYear();
  clickpart = null;
  active.classed("active", false);
  dist1 = -1;
  svg2.selectAll(".bar")
      .attr("fill", function(d) {
          	if (d.District == dist1) {
            	return "tomato";
          	} else {
            	return "steelblue";
          	}});  
  svg.selectAll("*").remove();
  getNum(curYear);
  isclick = false;
  
  if (document.getElementById("0").checked) {
  	updateLineAll();
  } else {
  	updateLineGraph()
  }
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

function highlightP(type, x_pos){
	var path = svg.select("#" + type);
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
	circle = svg.append("circle")
					.attr("cx", pos.x)
					.attr("cy", pos.y)
				   	 	.attr("r", 5)
					.attr("opacity", 0.9)
					.attr("fill", "gray")
					.attr("class", "highlight");

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
}
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
        timer = setInterval(step, 500);
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
    if (dist1 == -1) {
      var data = file_data[type];
      data.forEach(function(d) { 
        var y = d.Year;
        if (y == year) {
          d3.select('#year')
            .text("District: all" + " | Year: "+ year);
          return;
        }
      });
    } else {
      districtName = distName[dist1-1];
      var data = mapData[type];
        for (var i = 0; i < data.length; i++) {
                  var dataState = data[i].District;
                  if (dataState == dist1){
                    d3.select('#year')
                      .text("District: " + districtName + " | Year: "+ year);
                      return;  
                  }

        }
    }
}

function drawLine(data, type, year) {
  var curYear = sliderTime.value().getFullYear();
  var currType = type;
  // format the data
  data.forEach(function(d) {
      d.Year = parseTime(d.Year);
      d.Number = d.Number;
  });

  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([0, maxN]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("id", type)
      .attr("class", "line")
      .attr("d", valueline)
      .style("stroke-width", 2)
  
  var path = svg.select("#" + type);
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

    var className = type;
  	var circle = svg.append("circle")
        .attr("cx", pos.x)
        .attr("cy", pos.y)
        .attr("r", 4)
        .attr("fill", "steelblue")
        .style("opacity", "1")
        .attr("id", i)
        .attr("class", className);

     svg.selectAll("." + className)
      .on("mouseover", function(d) {         
          d3.select(this).attr("r", 5);
          d3.select(this).attr("fill", "gray");
          tip1.show(data[this.id - 2001], className);
          for (var i = 0; i < type_arr.length; i++) {
          	if (type_arr[i] != className) {
          		svg.selectAll("." + type_arr[i]).attr("opacity", 0.3);
          		svg.selectAll("#" + type_arr[i]).attr("opacity", 0.3);
          	}
          }
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("fill", "steelblue");
          d3.select(this).attr("r", 4);
          tip1.hide();
          svg.selectAll("*").attr("opacity", 1);
        })
        .on("click", function(d) {
          var newDate = new Date(this.id, 1,1);
          sliderTime.value(newDate);
        })
  }

  	var x_tmp = ((curYear - 2001) * 650)/18;
    highlightP(type, x_tmp);

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

 svg2.append("text")
            .attr("x", 150)
            .attr("y", 260)
            .text("Number of Cases")
            .style("font-size", "15px");

function drawBar(data, year) {

  svg2.selectAll("#title").remove();

  svg2.append("text")
        .attr('id', 'title')
        .attr("x", 150)             
        .attr("y", -15)
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .text("Top 5 Districts of Selected Crimes in Chicago " + year);

    data = data.sort(function(a, b) {
              return a["value"] - b["value"];
          }).reverse().slice(0, 5);
    data = data.sort(function(a, b) {
              return a["value"] - b["value"];
             });

    var xBar = d3.scaleLinear()
              .range([0, widthBar])
              .domain([0, d3.max(data, function(d) { 
                return parseInt(d["value"])})]);

    svg2.selectAll("#xAxis").remove();

    svg2.append("g")
      .attr('id', 'xAxis')
      .attr("transform", "translate(0," + heightBar + ")")
      .call(d3.axisBottom(xBar).ticks(3).tickFormat(d3.format("d")))
      .style("font-size", "12px");

    var yBar = d3.scaleBand()
            .rangeRound([heightBar, 0], .1)
            .domain(data.map(function (d) {
              return distName[d["District"]-1];
            }));

    var yAxis = d3.axisLeft()
            .scale(yBar)
            .tickSize(0);

    svg2.selectAll("#yAxis").remove();

    svg2.append("g")
      .attr('id', 'yAxis')
      .call(yAxis)
      .style("font-size", "15px");

    svg2.selectAll(".bar").remove();

    if (xBar.domain()[1] != 0) {
       svg2.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("width", function(d) { return xBar(d["value"])})
        .attr("y", function(d) {return yBar(distName[d["District"] - 1]); })
        .attr("height", yBar.bandwidth() - 7)
        .attr("fill", function(d) {
          if (d.District == dist1) {
            return "tomato";
          } else {
            return "steelblue";
          }})
        .on("click", function(d){
            if (isclick) {
              reset();
              isclick = false;
            }     
            var pos = distPosMap[d["District"]];
            var el = distPosElMap[d["District"]];
            isclick = true;
            clickpart = pos;
            g4.selectAll("path")
                .on("mouseover", tip2.show)
                .on("mouseout", tip2.hide);
            dist1 = parseInt(pos.properties.dist_num);
            if (active.node() === el) return reset();
            active.classed("active", false);
            active = d3.select(el).classed("active", true);
            updateDistrct(dist1);
            svg2.selectAll(".bar")
            	.attr("fill", function(d) {
          				if (d.District == dist1) {
            				return "tomato";
          				} else {
            				return "steelblue";
          			}});
            var bounds = path.bounds(pos),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = .75 / Math.max(dx / width4, dy / height4),
                translate = [width4 / 2 - scale * x, height4 / 2 - scale * y];
                svg4.selectAll("path").transition().duration('50').attr('opacity', '0.2');
                d3.select(el).transition().duration('50').attr('opacity', '1');
               
            g4.transition()
                .duration(750)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
              
        });

        svg2.selectAll(".text")     
        .data(data)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", 5)
        .attr("y", function(d) {return yBar(distName[d["District"]-1]) + 5;})
        .attr("dy", ".75em")
        .text(function(d) { return d["value"];})
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
}
// bar chart ends here

updateLineAll(2001);
sliderTime.value(new Date(2001,1,1));

document.getElementById("0").onclick = function() {
  checkboxes = document.getElementsByName('check');
  for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = this.checked;
  }
  update();
}



checkboxes = document.getElementsByName('check');
for (var i = 0; i < checkboxes.length; i++){
	checkboxes[i].onclick = function() {
		var data1 = [];
		file_data[type];
		document.getElementById("0").checked = true;
		checks = document.getElementsByName('check');
		for (var j =0; j < checks.length; j++) {
			if (!checks[j].checked) {
				document.getElementById("0").checked = false;	
				break;
			}
		}
		update();
		
	}
}

function update() {
	if (document.getElementById("0").checked) {
		if (!isclick) {
			updateLineAll();
			updateBarMap(2001);
			sliderTime.value(new Date(2001,1,1));
		} else {
			updateBarMap(year);
			updateDistrct(dist1);
		}
	} else {
		if (!isclick) {
			updateLineGraph();
			updateBarMap(2001);
			sliderTime.value(new Date(2001,1,1));
		} else {
			updateBarMap(year);
			updateDistrct(dist1);
		}
	}			
}

function updateLineAll() {
	svg.selectAll("*").remove();
	maxN = d3.max(file_data['all'], function(d) { return d.Number; });
	x.domain(d3.extent(file_data['all'], function(d) { return parseTime(d.Year); }));
  	y.domain([0, maxN]);

  	// X Axis
  	svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("id", "xAxis")
      .call(d3.axisBottom(x).ticks(20))
      .style("font-size", "12px");

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("id", "yAxis")
      .transition(100)
      .style("font-size", "12px");

	drawLine(file_data['all'], 'all', year);


}

function updateLineGraph() {
	boxs = document.getElementsByName('check');
	maxN = 0;
	for (var i =0; i < boxs.length; i++) {
		if (boxs[i].checked) {
			type = type_arr[parseInt(boxs[i].id)];
			maxN = Math.max(maxN, d3.max(file_data[type], function(d) { return d.Number;}))
		}	
	}
	svg.selectAll("*").remove();
  	x.domain(d3.extent(file_data['all'], function(d) { return parseTime(d.Year); }));
  	y.domain([0, maxN]);
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
	for (var j =0; j < boxs.length; j++) {
		if (boxs[j].checked) {
			type = type_arr[parseInt(boxs[j].id)];
			drawLine(file_data[type], type, 2001);
		}
	}
}

function sumSelected(year) {
	sum=[];
	for (var i = 0; i <32; i++){
		sum[i] = 0;
	}
	for (var j =0; j < boxs.length; j++) {
		if (boxs[j].checked) {
			type = type_arr[parseInt(boxs[j].id)];
			var data = mapData[type];
  			for (var i = 0; i < data.length; i++) {
                var dataState = parseInt(data[i].District);
            	//Grab data value, and convert from string to float
            	if (data[i][year]) {
            		sum[dataState] = parseInt(data[i][year]) + sum[dataState];	
            	}
            }
		}
	}
	return sum;
}

function updateBarMap (year) {
	typename = "selected crime";
	boxs = document.getElementsByName('check');
	var sum = sumSelected(year);
	sumData = [];
	for (var i = 0; i < 32; i++) {
		var part = [];
		part["District"] = i;
		part["value"] = sum[i]
		sumData.push(part);
	}
	drawBar(sumData, year);
	drawMap(sumData, year);
}
}).catch(function(err) {
    // handle error here
})


//Bind data and create one path per GeoJSON feature
/*svg4.selectAll("path")
  .data(json.features)
  .enter()
  .append("path")
  .attr("d", path)
  .attr("class", "zipcode");*/



