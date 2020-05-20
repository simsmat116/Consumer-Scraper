import React, { Component } from 'react';
import $ from 'jquery';
import 'bootstrap';

class AccountCreation extends Component {
  constructor(props){
    super(props);
    this.state = { username: "", password: "", password2: "", errorMsg: "", firstName: "", lastName: ""};
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handlePassword2Change = this.handlePassword2Change.bind(this);
    this.handleAccountCreation = this.handleAccountCreation.bind(this);
  }

  handleUserChange(e){
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e){
    this.setState({ password: e.target.value });
  }

  handlePassword2Change(e){
    this.setState({ password2: e.target.value });
  }

  handleFirstNameChange(e){
    this.setState({ firstName: e.target.value });
  }

  handleLastNameChange(e){
    this.setState({ lastName: e.target.value });
  }

  handleAccountCreation(){
    if(this.state.password != this.state.password2){
      this.setState({
        errorMsg: "Passwords do not match. Please correct this and resubmit."
      });
      return;
    }

    fetch("/api/accounts/create", {
       method: 'POST',
        credentintials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.state.username,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          password: this.state.password
        })
    })
      .then((response) => {
        if(!response.ok){
          response.text().then((text) => {
            this.setState({
              errorMsg: text
            });
          });
          return;
        }

        $("#create-account-popup").trigger("click");
        this.setState({ username: "", password: "", password2: "" });

        this.props.handleCreation();

      })
  }



  render(){
    return(
      <div class="modal fade" id="create-account-popup">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h4 class="modal-title">Create Account</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
              <form onSubmit={this.handleAccountCreation}>
                <div class="form-group">
                  <label for="username-field" class="col-form-label">Username</label>
                  <input class="form-control" value={this.state.username} type="text" id="username-field" onChange={this.handleUserChange} required />
                </div>
                <div class="form-group">
                  <label for="firstname-field" class="col-form-label">First Name</label>
                  <input class="form-control" value={this.state.firstName} type="text" id="firstname-field" onChange={this.handleFirstNameChange} required />
                </div>
                <div class="form-group">
                  <label for="lastname-field" class="col-form-label">Last Name</label>
                  <input class="form-control" value={this.state.lastName} type="text" id="lastname-field" onChange={this.handleLastNameChange} required />
                </div>
                <div class="form-group">
                  <label for="password-field" class="col-form-label">Password</label>
                  <input class="form-control" value={this.state.password} type="password" id="password-field" onChange={this.handlePasswordChange} required />
                </div>
                <div class="form-group">
                  <label for="reenter-password-field" class="col-form-label">Re-enter Password</label>
                  <input class="form-control" value={this.state.password2} type="password" id="reenter-password-field" onChange={this.handlePassword2Change} required/>
                </div>
                <button class="btn btn-primary" type="submit">Create Account</button>
              </form>
              <div style={{color: "red"}}> {this.state.errorMsg} </div>
            </div>
          </div>
        </div>

      </div>
    )
  }

};

export default AccountCreation;
