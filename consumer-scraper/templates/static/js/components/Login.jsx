import React, { Component } from 'react';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = this.state = { username: "", password: "", failedLogin: false}
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSignOn = this.handleSignOn.bind(this);
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
        return response.json();
      })
      .then((context) => {
        // The username and password are valid
        if(context.login_status == "success"){
          localStorage.setItem("username", this.state.username);
          // Call the success function passed from NavBar component to rerender entire page
          this.props.success();
          // Login success, so ensure that error text won't be displayed in future
          this.setState({
            failedLogin: false,
          });
        }
        else{
          // Failed login, set field to true so that error text is rendered
          this.setState({
            failedLogin: true,
          });
        }
      });
  }

  render(){
    return(
      <div class="modal" id="singup-popup" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">

            <div class="modal-header">
              <h4 class="modal-title">Sign In</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="username-field">Username</label>
                  <input class="form-control" type="text" id="username-field" />
                </div>
                <div class="form-group">
                  <label for="password-field">Password</label>
                  <input class="form-control" type="password" id="password-field" />
                </div>
              </form>
            </div>

            <div class="modal-footer">
              Hello world
            </div>

          </div>
        </div>
      </div>
    )
  }
};

export default Login;
