import React, { Component } from 'react';
import './App.css';
import './webfontkit-20171031-092256/stylesheet.css'
import axios from 'axios';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div className="home">
        <h1 className="homeh1"> Mars Colony </h1>
        <h6 className="homeh6"> Let's go find some aliens!</h6>
        <Link to="/register/"> <button className="homebutton" type="submit"> Register as a Colonist </button> </Link>
      </div>
    )
  }
}


class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      age: '',
      jobs: [],
      job_id: '',
    }
    this.updateStateJob = this.updateStateJob.bind(this);
    this.updateStateAge = this.updateStateAge.bind(this);
    this.updateStateName = this.updateStateName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
    axios.get('https://red-wdp-api.herokuapp.com/api/mars/jobs')
      .then((response) => {
        const jobs = response.data.jobs;
        this.setState({
          jobs
        })

      })
  };


  render() {
    return (
      <div className="register">
        <h1 className="registerh1"> Colonist Registration </h1>
        <h6 className="registerh6"> Warning! There are some very large aliens out there...proceed with caution!</h6>
        <p> Full Name </p>
        <input type="text" name="name" className="colonistname" value={this.state.name} onChange={this.updateStateName} />
        <p> Age </p>
        <input type="number" name="age" className="colonistage" value={this.state.age} onChange={this.updateStateAge} />
        <p> Occupation </p>
        <select className="colinstoccupation" onChange={this.updateStateJob}>
          <option> Select Occupation... </option>
          {this.state.jobs.map(function (jobs) {
            return <option value={jobs.id}>{jobs.name}</option>
          })}
        </select>
        <Link to="/view"> <button className="registerbutton" type="submit" onClick={this.handleSubmit}> I Understand I Am Entering A WarZone </button> </Link>
      </div>
    )
  }

  updateStateName(event) {
    this.setState({
      name: event.target.value,
    });

  }

  updateStateAge(event) {
    this.setState({
      age: event.target.value,

    });

  }

  updateStateJob(event) {
    this.setState({
      job_id: event.target.value,
    });
  }

  handleSubmit(event) {
    axios.post('https://red-wdp-api.herokuapp.com/api/mars/colonists', {
      "colonist": {
        "name": this.state.name,
        "age": this.state.age,
        "job_id": this.state.job_id,
      }
    })
      .then(function (response) {
        var id = response.data.colonist.id;
        sessionStorage.setItem("job", id);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

}

class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      encounters: []
    }
  }

  componentDidMount() {
    axios.get('https://red-wdp-api.herokuapp.com/api/mars/encounters')
      .then((response) => {
        const encounters = (response.data.encounters);
        this.setState({
          encounters: encounters
        })

      })
  };

  render() {
    return (
      <div className="view">
        <h1 className="viewh1"> Recent Encounters </h1>
        <h6 className="viewh6"> Look at all of the recent alien encounters below </h6>
        <div className="viewlist">
          <ul className="actuallist">
            {this.state.encounters.reverse().map(function (encounters) {
              return (<li>{encounters.date}<span>-   {encounters.atype}</span><br />{encounters.action}</li>
              )
            })}
          </ul>
        </div>
        <div className="viewfooter"> <a href="/report"> Report Encounter </a> </div>
      </div>
    )
  }
}

class Report extends Component {
  constructor(props) {
    super(props);

    this.state = {
      aliens: [],
      alien_id: '',
      colonist_id: sessionStorage.getItem('job'),
      action: '',
      date: '2017-11-13',
    }
    this.updateAction = this.updateAction.bind(this);
    this.updateAliens = this.updateAliens.bind(this);
    this.handleFinalSubmit = this.handleFinalSubmit.bind(this);
  }

  updateAction(event) {
    this.setState({
      action: event.target.value,
    });
  }

  updateAliens(event) {
    this.setState({
      alien_id: event.target.value,
    });
  }

  handleFinalSubmit(event) {
    axios.post('https://red-wdp-api.herokuapp.com/api/mars/encounters', {
      "encounter": {
        "atype": this.state.aliens[this.state.alien_id - 1].type,
        "date": this.state.date,
        "action": this.state.action,
        "colonist_id": this.state.colonist_id,
      }
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    axios.get('https://red-wdp-api.herokuapp.com/api/mars/aliens')
      .then((response) => {
        const aliens = (response.data.aliens);
        this.setState({
          aliens: aliens
        })

      })
  };

  render() {
    return (
      <div className="report">
        <h1 className="reporth1"> Report Encounter </h1>
        <h6 className="reporth6"> So like, who'd you see & who won... </h6>
        <div className="reportactiondiv">
          <input className="reportaction" placeholder="Outcome of the encounter..." onChange={this.updateAction} />
          <select className="reportselect" onChange={this.updateAliens}>
            <option> Select Alien Type... </option>
            {this.state.aliens.map(function (aliens) {
              return <option value={aliens.id}>{aliens.type}</option>
            })}
          </select>
        </div>
        <Link to="/view" className='footerlink' onClick={this.handleFinalSubmit}> <div className="reportfooter"> Submit Report </div> </Link>
      </div>
    )
  }
}

const HomePage = () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/view" component={View} />
      <Route path="/report" component={Report} />
    </div>
  </Router>
)

export default HomePage;

