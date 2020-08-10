import React from 'react';
import './JobsForm.css'
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

class JobsForm extends React.Component {
  state = {
    title: '',
    selected_title: {value: '', label: 'Select or Insert Job Title'},
    company: '',
    selected_company: {value: '', label: 'Select or Insert Company'},
    location: '',
    selected_location: {value: '', label: 'Select or Insert Location'},
    description: '',
    link: '',
    unique_links: [],
    form_can_be_submitted: true
     };

  componentDidMount() {
    var url = 'http://localhost:5001/api/jobs'
    var req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', url, true);
    req.onload  = () => {
      var jsonResponse = JSON.parse(JSON.parse(req.responseText));
      const unique_locations = [...new Set((jsonResponse.map(item => item.location)))]
      const unique_titles = [...new Set((jsonResponse.map(item => item.title)))]
      const unique_companies = [...new Set((jsonResponse.map(item => item.company)))]
      const unique_links = [...new Set((jsonResponse.map(item => item.link)))]
      this.setState({
        location_options: unique_locations.map(item => ({value: item, label: item})),
        title_options: unique_titles.map(item => ({value: item, label: item})),
        company_options: unique_companies.map(item => ({value: item, label: item})),
        unique_links: unique_links
     })
    };
    req.send();
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    if (!this.form_can_be_submitted) {
      window.alert('Form was not submitted. Most likely a pre-existing job link was provided.')
      return;
    }
    //console.log(this.state)
    var url = 'http://localhost:5001/api/jobs';
    var req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Access-Control-Allow-Origin", "*");
    req.onload = () => {
      window.location.reload(false)
    }
    var to_send = Object.fromEntries(
      Object.entries(this.state)
      .filter(([key]) => ['title', 'location', 'company', 'link', 'description'].includes(key))
    );
    //console.log('Sending')
    //console.log(to_send)
    req.send(JSON.stringify(to_send))
  };

  handleNewLink = (event) => {
    this.form_can_be_submitted = true;
    document.getElementById("inputLink").style.backgroundColor = '#ffffff';
    if (this.state.unique_links.includes(event.target.value)) {
      console.log('Error: this link already exists. The form will not be submitted.')
      this.form_can_be_submitted = false;
      document.getElementById("inputLink").style.backgroundColor = '#f45b5b';
    }
    this.setState({link: event.target.value })
  };

	render() {
	  //console.log('Render Form')
	  //console.log(this.state)
  	return (
      <div className='container' id='formContainer'>
        <form onSubmit={this.handleSubmit}>
          <span id='submitFormTitle'><h1>Insert New Job</h1></span>
          <div className='row'>
          <CreatableSelect
            value={this.state.selected_title}
            onChange={selection => this.setState({selected_title: selection, title: selection.value})}
            options={this.state.title_options}
            required
          />
          </div>
          <div className='row'>
          <CreatableSelect
            value={this.state.selected_company}
            onChange={selection => this.setState({selected_company: selection, company: selection.value})}
            options={this.state.company_options}
            required
          />
          </div>
          <div className='row'>
          <CreatableSelect
            value={this.state.selected_location}
            onChange={selection => this.setState({selected_location: selection, location: selection.value})}
            options={this.state.location_options}
            required
          />
          </div>
          <div className='row'>
          <input
            type="text"
            id="inputLink"
            value={this.state.link}
            onChange={this.handleNewLink}
            placeholder="Link"
            required
          />
          </div>
          <div className='row'>
          <textarea
            id='jobDescriptionTextarea'
            value={this.state.description}
            onChange={event => this.setState({ description: event.target.value })}
            placeholder="Job Description"
            required
          />
          </div>
          <button type='Submit' id='submitFormButton'>Add to jobs database</button>
        </form>
      </div>
    );
  }
}

export default JobsForm;
