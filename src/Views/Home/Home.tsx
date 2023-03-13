import React from "react";
import { Link } from "react-router-dom";
import { Item } from "src/common/common.types";
import Product from "../../componants/Product/Product";
import serverRequest from './Home.api';
import './home.css';

interface Props {
  username: string;
};

interface MyState {
  items: Item[];
  userName: string;
  selectedItem: string;
};

class Home extends React.Component<Props, MyState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      items: [],
      userName: "",
      selectedItem: ""

    };

    this.filter = this.filter.bind(this);

  }

  filter(a: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ selectedItem: a.target.value });
  }

  componentDidMount(): void {
    serverRequest.itemsServerRequest().then((value) => { this.setState({ items: value }); });
    serverRequest.cookieServerRequest().then((value) => {
      if (value != "false") {
        const splitted = value.split(":");
        if (splitted[0] != this.props.username) {
          window.location.reload();
        }
      } else {
        window.location.reload();
      }
      console.log()
    });
  }

  render() {
    return (
      <div id="123" >
        <h2>WELCOME {this.props.username}</h2>
        <input type="text" id="myInput" placeholder="Search for names.." onChange={this.filter} title="Type in a item name" />
        <div className="moveContainerLeft">
          <div className="row">
            <div className="container">
              {this.state.items.map((item) => {
                if (this.state.selectedItem == "" || item.item.startsWith(this.state.selectedItem)) {
                  return <Product item={item} />;
                }
              })}
            </div>
          </div>
        </div>
        <Link to="/cart">
          <button id="header-menu-btn" className='reciept'>Cart</button>
        </Link>
      </div>
    );
  }
}

export default Home;