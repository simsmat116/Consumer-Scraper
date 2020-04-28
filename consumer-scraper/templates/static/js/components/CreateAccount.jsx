import React, { Component } from 'react';
import $ from 'jquery';
import 'bootstrap';

class AccountCreation extends Component {
  constructor(props){
    super(props);
    this.state = { username: "", password: "", password2: "", errorMsg: ""};
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePassword2Change = this.handlePassword2Change.bind(this);
    this.handleAccountCreation = this.handleAccountCreation.bind(this);
  }

  handleUserChange(e){
    this.setState({
      username: e.target.value
    });
  }

  handlePasswordChange(e){
    this.setState({
      password: e.target.value
    });
  }

  handlePassword2Change(e){
    this.setState({
      password2: e.target.value
    });
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
          password: this.state.password,
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
        this.setState({
          username: "",
          password: "",
          password2: ""
        })

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
              <form>
                <div class="form-group">
                  <label for="username-field" class="col-form-label">Username</label>
                  <input class="form-control" type="text" id="username-field" onChange={this.handleUserChange} />
                </div>
                <div class="form-group">
                  <label for="password-field" class="col-form-label">Password</label>
                  <input class="form-control" type="password" id="password-field" onChange={this.handlePasswordChange} />
                </div>
                <div class="form-group">
                  <label for="reenter-password-field" class="col-form-label">Re-enter Password</label>
                  <input class="form-control" type="password" id="reenter-password-field" onChange={this.handlePassword2Change} />
                </div>
              </form>
              <div style={{color: "red"}}> {this.state.errorMsg} </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-primary" onClick={this.handleAccountCreation}>Create Account</button>
            </div>
          </div>
        </div>

      </div>
    )
  }

};

export default AccountCreation;
