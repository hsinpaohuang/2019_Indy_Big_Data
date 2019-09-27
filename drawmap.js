var tip;

var print;
var percent_data = [];
var data = d3.map();
var colorScheme = d3.schemeReds[6];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([10, 20, 30, 40, 50])
	.range(colorScheme);

var width = 250,
	height = 300;

var svg;
function INmap(year)
{
	tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return '<strong>County: </strong> <span class="details">' + d.properties.NAME + '<br /></span> <strong>Percent population with bachelor\'s degree or higher: </strong><span class="details">' + d.properties.Percent + '%</span>'; });
	d3.selectAll(".counties").selectAll("*").remove();
	svg = d3.select("#map-div")
            .append("svg")
	    .attr("class", "map")
            .attr("width", width)
	    .attr("height", height);
	svg.call(tip);
	tip.direction('e');

	percent_data = [];
	d3.queue()
	.defer(d3.json,"indycounty.json")
	.defer(d3.csv, "percent/p_"+year+".csv", function(d)
		{
			percent_data.push(d);
		})//d3.csv
		.await(ready);
}//INmap

function ready(error, countyMap)
{
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
		.attr("class", "counties")
		.selectAll("path")
		.data(indyState.features)
		.enter().append("path")
		.attr("stroke","black")
		.attr("fill", function (d){
				return colorScale(d.properties.Percent);
			})//attr.fill
		.attr("d", geoPath)
		.on('mouseover', function(d){
			originalColor = d3.select(this).style("fill");
			d3.select(this)
				.style('fill', 'Turquoise');
			})//onmouseover
		.on('click', function(d) {
			tip.show(d);
			changeCounty(d.properties.NAME);
			})//onclick
		.on('mouseout', function(d){
				tip.hide();	
				d3.select(this).style('fill', originalColor);
			});//onmouseout
  }//ready

INmap(2017);

//legend
d3.select('#viz')
	.append('div')
	.attr('class', 'legend')
	.append('h3')
	.text('Percent population with bachelor\'s degree or higher');

d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'zero')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[0])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'zerot')
	.text('0% ~ 9%');

d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'zero')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[1])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'zerot')
	.text('10% ~ 19%');

d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'fiveK')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[2])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'fivekt')
	.text('20% ~ 29%');

d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'tenK')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[3])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'tenkt')
	.text('30% ~ 39%');

d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'fifteenK')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[4])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'fifteenkt')
	.text('40% ~ 49%');

d3.select('div.legend')
	.append('svg')
	.attr('class', 'legend')
	.attr('id', 'twentyK')
	.attr('width', 15)
	.attr('height', 15)
	.append('circle')
	.attr('cx', 7.5)
	.attr('cy', 7.5)
	.attr('r', 5)
	.style('fill', colorScheme[5])
	.attr('stroke', 'black');

d3.select('div.legend')
	.append('p')
	.attr('class', 'legend')
	.attr('id', 'twentykt')
	.text('50%+');
