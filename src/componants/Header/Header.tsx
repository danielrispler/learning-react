import React from "react";
import './header.css';
import Navigation from "../Navigation/Navigation";
import { Link } from 'react-router-dom';
import { Website } from "./header.consts";


function Header(){
    return(
        <div className="headHead ">
            <div className="spaceNav">
                <Navigation/>
            </div>
            
            <Link to="/">
                <a id="header-menu-btn" >{Website.title}</a>
            </Link>
            
        </div>
    )
}


export default Header