import React, { FunctionComponent, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddItem from '../componants/AddItem/AddItem';
import AdminRecieptsUsers from '../componants/AdminRecieptUsers/AdminRecieptUsers';
import Cart from '../componants/Cart/Cart';
import Header from '../componants/Header/Header';
import HeaderAdmin from '../componants/HeaderAdmin/HeaderAdmin';
import ItemReciept from '../componants/ItemReciept/ItemReciept';
import LoginForm from '../componants/Login/LoginForm';
import Payment from '../componants/Payment/Payment';
import Reciepts from '../componants/Reciept/Reciepts';
import About from '../Views/About/About';
import Home from '../Views/Home/Home';
import HomeAdmin from '../Views/HomeAdmin/HomeAdmin';
import serverRequests from './app.api';
import { UserType, USER_TYPES } from './App.consts';
import './app.css';

const App: FunctionComponent = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(USER_TYPES.none);
  const [username, setUsername] = useState<string>("");

  const login = async (username: string, password: string): Promise<void> => {
    const userType = await serverRequests.loginServerRequest(username, password);
    if (userType != USER_TYPES.none) {
      setUserType(userType);
      setAuthenticated(true);
    } else {
      alert("wrong username or password");
      console.log("Details do not match!");
    }
  };

  const readCookie = async (): Promise<void> => {
    serverRequests.cookie_serverRequest().then((value) => {
      if (value != "false") {
        const splitted = value.split(":");

        setAuthenticated(true);
        setUserType(Number(splitted[1]) == USER_TYPES.admin ? USER_TYPES.admin : USER_TYPES.client);
        setUsername(splitted[0]);
      }
    });
  };

  readCookie();
  if (authenticated) {
    if (userType == 1) {
      return (
        <Router >
          <Header />
          <div className='container'>
            <Routes>
              <Route path='/' element={<Home username={username} />}>

              </Route>
              <Route path='/about' element={<About />}>

              </Route>
              <Route path='/cart' element={<Cart />}>

              </Route>
              <Route path='/pay' element={<Payment />}>

              </Route>
              <Route path='/reciepts/:id' element={<Reciepts />}>

              </Route>
              <Route path='/reciepts/:id/reciept_item/:id' element={<ItemReciept />}>

              </Route>

            </Routes>
          </div>
        </Router>);
    }
    else {
      return (
        <Router>
          <HeaderAdmin />
          <div className='container'>
            <Routes>
              <Route path='/' element={<HomeAdmin username={username} />}>

              </Route>
              <Route path='/about' element={<About />}>

              </Route>
              <Route path='/cart' element={<Cart />}>

              </Route>
              <Route path='/pay' element={<Payment />}>

              </Route>
              <Route path='/addItem' element={<AddItem />}>

              </Route>
              <Route path='/AdminReciepts' element={<AdminRecieptsUsers />}>

              </Route>
              <Route path='/AdminReciepts/reciepts/:id' element={<Reciepts />}>

              </Route>
              <Route path='/AdminReciepts/reciepts/:id/reciept_item/:id' element={<ItemReciept />}>


              </Route>
            </Routes>
          </div>
        </Router>);
    }
  }
  else {
    return (<LoginForm Login={login} error={"Details do not match!"} />);
  }
};



export default App;
