import React from "react";
import ItemAdmin from "../../componants/ItemAdmin/ItemAdmin"
import './HomeAdmin.css';
import { Link } from "react-router-dom";
import serverRequest from './HomeAdmin.api';

type Props = {
  username:string
}
type ItemType = {
_id  :      number    
item  :    string 
price :    number    
imgNumber :number    
left     : number        
itemId : number    
}

type MyState = {    
  items: ItemType []; 
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
    
    
    
    
    componentDidMount() {
      serverRequest.items_serverRequest().then((value) => {this.setState({items : value})})
      serverRequest.cookie_serverRequest().then((value) => {
        if(value != "false"){
          const splitted = value.split(":"); 
            if(splitted[0] != this.props.username){
              window.location.reload()
            }
        }else{
          window.location.reload()
        }
      })
    }
    filter(a:React.ChangeEvent<HTMLInputElement>):(any) {
      if(a.target.value==""){
        this.setState({selectedItem: ""})
      }else{
        this.setState({selectedItem: a.target.value})
      }

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