import React from 'react';
import JobsForm from './JobsForm.js';
import SampleJobs from './SampleJobs.js';

class App extends React.Component {
	render() {
  	return (
  	  <div>
  	  <h1> Samples </h1>
  	    <SampleJobs />
        <JobsForm />
    	</div>
    );
  }
}

export default App;