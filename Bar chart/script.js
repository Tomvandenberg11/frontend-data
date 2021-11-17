const margin = {top: 40, bottom: 10, left: 120, right: 20}
const width = 1000 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

// Creating SVG element in body
const svg = d3.select('body').append('svg')
  .attr('width', width+margin.left+margin.right)
  .attr('height', height+margin.top+margin.bottom)

// Use the group element for margins
const g = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

// Global variable
let data

// Scales setup
const xscale = d3.scaleLinear().range([0, width])
const yscale = d3.scaleBand().rangeRound([0, height]).paddingInner(0.1)

// Axis setup
const xaxis = d3.axisTop().scale(xscale)
const g_xaxis = g.append('g').attr('class','x axis')
const yaxis = d3.axisLeft().scale(yscale)
const g_yaxis = g.append('g').attr('class','y axis')

// Importing CSV
d3.csv('https://raw.githubusercontent.com/Tomvandenberg11/frontend-data/main/data.csv').then((csv) => {
  data = csv
  update(data)
});

// Update the SVG with the filters applied
const update = (new_data) => {
  // update the scales
  xscale.domain([0, d3.max(new_data, (d) => d.population * 1000)])
  yscale.domain(new_data.map((d) => d.country))
  //render the axis
  g_xaxis.transition().call(xaxis)
  g_yaxis.transition().call(yaxis)

  // DATA JOIN use the key argument for ensurign that the same DOM element is bound to the same data-item
  const rect = g.selectAll('rect').data(new_data, (d) => d.country).join(
    // ENTER
    // new elements
    (enter) => {
      const rect_enter = enter.append('rect').attr('x', 0)
      rect_enter.append('title')
      return rect_enter
    },
    // UPDATE
    // update existing elements
    (update) => update,
    // EXIT
    // elements that aren't associated with data
    (exit) => exit.remove()
  );

  // ENTER + UPDATE
  // both old and new elements
  rect.transition()
    .attr('height', yscale.bandwidth())
    .attr('width', (d) => xscale(d.population * 1000))
    .attr('y', (d) => yscale(d.country))

  rect.select('title').text((d) => d.country)
}

let filtered_data

//Filter continents
d3.select('#filter-continent').on('change', function () {
  // This will be triggered when the user selects something of the select
  const checked = d3.select(this).property('value')
  if (checked !== 'reset') {
    // Keep only data element whose continent is in the select value
    filtered_data = data.filter((d) => d.continent === checked)
    update(filtered_data)  // Update the chart with the filtered data
  } else {
    // Select continent was set
    update(data);  // Update the chart with all the data
  }
})