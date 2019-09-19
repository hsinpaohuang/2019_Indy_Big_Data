var tip = d3.tip().attr('class', 'd3-tip e').html(function(d) { return '<strong>County: </strong> <span class="details">' + d.properties.NAME + '<br /></span> <strong>Percent bachelor\'s degree or higher:</strong><span class="details">' + d.properties.Percent + '%</span>'; });

var percent_data = [];
var data = d3.map();
var colorScheme = d3.schemeReds[5];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([0, 10, 30, 40, 50, 60])
	.range(colorScheme);
	
var xx,
	nest = {};

var width = 200,
	height = 300;

var svg = d3.select("#map-div")
            .append("svg")
			.attr("class", "map")
            .attr("width", width)
            .attr("height", height);

svg.call(tip);

d3.queue()
  .defer(d3.json,"indycounty.json")
  .defer(d3.csv, "percent/p_"+year+".csv", function(d){
	/*
	d.LaborForce = +d.LaborForce;
	d.LabWorkRatio = +d.LabWorkRatio;
	d.Workforce = +d.Workforce;
	*/
	percent_data.push(d);
	})//d3.csv
	.await(ready)
/*
d3.queue()
  .defer(d3.json,"indycounty.json")
  .defer(d3.csv,"in_out_2016.csv", function(d){
		d.LaborForce = +d.LaborForce;
		d.LabWorkRatio = +d.LabWorkRatio;
		d.Workforce = +d.Workforce;
	nest[d.description] = {name: d.description, labor: d.LaborForce, ratio: d.LabWorkRatio, work: d.Workforce};
	})//d3.csv
	.await(ready)
	*/
  function ready(error, countyMap)
  {
	console.log(percent_data);
	if (error) throw error;

	for(var i = 0; i < 92; i++)
	{
		county_name = countyMap.objects.indycounty.geometries[i].properties.NAME;
		for(var j = 0; j < 92; j++)
		{
			if(percent_data[j].County == county_name)
			{
				countyMap.objects.indycounty.geometries[i].properties.Percent = percent_data[j].Percent;
			}//if
		}//inner for
	}//outer for
	  
    var indyState = topojson.feature(countyMap, {
          type: "GeometryCollection",
          geometries: countyMap.objects.indycounty.geometries
      });//topojson.feature

    var projection = d3.geoMercator()
        .fitExtent([[0, 0], [width, height]], indyState);

    var geoPath = d3.geoPath()
                    .projection(projection);
  // Draw the map
var originalColor;

 svg.append("g")
     .attr("class", "countries")
     .selectAll("path")
     .data(indyState.features)
     .enter().append("path")
     .attr("stroke","black")
     .attr("fill", function (d){
		 	//console.log(d);
		 	/*
		 	d.data = nest[d.properties];
            d.total = data.get(d.properties.NAME) || 0;
	 		d.labor = data.get(d.properties.NAME);
			 d.data = nest[d.properties.NAME];
			 */
			return colorScale(d.properties.Percent);
        })//attr.fill
	  .attr("d", geoPath)
	  .on('mouseover', function(d){
		originalColor = d3.select(this).style("fill");
		d3.select(this)
			.style('fill', 'Turquoise');
		})//onmouseover
	  .on('click', function(d) {
	 	xx = -50;
	 	d3.selectAll("rect").remove();
	 	d3.selectAll("text").remove();
		tip.show(d);
		console.log(d);
		changeCounty(d.properties.NAME);
 		})//onclick
	  .on('mouseout', function(d){
	 		tip.hide();	
			d3.select(this).style('fill', originalColor);
	  	});//onmouseout
  }//ready
