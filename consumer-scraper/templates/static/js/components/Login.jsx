import React, { Component } from 'react';
import $ from 'jquery';
import 'bootstrap';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = { username: "", password: "", errorMsg: ""}
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSignOn = this.handleSignOn.bind(this);
    this.closeModal = this.closeModal.bind(this)
  }

  handleUserChange(e){
    // Update the username entered to use in POST request
    this.setState({
      username: e.target.value,
    });
  }

  handlePasswordChange(e){
    // Update password entered to use in POST request
    this.setState({
      password: e.target.value,
    });
  }

  closeModal(){
    // Remove the modal using j-query
    $("#signup-popup").trigger("click");
  }

  handleSignOn(){
    // Send POST request to login REST API
    fetch("/api/accounts/login", {
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
        if(!response.ok) throw Error(response.statusText);
        this.closeModal();
        // Ensuring that the state is not stored if the user were to access this again
        this.setState({
          username: "",
          password: ""
        })
        // Rerender the navigation bar
        this.props.handleLogin();

      })
      .catch(error => {
        this.setState({
          errorMsg: "The username or password you entered is invalid."
        });
      })
  }

  render(){
    return(
      <div class="modal fade" id="signup-popup" tabindex="-1">
        <div class="modal-dialog" role="document">
          <div class="modal-content">

            <div class="modal-header">
              <h4 class="modal-title">Sign In</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="username-field" class="col-form-label">Username</label>
                  <input class="form-control" onChange={this.handleUserChange} value={this.state.username} type="text" id="username-field" />
                </div>
                <div class="form-group">
                  <label for="password-field" class="col-form-label">Password</label>
                  <input class="form-control" onChange={this.handlePasswordChange} value={this.state.password} type="password" id="password-field" />
                </div>
              </form>
              <div>
                Don't have an account? <a data-toggle="modal" data-target="#create-account-popup" class="text-primary" onClick={this.closeModal}>Sign Up</a>
              </div>
              <div style={{color: "red"}}>{this.state.errorMsg}</div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-primary" onClick={this.handleSignOn}>Sign In</button>
            </div>

          </div>
        </div>
      </div>
    )
  }
};

export default Login;
