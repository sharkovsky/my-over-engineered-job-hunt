import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
require('highcharts/modules/sankey')(Highcharts);

class LineChart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var url = 'http://localhost:5001/jobs'
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', url, true);
    req.onload  = () => {
     var jsonResponse = JSON.parse(JSON.parse(req.responseText));
     this.setState({'all-jobs': jsonResponse});
     this.updateSeries();
    };
    req.send();
  }

  updateSeries = () => {
    // The chart is updated only with new options.

    const unique_locations = [...new Set((this.state['all-jobs'].map(item => item.location)))]
    const unique_titles = [...new Set((this.state['all-jobs'].map(item => item.title)))]
    const unique_companies = [...new Set((this.state['all-jobs'].map(item => item.company)))]

    var sankey_data = [];

    var loc_id, title_id;
    for (loc_id in unique_locations) {
      for (title_id in unique_titles) {
        var loc = unique_locations[loc_id];
        var tit = unique_titles[title_id];
        var count = this.state['all-jobs'].reduce((acc, cur) => (cur['location'] === loc) && (cur['title'] === tit) ? ++acc : acc, 0);
        if (count > 0)
          sankey_data.push([loc, tit, count])
      }
    }
    var comp_id, title_id;
    for (comp_id in unique_companies) {
      for (title_id in unique_titles) {
        var comp = unique_companies[comp_id];
        var tit = unique_titles[title_id];
        var count = this.state['all-jobs'].reduce((acc, cur) => (cur['company'] === comp) && (cur['title'] === tit) ? ++acc : acc, 0);
        if (count > 0)
          sankey_data.push([tit, comp, count])
      }
    }

    this.setState({
      chartOptions: {
        title: {
          text: "Jobs breakdown"
        },
        series: [
          {
            keys: ["from", "to", "weight"],
            data: sankey_data,
            type: 'sankey',
            name: 'Breakdown of jobs'
          }
        ]
      }
    });
  }

  render() {
    if ((!this.state) || !('all-jobs' in this.state))
      return ''

    const chartOptions = this.state['chartOptions'];
    console.log('Rendering Sankey')
    console.log(chartOptions)

    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </div>
    )
  }
}

export default LineChart;
