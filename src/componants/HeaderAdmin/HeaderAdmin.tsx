import React from "react";
import './HeaderAdmin.css';
import NavigationAdmin from "../NavigationAdmin/NavigationAdmin";
import { Link } from 'react-router-dom';
import { Website } from "./HeaderAdmin.consts";



function HeaderAdmin(){
    return(
        <div className="headHead ">
            <div className="spaceNav">
                <NavigationAdmin/>
            </div>
            
            <Link to="/">
                <a id="header-menu-btn" >{Website.title}</a>
            </Link>
            
        </div>
    )
}


export default HeaderAdmin