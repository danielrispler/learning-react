import React from 'react'
import "./Login.css"

type Props = {
  Login: Function 
  error: string

}

type MyState = {    
  name:string
  password:string
  
};
class LoginForm extends React.Component<Props,MyState> {
  constructor(props:Props) {
    super(props);
    this.state = {
      name: "",
      password: ""
    };
    this.submitHandler = this.submitHandler.bind(this);
  }
  
  submitHandler = () =>{
    this.props.Login(this.state.name, this.state.password)
  }

  render(){
    return (
      <div className= "body">
        <div className="login-form">
        <form onSubmit={this.submitHandler} id="form1">
          
              <h1 className='h1'>Login</h1>
              <div className="content">
                
                <div className='input-field'>
                  <input className='input' type="text" required placeholder="Username" name="name" id="name" onChange={e => this.setState({name: e.target.value})} value={this.state.name}/>
                </div>
                <div className='input-field'>
                  <input className='input' type="password" required placeholder="Password" name="password" id="password" onChange={a => this.setState({password: a.target.value})} value={this.state.password}/>
                </div>
                
                </div>
              <div className="action">
                
                
                <button className='buttom' type="submit" form="form1" value="LOGIN">LOGIN</button>
              </div>
              
          
        </form>
        </div>
      </div>
    
  )
  }
}

export default LoginForm