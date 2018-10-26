import * as d3 from 'd3'

let margin = { top: 20, left: 25, right: 0, bottom: 70 }

let height = 600 - margin.top - margin.bottom
let width = 800 - margin.left - margin.right

let svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

Promise.all([
  d3.csv(require('./data/ces.csv')),
  d3.csv(require('./data/wages.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([ces, wages]) {
  svg
    .selectAll('.ces')
    .data(ces)
    .enter()
    .append('g')
    .attr('class', 'ces')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .each(function(d) {
      let svg = d3.select(this)

      let dataColumns = Object.keys(d).filter(d => d[0] === '2')
      // console.log('datacolumns looks like', dataColumns)

      let datapoints = dataColumns.map(colName => {
        return {
          name: colName,
          jobs: +d[colName]
        }
      })
      // console.log(datapoints)

      svg
        .selectAll('path')
        .data(datapoints)
        .enter()
        .append('path')
    })
}
