import React from 'react';
import './JobsForm.css'

class JobsForm extends React.Component {
  state = {
    title: null,
    company: null,
    location: null,
    description: null,
    link: null
     };

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state)
    var url = 'http://localhost:5001/jobs'
    var req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Access-Control-Allow-Origin", "*");
    req.send(JSON.stringify(this.state))

  };

	render() {
  	return (
      <div class='container' id='formContainer'>
        <form onSubmit={this.handleSubmit}>
          <span id='submitFormTitle'><h1>Insert New Job</h1></span>
          <div class='row'>
          <input
            type="text"
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
            placeholder="Job Title"
            required
          />
          </div>
          <div class='row'>
          <input
            type="text"
            value={this.state.company}
            onChange={event => this.setState({ company: event.target.value })}
            placeholder="Company"
            required
          />
          </div>
          <div class='row'>
          <input
            type="text"
            value={this.state.location}
            onChange={event => this.setState({ location: event.target.value })}
            placeholder="Location"
            required
          />
          </div>
          <div class='row'>
          <input
            type="text"
            value={this.state.link}
            onChange={event => this.setState({ link: event.target.value })}
            placeholder="Link"
            required
          />
          </div>
          <div class='row'>
          <textarea
            id='jobDescriptionTextarea'
            value={this.state.description}
            onChange={event => this.setState({ description: event.target.value })}
            placeholder="Job Description"
            required
          />
          </div>
          <button id='submitFormButton'>Add to jobs database</button>
        </form>
      </div>
    );
  }
}

export default JobsForm;
