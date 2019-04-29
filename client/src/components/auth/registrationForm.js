import React from 'react';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';



export default withAuth(
  class RegistrationForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        sessionToken: null
      };
      this.oktaAuth = new OktaAuth({ url: 'https://dev-680655.okta.com' });
      this.checkAuthentication();
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    checkAuthentication = async() => {
      const sessionToken = await this.props.auth.getIdToken();
      if (sessionToken) {
        this.setState({ sessionToken });
      }
    }

    componentDidUpdate() {
      this.checkAuthentication();
    }

    handleFirstNameChange = (e) => {
      this.setState({ firstName: e.target.value });
    }
    handleLastNameChange = (e) => {
      this.setState({ lastName: e.target.value });
    }
    handleEmailChange = (e) => {
      this.setState({ email: e.target.value });
    }
    handlePasswordChange = (e) => {
      this.setState({ password: e.target.value });
    }

    handleSubmit(e) {
      e.preventDefault();
      fetch('/api/contacts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then(user => {
          this.oktaAuth
            .signIn({
              username: this.state.email,
              password: this.state.password
            })
            .then(res =>
              this.setState({
                sessionToken: res.sessionToken
              })
            );
        })
        .catch(err => console.log);
    }

    render() {
      if (this.state.sessionToken) {
        this.props.auth.redirect({ sessionToken: this.state.sessionToken });
        return null;
      }

      return (
        <form onSubmit={this.handleSubmit}>
          <div className="form-element">
            <label>Email:</label>
            <input
              type="email"
              id="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
          </div>
          <div className="form-element">
            <label>First Name:</label>
            <input
              type="text"
              id="firstName"
              value={this.state.firstName}
              onChange={this.handleFirstNameChange}
            />
          </div>
          <div className="form-element">
            <label>Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={this.state.lastName}
              onChange={this.handleLastNameChange}
            />
          </div>
          <div className="form-element">
            <label>Password:</label>
            <input
              type="password"
              id="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <input type="submit" id="submit" value="Register" />
        </form>
      );
    }
  }
);