import { isNil } from 'ramda';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { User, UserType, USER_TYPES } from 'src/common/common.types';
import AddItem from '../componants/AddItem/AddItem';
import AdminRecieptsUsers from '../componants/AdminRecieptUsers/AdminRecieptUsers';
import Cart from '../componants/CartPage/CartPage';
import Header from '../componants/Header/Header';
import HeaderAdmin from '../componants/HeaderAdmin/HeaderAdmin';
import ItemReciept from '../componants/ItemReciept/ItemReciept';
import Login from '../componants/Login/Login';
import Payment from '../componants/Payment/Payment';
import Reciepts from '../componants/Reciept/Reciepts';
import About from '../Views/About/About';
import Home from '../Views/Home/Home';
import HomeAdmin from '../Views/HomeAdmin/HomeAdmin';
import './app.css';
import { getUserFromCookie } from './App.utils';

const App: FunctionComponent = () => {
  const [username, setUsername] = useState("");
  const [permission, setPermission] = useState<UserType>(USER_TYPES.none);

  useEffect(()=>{
    const user = getUserFromCookie()
    console.log("user",user)
    if(user!=""&&!isNil(user)){
      console.log("user",user)
      const splitUser = user.split(":")
      setUsername(splitUser[0])
      setPermission(("2" == splitUser[1])?USER_TYPES.admin:USER_TYPES.client)
    }
    
  }, [])

  if (username!=""&&!isNil(username)) {
    if (permission == USER_TYPES.client) {
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
  
  return <Login/>;
};



export default App;
