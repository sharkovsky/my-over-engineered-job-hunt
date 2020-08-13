import React from 'react';
import './SampleJobs.css'

class SampleJobs extends React.Component {
  constructor(props){
    super(props);
    this.state = {'readMore': [false, false, false, false, false]}
  }

  componentDidMount() {
    var url = 'http://localhost:5001/api/jobs?limit=5'
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', url, true);
    req.onload  = () => {
     var jsonResponse = JSON.parse(JSON.parse(req.responseText));
     this.setState({'all-jobs': jsonResponse})
    };
    req.send();
  }

  renderState (instance) {
    var state = instance.state
    if ('all-jobs' in state) {
      console.log('renderState');
      console.log(state)
      console.log(state['all-jobs'][0])
      return state['all-jobs'].map(
        function(el, i) {
          var desc;
          if('description' in el && el['description']){
            if(state['readMore'][i])
              desc = el['description']
            else
              desc = el['description'].substr(0,60) + ' '
          }
          else
            desc = ''
          return (
              <div className='card'>
                <h4>Title</h4> {el['title']}
                <h4>Company</h4> {el['company']}
                <h4>Location</h4> {el['location']}
                <h4>Description</h4> {desc}
                  <a
                    href='#'
                    className='readMoreLink'
                    onClick={()=>{
                      var ReadMoreState = state['readMore']
                      ReadMoreState[i] = !ReadMoreState[i]
                      instance.setState({'readMore': ReadMoreState})}}> Read More</a>
              </div>
            );
        }
      )
    }
    else
      return ''
  }

	render() {
	  console.log(this.state)
  	return (
  	  <div className='job-cards-container'>
  	    {this.renderState(this)}
  	  </div>
    );
  }
}

export default SampleJobs;
