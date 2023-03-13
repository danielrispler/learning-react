import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import './NavigationAdmin.css';
import{
    Link
  } from "react-router-dom";
import {deleteCookie} from "./NavigationAdmin.api";

  

function NavigationAdmin(){
    const [showMenu, setShowMenu] = useState(false)
    const Logout = () =>{
        deleteCookie()
        window.location.reload();
      }

    let menu 
    let menuMask
    if(showMenu){
        menu = <div className="symbol"> 
        <div className="theMenu">
            The menu
        </div>
        <div>
            <div>
                <Link to="/" className="link"  onClick={()=>{setShowMenu(false)}}> Home </Link>
            </div>
            <div>
                <Link to="/AdminReciepts" className="link" onClick={()=> {setShowMenu(false)}}> old reciepts </Link>
            </div>
            <div>
                <Link to="/about" className="link" onClick={()=> {setShowMenu(false)}}> About </Link>
            </div>

            
        </div>
            <button className='logout' onClick={Logout}>Logout</button>
        </div>
        menuMask = 
        <div 
            className="mask"
            onClick={() => setShowMenu(false)}
        > 
        </div>
    }
    return(
        <nav>
            <FontAwesomeIcon
            icon={faBars}
            onClick={() => {setShowMenu(!showMenu);  }}
            />

            {menuMask}

            {menu}
        </nav>
    )
}


export default NavigationAdmin