import React from 'react';
import JobsForm from './JobsForm.js';
import SampleJobs from './SampleJobs.js';
import LineChart from './Chart.js';

class App extends React.Component {
	render() {
  	return (
  	  <div>
  	  <h1> Job Searching </h1>
        <LineChart />
        <JobsForm />
  	  <h1> Samples </h1>
  	    <SampleJobs />
    	</div>
    );
  }
}

export default App;