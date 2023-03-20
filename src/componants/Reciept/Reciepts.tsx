import React from 'react'
import "./Reciepts.css"
import { Link } from 'react-router-dom';
import {reciepts} from './Reciepts.api';
import { RecieptSession } from 'src/common/common.types';

interface MyState {    
    reciepts: RecieptSession []; 
    user_id:string
};

class Reciepts extends React.Component<object,MyState> {
    constructor(props:object) {
        super(props);
        const myArray = window.location.href.split("/");
        if(myArray[5] == undefined){
            this.state = {
                reciepts: [],
                user_id: myArray[4] 
            }
        }else{
            this.state = {
                reciepts: [],
                user_id: myArray[5] 
            }
        }        
    }
    
    async componentDidMount() {
        console.log(this.state.user_id)
        this.setState({reciepts: await reciepts(this.state.user_id)});
    }

    render(){
        return (
            <div className='page'>
                <h1>all the reciepts</h1>
                <table id="customers">
                <tbody>
                <tr>
                    <th>Reciept Id</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Total Price</th>
                </tr>
                    {this.state.reciepts != null &&  
                     this.state.reciepts.map((item) => {
                        var minutes = new Date(item.date).getMinutes().toString()
                        var hour = new Date(item.date).getHours().toString()
                        if(minutes.length === 1){
                            minutes = `0${minutes}`
                        }
                        if(hour.length === 1){
                            hour = `0${hour}`
                        }
                        const date =  `${new Date(item.date).getDate().toString()}/${new Date(item.date).getMonth().toString()}/${new Date(item.date).getFullYear().toString()}`
                        const time = `${hour}:${minutes}`
                        if(this.state.user_id === "0"){
                            return (
                                <tr >
                                        <td><Link to={`/reciepts/0/reciept_item/${item.recieptId}`} state={item.recieptId}>{item.recieptId}</Link></td>
                                        <td>{date}</td>
                                        <td>{time}</td>
                                        <td>{item.totalPrice} &#8362;</td>
                                </tr>
                            );
                        }else{
                            return (
                                <tr >
                                        <td><Link to={`/AdminReciepts/reciepts/${this.state.user_id}/reciept_item/${item.recieptId}`} state={item.recieptId}>{item.recieptId}</Link></td>
                                        <td>{date}</td>
                                        <td>{time}</td>
                                        <td>{item.totalPrice} &#8362;</td>
                                </tr>
                            );
                        }
                        
                    })}
                    
                    
                </tbody>
                </table>
            </div>
        )
    }
}

export default Reciepts