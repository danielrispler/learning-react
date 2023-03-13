import React from "react";
import ItemAdmin from "../../componants/ItemAdmin/ItemAdmin"
import './HomeAdmin.css';
import { Link } from "react-router-dom";
import {readCookie,nonDeleteitems} from './HomeAdmin.api';
import { Item } from "src/common/common.types";

type Props = {
  username:string
}

type MyState = {    
  items: Item []; 
  selectedItem:string
  
};

class HomeAdmin extends React.Component<Props,MyState> {
    constructor(props:Props) {
      super(props);
      this.state = {
        items: [],
        selectedItem:""
      };

      this.filter = this.filter.bind(this);
    }
     
    async componentDidMount() {
      this.setState({items : await nonDeleteitems()})
      if(await readCookie() == "false"){
        window.location.reload()
      }
      
    }
    filter(a:React.ChangeEvent<HTMLInputElement>):(void) {
      this.setState({selectedItem: a.target.value})
    }
    
    render() {
      return (
        <div  >
          <h2>home page admin, WELCOME {this.props.username}</h2>

          <input type="text" id="myInput"  placeholder="Search for names.." onChange={this.filter} title="Type in a item name"/>
          <div className="moveContainerLeft">
            <div className="row">
              <div className="container">
                {this.state.items.map((item) => {
                  if(this.state.selectedItem == "" ||  item.item.startsWith(this.state.selectedItem)){
                    return <ItemAdmin item={item} />;
                  }
                })}
              </div>
            </div>
          </div>
          <Link to="/addItem">
                  <button className='additem' >add item</button>
          </Link>
          <Link to="/cart">
            <button id="header-menu-btn" className='reciept'>Cart</button>
          </Link>
        </div>
      );
    }
  }

  export default HomeAdmin