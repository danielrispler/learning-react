import React, {useState} from 'react'
import "./Payment.css"
import { Link } from 'react-router-dom';

class Payment extends React.Component<object,object> {
    constructor(props:object) {
        super(props);
    }
    render(){
        return (
          <div className='wrapper-1'>
            <div className='wrapper-2'>
                <div className='header'>
                    thank you for buying!
                </div>
                <Link to="/">
                    <button id="header-menu-btn" className='return'>thank you</button>
                </Link>
            </div>   
          </div> 
        )
    }
}

export default Payment