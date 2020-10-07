import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import './SunburstJobs.css'
require('highcharts/modules/sunburst')(Highcharts);

const COLORS = ['#A1E8AF', '#A4243B', '#D8973C', '#4281A4', '#084C61']

class SunburstJobs extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var url = 'http://localhost:5001/api/jobs'
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

    var data = new Object();
    this.state['all-jobs'].forEach(function (job_data, index) {
      var location = job_data.location;
      var title = job_data.title;
      var company = job_data.company;

      if (!(title in data)) {
        data[title] = new Object();
      }

      if (!(location in data[title])){
        data[title][location] = new Object();
      }

      if (!(company in data[title][location])){
        data[title][location][company] = 0;
      }

      data[title][location][company] += 1;
    });

    var series_data = new Array();
    var title_counter = 1;
    var location_counter = 1;
    var company_counter = 1;
    Object.keys(data).forEach( function (job_title) {
      const title_id = "1.".concat(title_counter.toString());
      series_data.push({"id": title_id,
        "parent": "0.0",
        "name": job_title
      })
      Object.keys(data[job_title]).forEach( function (location_name) {
        const location_id = "2.".concat(location_counter.toString());
        series_data.push({"id": location_id,
          "parent": title_id,
          "name": location_name
        })
        Object.keys(data[job_title][location_name]).forEach( function (company_name) {
          const company_id = "3.".concat(company_counter.toString());
          series_data.push({"id": company_id,
            "parent": location_id,
            "name": company_name,
            "value": data[job_title][location_name][company_name]
          })
          company_counter += 1;
        });
      location_counter += 1;
      });
    title_counter += 1;
    });

    this.setState({
      chartOptions: {
        title: {
          text: "Jobs breakdown"
        },
        colors: COLORS,
        series: [
          {
            data: series_data,
            type: 'sunburst',
            allowDrillToNode: true,
            colors: COLORS,
            levels: [
              {
                level: 1,
                colorByPoint: true,
              },{
                level: 2,
                colorByPoint: true,
              },{
                level: 3,
                colorByPoint: true,
              }
            ],
          }
        ],
        tooltip: {
          headerFormat: "",
          pointFormat: '<b>{point.value}</b> jobs for <b>{point.name}</b>'
        },
        chart: {
          className: "sunburst-chart",
          height: '70%'
        }
      }
    });
  }

  render() {
    if ((!this.state) || !('all-jobs' in this.state))
      return ''

    const chartOptions = this.state['chartOptions'];
    return (
      <div className="charts-container">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      Total number of jobs: {this.state['all-jobs'].length}
      </div>
    )
  }
}

export default SunburstJobs;
