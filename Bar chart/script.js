const margin = {top: 40, bottom: 10, left: 120, right: 20}
const width = 1000 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

const numFormatter = (num) => { // refactoring numbers
  if (num > 1000000000) {
    return (num/10000000).toFixed(0) + ' billion'
  } else {
    return (num/1000000).toFixed(0) + ' million'
  }
}

// Creating SVG element in body
const svg = d3.select('body').append('svg')
  .attr('width', width+margin.left+margin.right)
  .attr('height', height+margin.top+margin.bottom)

// Use the group element for margins
const g = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Global variable
let data
let filtered_data

// Scales setup
const xscale = d3.scaleLinear().range([0, width]) // scaleLinear for lineair data
const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1) // scaleband for ordinal data, the countries

// Axis setup
const xaxis = d3.axisTop().scale(xscale) // creating top axis
const g_xaxis = g.append('g').attr('class','x axis') // giving classes to top axis
const yaxis = d3.axisLeft().scale(yscale) // creating left axis
const g_yaxis = g.append('g').attr('class','y axis') // giving classes to left axis

// Importing CSV
d3.csv('https://raw.githubusercontent.com/Tomvandenberg11/frontend-data/main/data.csv').then((csv) => { // importing csv file as csv file with D3 function
  data = csv
  update(data)
})

const update = (new_data) => {
  xscale.domain([0, d3.max(new_data, (d) => d.population * 1000)]) // updating the top axis to data
  yscale.domain(new_data.map((d) => d.country)) // updating the left axis to data

  g_xaxis.transition().call(xaxis) // render of the x-axis with transition
  g_yaxis.transition().call(yaxis) // render of the y-axis with transition

  const rect = g.selectAll('rect').data(new_data, (d) => d.country).join( // Creating and selecting all bars for every country
    (enter) => {
      const rect_enter = enter.append('rect').attr('x', 0) // adding rect for every country
      rect_enter.append('title') // adding mouseover title attribute
      enter.text('hoi')
      return rect_enter
    },
    (update) => update, // updating chart when filtering
    (exit) => exit.remove() // removing countries when filtering
  )

  rect.transition()
    .duration(1000)
    .attr('height', yscale.bandwidth()) // giving the height of each bar
    .attr('width', (d) => xscale(d.population * 1000)) // giving the with of each bar
    .attr('y', (d) => yscale(d.country)) // giving each country by bar
    .transition() // making new transition for the fills of the bar
    .duration(1000)
    .style('fill', 'indianred')
    .style('fill-opacity', '.8')

  rect.select('title').text((d) => numFormatter(d.population * 1000) ) // giving population to mouseover
}

//Filter continents
d3.select('#filter-continent').on('change', function () { // this will be triggered when the #filter-continent is changed
  const checked = d3.select(this).property('value')
  if (checked !== 'reset') { // check if selected continent is not equal to all continents
    filtered_data = data.filter((d) => d.continent === checked) // full filter data variable with only data which is filtered
    update(filtered_data) // run update function only with filtered data
  } else {
    update(data) // is reset continent is selected, update with all data
  }
})