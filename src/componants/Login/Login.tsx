import React from 'react';
import { redirect } from 'react-router-dom';
import { USER_TYPES } from 'src/common/common.types';
import { login } from './Login.api';
import "./Login.css";

interface LoginState {
  username: string;
  password: string;
  redirectToHomePage: boolean;
};

class Login extends React.Component<object, LoginState> {
  constructor(props: object) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirectToHomePage: false
    };
    
  }

  // TODO: check the redirect
  redirectToHomePage = (): void => { redirect('/'); };

  onSubmit = async () => {
    const { username, password } = this.state;
    const userType = await login(username, password);
    if (userType != USER_TYPES.none) {
      //this.setState({ redirectToHomePage: true });
      this.redirectToHomePage();
    } else {
      alert("wrong username or password");
      console.log("Details do not match!");
    }
  };

  render() {
    // if (this.state.redirectToHomePage) {
    //   redirect('/');
    // }
    return (
      <div className="body">
        <div className="login-form">
          <form onSubmit={this.onSubmit} id="form1">

            <h1 className='h1'>Login</h1>
            <div className="content">

              <div className='input-field'>
                <input
                  className='input' type="text" required placeholder="Username" name="name" id="name"
                  onChange={e => this.setState({ username: e.target.value })} value={this.state.username}
                />
              </div>
              <div className='input-field'>
                <input className='input' type="password" required placeholder="Password" name="password" id="password"
                  onChange={a => this.setState({ password: a.target.value })} value={this.state.password}
                />
              </div>

            </div>
            <div className="action">


              <button className='buttom' type="submit" form="form1" value="LOGIN">LOGIN</button>
            </div>


          </form>
        </div>
      </div>

    );
  }
}

export default Login;
