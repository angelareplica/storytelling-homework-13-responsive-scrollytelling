import * as d3 from 'd3'

var margin = { top: 10, left: 10, right: 10, bottom: 10 }

var height = 480 - margin.top - margin.bottom

var width = 480 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var radius = 200

var radiusScale = d3
  .scaleLinear()
  .domain([10, 100])
  .range([40, radius])

var colorScale = d3.scaleSequential(d3.interpolateSinebow).domain([60, 100])

var angleScale = d3
  .scalePoint()
  .domain([
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
    'Blah'
  ])
  .range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .outerRadius(function(d) {
    return radiusScale(d.high_temp)
  })
  .innerRadius(function(d) {
    return radiusScale(d.low_temp)
  })
  .angle(function(d) {
    return angleScale(d.month_name)
  })

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var container = svg
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

  datapoints.forEach(d => {
    d.high_temp = +d.high_temp
    d.low_temp = +d.low_temp
  })

  // calculate min/max high temps for colorScale
  // var highTemps = datapoints.map(function(d) {
  //   return +d.high_temp
  // })

  // var minHighTemp = d3.min(highTemps)
  // var maxHighTemp = d3.max(highTemps)

  // colorScale.domain([minHighTemp, maxHighTemp])

  // Filter for each city and find the mean high temp
  let nycDatapoints = datapoints.filter(d => d.city === 'NYC')
  nycDatapoints.push(nycDatapoints[0])

  var nycTemps = nycDatapoints.map(function(d) {
    return +d.high_temp
  })
  var nycMean = d3.mean(nycTemps)

  let limaDatapoints = datapoints.filter(d => d.city === 'Lima')
  limaDatapoints.push(limaDatapoints[0])

  var limaTemps = limaDatapoints.map(function(d) {
    return +d.high_temp
  })
  var limaMean = d3.mean(limaTemps)

  let tucsonDatapoints = datapoints.filter(d => d.city === 'Tuscon')
  tucsonDatapoints.push(tucsonDatapoints[0])

  var tucsonTemps = tucsonDatapoints.map(function(d) {
    return +d.high_temp
  })
  var tucsonMean = d3.mean(tucsonTemps)

  let beijingDatapoints = datapoints.filter(d => d.city === 'Beijing')
  beijingDatapoints.push(beijingDatapoints[0])

  var beijingTemps = beijingDatapoints.map(function(d) {
    return +d.high_temp
  })
  var beijingMean = d3.mean(beijingTemps)

  let melbourneDatapoints = datapoints.filter(d => d.city === 'Melbourne')
  melbourneDatapoints.push(melbourneDatapoints[0])

  // var melbourneTemps = melbourneDatapoints.map(function(d) {
  //   return +d.high_temp
  // })
  // var melbourneMean = d3.mean(melbourneTemps)

  let stockholmDatapoints = datapoints.filter(d => d.city === 'Stockholm')
  stockholmDatapoints.push(stockholmDatapoints[0])

  var stockholmTemps = stockholmDatapoints.map(function(d) {
    return +d.high_temp
  })
  var stockholmMean = d3.mean(stockholmTemps)

  container
    .append('path')
    .attr('class', 'temp')
    .datum(nycDatapoints)
    .attr('d', line)
    .attr('fill', 'black')
    .attr('opacity', 0.75)

  var circleBands = [20, 30, 40, 50, 60, 70, 80, 90]
  var textBands = [30, 50, 70, 90]

  container
    .selectAll('.bands')
    .data(circleBands)
    .enter()
    .append('circle')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'gray')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', function(d) {
      return radiusScale(d)
    })
    .lower()

  container
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('class', 'city-name')
    .text('NYC')
    .attr('font-size', 30)
    .attr('font-weight', 700)
    .attr('alignment-baseline', 'middle')

  container
    .selectAll('.temp-notes')
    .data(textBands)
    .enter()
    .append('text')
    .attr('class', 'temp-notes')
    .attr('x', 0)
    .attr('y', d => -radiusScale(d))
    .attr('dy', -2)
    .text(d => d + '°')
    .attr('text-anchor', 'middle')
    .attr('font-size', 8)

  d3.select('#nyc').on('stepin', () => {
    container
      .selectAll('.temp')
      .datum(nycDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(nycMean))
    d3.selectAll('.label-NYC')
      .style('background', d => colorScale(nycMean))
      .style('color', 'white')
    d3.selectAll('.city-name').text('NYC')
  })

  d3.select('#beijing').on('stepin', () => {
    container
      .selectAll('.temp')
      .datum(beijingDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(beijingMean))

    d3.selectAll('.label-Beijing')
      .style('background', d => colorScale(beijingMean))
      .style('color', 'white')

    d3.selectAll('.city-name').text('Beijing')
  })

  d3.select('#stockholm').on('stepin', () => {
    container
      .selectAll('.temp')
      .datum(stockholmDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(stockholmMean))

    d3.selectAll('.label-Stockholm')
      .style('background', d => colorScale(stockholmMean))
      .style('color', 'white')

    d3.selectAll('.city-name').text('Stockholm')
  })

  d3.select('#lima').on('stepin', () => {
    container
      .selectAll('.temp')
      .datum(limaDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(limaMean))

    d3.selectAll('.label-Lima')
      .style('background', d => colorScale(limaMean))
      .style('color', 'white')

    d3.selectAll('.city-name').text('Lima')
  })

  d3.select('#tucson').on('stepin', () => {
    container
      .selectAll('.temp')
      .datum(tucsonDatapoints)
      .transition()
      .attr('d', line)
      .attr('fill', d => colorScale(tucsonMean))

    d3.selectAll('.label-Tucson')
      .style('background', d => colorScale(tucsonMean))
      .style('color', 'white')

    d3.selectAll('.city-name').text('Tucson')
  })

  function render() {
    // Calculate height/width
    let screenHeight = window.innerHeight
    let screenWidth = (width / height) * screenHeight

    let side = Math.min(screenHeight, screenWidth)

    let newWidth = side - margin.left - margin.right
    let newHeight = side - margin.top - margin.bottom

    // Update your SVG
    let actualSvg = d3.select(svg.node().parentNode)
    actualSvg
      .attr('height', newHeight + margin.top + margin.bottom)
      .attr('width', newWidth + margin.left + margin.right)

    container.attr(
      'transform',
      'translate(' + newWidth / 2 + ',' + newHeight / 2 + ')'
    )

    // Update scales (depends on your scales)

    var newRadius = (radius / width) * newWidth

    radiusScale.range([(40 / width) * newWidth, newRadius])

    // Reposition/redraw your elements

    svg.selectAll('.bands').attr('r', function(d) {
      return radiusScale(d)
    })

    svg.selectAll('.temp-notes').attr('y', d => -radiusScale(d))

    svg.selectAll('.temp').attr('d', line)

    // Update axes if necessary
  }
  window.addEventListener('resize', render)
  render()
}
