var year = "2017",
    county = "US";

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

var result = new Array(5);

function Int(str)
{
  // takes a string of number with commas, and returns integer
  return parseInt(str.replace(/,/g, ""), 10);
} //Int

function parse(d)
{
  var mu, ma, fm, fa; // male under, male above, female under, female above
  var row = 15; // row number of 25-34

  // ages 18-24 (rows 2-5)
  mu = (Int(d[1]['Male Estimate']) + Int(d[2]['Male Estimate'])) * -1;
  ma = (Int(d[3]['Male Estimate']) + Int(d[4]['Male Estimate'])) * -1;
  fu = Int(d[1]['Female Estimate']) + Int(d[2]['Female Estimate']);
  fa = Int(d[3]['Female Estimate']) + Int(d[4]['Female Estimate']);
  result[0] = [mu, ma, fu, fa];

  // ages 25+
  for (var i = 1; i < 5; i++)
  {
    mu = (Int(d[row]['Male Estimate']) - Int(d[row+2]['Male Estimate'])) * -1;
    ma = (Int(d[row+2]['Male Estimate'])) * -1;
    fu = Int(d[row]['Female Estimate']) - Int(d[row+2]['Female Estimate']);
    fa = Int(d[row+2]['Female Estimate']);
    result[i] = [mu, ma, fu, fa];
  } //for

  // add age group to front of result
  result[0].unshift('18-24');
  result[1].unshift('25-34');
  result[2].unshift('35-44');
  result[3].unshift('45-64');
  result[4].unshift('65+');
}

function changeYear(newYear)
{
  year = newYear;
  INmap(year);
  drawChart();
}//changeYear

function changeCounty(newCounty)
{
  county = newCounty;
  drawChart();
  document.getElementById("county").textContent = county;
}//changeCounty

function drawChart()
{
  document.getElementById("pop_pyramid").style.width = window.innerWidth - width - 50 + "px";
  // load data
  d3.csv("data/"+county+"/"+county+"_"+year+"_edu.csv", function(csvdata) 
  { 
    parse(csvdata);
    }); //d3.cdv

  var title = ['Subject', 'Male without College Degree', 'Male with College Degree or Higher', 'Female without College Degree', 'Female with College Degree or Higher'];
  var edu_data = new google.visualization.DataTable();
  
  //initialize table headers
  edu_data.addColumn('string', title[0]);
  for(var i = 1; i < title.length; i++)
  {
    edu_data.addColumn('number', title[i]);
  } //for

  for(var i = 0; i < result.length; i++)
  {
          edu_data.addRow(result[i]);
  } //for

  //set axis range
  var axis_max, axis_min;
  var left = (edu_data.getColumnRange(1).min + edu_data.getColumnRange(2).min).toExponential().split("e+"),
      right = (edu_data.getColumnRange(3).max + edu_data.getColumnRange(4).max).toExponential().split("e+");

  axis_min = Math.abs(Math.ceil(parseFloat(left[0])) * Math.pow(10, left[1]));
  axis_max = Math.abs(Math.ceil(parseFloat(right[0])) * Math.pow(10, right[1]));

  var axis;
  axis_min > axis_max ? axis = axis_min: axis = axis_max;

  var chart = new google.visualization.BarChart(document.getElementById('pop_pyramid'));

  var options = 
  {
    isStacked: true,
    colors: ['#3D5499', '#00AAFF', '#B37493', '#FF0037'],
    hAxis: 
    { 
      format:'long',
      viewWindow:
      {
        max: axis,
        min: axis * -1
      },//viewWindow
      gridlines: { count: 5 }
    } , //hAxis
    vAxis: { direction: -1 },
    chartArea: { left: "10%", width: "50%" }
  }; //options

  chart.draw(edu_data, options);
} //chart
