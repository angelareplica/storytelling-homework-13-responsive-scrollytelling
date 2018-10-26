import * as d3 from 'd3'

let margin = { top: 100, left: 50, right: 170, bottom: 30 }

let height = 700 - margin.top - margin.bottom

let width = 600 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let parseTime = d3.timeParse('%B-%y')

let xPositionScale = d3.scaleLinear().range([0, width])
let yPositionScale = d3.scaleLinear().range([height, 0])

let colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

let line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('./data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  let dates = datapoints.map(d => d.datetime)
  let prices = datapoints.map(d => +d.price)

  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))

  let nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'lines')
    .classed('united-states', d => {
      // console.log(d.key)
      return d.key === 'U.S.'
      // var regions = nested.map(function(d) {
      //   return d.key.toLowerCase().replace(/[^a-z]*/g, '')
      // })
      // console.log(regions[0])
    })
    .classed('mountain', d => {
      return d.key === 'Mountain'
    })
    .classed('pacific', d => {
      return d.key === 'Pacific'
    })
    .classed('west-south-central', d => {
      return d.key === 'West South Central'
    })
    .classed('south-atlantic', d => {
      return d.key === 'South Atlantic'
    })
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'circles')
    .classed('united-states', d => {
      return d.key === 'U.S.'
    })
    .classed('mountain', d => {
      return d.key === 'Mountain'
    })
    .classed('pacific', d => {
      return d.key === 'Pacific'
    })
    .classed('west-south-central', d => {
      return d.key === 'West South Central'
    })
    .classed('south-atlantic', d => {
      return d.key === 'South Atlantic'
    })
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 4)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'label-text')
    .classed('united-states', d => {
      return d.key === 'U.S.'
    })
    .classed('mountain', d => {
      return d.key === 'Mountain'
    })
    .classed('pacific', d => {
      return d.key === 'Pacific'
    })
    .classed('west-south-central', d => {
      return d.key === 'West South Central'
    })
    .classed('south-atlantic', d => {
      return d.key === 'South Atlantic'
    })
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .text(function(d) {
      return d.key
    })
    .attr('dx', 6)
    .attr('dy', 4)
    .attr('font-size', '12')

  svg
    .append('text')
    .attr('font-size', '24')
    .attr('text-anchor', 'middle')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)

  let rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  svg
    .append('rect')
    .attr('class', 'dec-rect')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', '#C2DFFF')
    .lower()

  let xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  let yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  // Adding the steps
  d3.select('#requirements-2').on('stepin', () => {
    svg
      .selectAll('.lines')
      .attr('stroke', 'none')
      .attr('fill', 'none')
    svg.selectAll('.circles').attr('fill', 'none')
    svg.selectAll('.dec-rect').attr('fill', 'none')
    svg.selectAll('.label-text').attr('opacity', 0)
  })

  d3.select('#lines').on('stepin', () => {
    svg
      .selectAll('.lines')
      .data(nested)
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })
      .attr('stroke-width', 2)
      .attr('fill', 'none')

    svg
      .selectAll('.circles')
      .data(nested)
      .attr('fill', function(d) {
        return colorScale(d.key)
      })

    svg
      .selectAll('.label-text')
      .attr('opacity', 1)
      .attr('fill', 'black')
  })

  d3.select('#highlight-us').on('stepin', () => {
    svg.selectAll('.lines').attr('stroke', 'lightgrey')
    svg.selectAll('.circles').attr('fill', 'lightgrey')
    svg.selectAll('path.united-states').attr('stroke', 'red')
    svg.selectAll('circle.united-states').attr('fill', 'red')
    svg.selectAll('.label-text').attr('fill', 'lightgrey')
    svg.selectAll('text.united-states').attr('fill', 'red')
  })

  d3.select('#highlight-regions').on('stepin', () => {
    svg.selectAll('path.mountain').attr('stroke', 'lightblue')
    svg.selectAll('path.pacific').attr('stroke', 'lightblue')
    svg.selectAll('path.west-south-central').attr('stroke', 'lightblue')
    svg.selectAll('path.south-atlantic').attr('stroke', 'lightblue')
    svg.selectAll('circle.mountain').attr('fill', 'lightblue')
    svg.selectAll('circle.pacific').attr('fill', 'lightblue')
    svg.selectAll('circle.west-south-central').attr('fill', 'lightblue')
    svg.selectAll('circle.south-atlantic').attr('fill', 'lightblue')
    svg.selectAll('text.mountain').attr('fill', 'lightblue')
    svg.selectAll('text.pacific').attr('fill', 'lightblue')
    svg.selectAll('text.west-south-central').attr('fill', 'lightblue')
    svg.selectAll('text.south-atlantic').attr('fill', 'lightblue')
  })

  d3.select('#winter').on('stepin', () => {
    svg
      .selectAll('.dec-rect')
      .attr('fill', '#C2DFFF')
      .lower()
  })

  // make it responsive

  function render() {
    // Calculate height/width
    let screenWidth = svg.node().parentNode.parentNode.offsetWidth
    let screenHeight = window.innerHeight
    let newWidth = screenWidth - margin.left - margin.right
    let newHeight = screenHeight - margin.top - margin.bottom

    // Update your SVG
    let actualSvg = d3.select(svg.node().parentNode)
    actualSvg
      .attr('height', newHeight + margin.top + margin.bottom)
      .attr('width', newWidth + margin.left + margin.right)

    // Update scales (depends on your scales)
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])

    // Reposition/redraw your elements

    // make the lines, labels, and circles responsive

    svg.selectAll('.lines').attr('d', function(d) {
      return line(d.values)
    })

    svg
      .selectAll('.label-text')
      .data(nested)
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    svg
      .selectAll('.circles')
      .data(nested)
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })

    // make the winter rectangle responsive

    let rectWidth =
      xPositionScale(parseTime('February-17')) -
      xPositionScale(parseTime('November-16'))
    svg
      .selectAll('.dec-rect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('width', rectWidth)
      .attr('height', newHeight)

    // Update axes if necessary

    // remove some ticks from the x-axis if the window gets really narrow

    if (newWidth < 300) {
      xAxis.ticks(6)
    } else {
      xAxis.ticks(9)
    }

    svg
      .select('.x-axis')
      .attr('transform', 'translate(0,' + newHeight + ')')
      .call(xAxis)

    svg.select('.y-axis').call(yAxis)
  }
  window.addEventListener('resize', render)
  render()
}
