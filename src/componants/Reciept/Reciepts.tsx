import React from 'react'
import "./Reciepts.css"
import { Link } from 'react-router-dom';
import {reciepts} from './Reciepts.api';
import { RecieptSession } from 'src/common/common.types';
import DatePicker from "react-datepicker";

interface MyState {    
    reciepts: RecieptSession []; 
    user_id:string
    fromDate: Date|null
    untilDate: Date|null

};

class Reciepts extends React.Component<object,MyState> {
    constructor(props:object) {
        super(props);
        const myArray = window.location.href.split("/");
        if(myArray[5] == undefined){
            this.state = {
                reciepts: [],
                user_id: myArray[4] ,
                fromDate: null,
                untilDate: null

            }
        }else{
            this.state = {
                reciepts: [],
                user_id: myArray[5] ,
                fromDate: null,
                untilDate: null
            }
        }        
    }
    
    async componentDidMount() {
        console.log(this.state.user_id)
        this.setState({reciepts: await reciepts(this.state.user_id)});
    }

    checkFromDate=():boolean=>{
        if(!this.state.fromDate||isNaN(this.state.fromDate.getTime()))
            return true
        return false   
    }
    checkUntilDate=():boolean=>{
        if(!this.state.untilDate||isNaN(this.state.untilDate.getTime()))
            return true
        return false   
    }

    render(){
        return (
            <div className='page'>
                <h1>all the reciepts</h1>
                <div className='datesContainer'>
                    <div>
                        <label htmlFor="FromDate">From</label>
                        <input type="date" name="FromDate" id="FromDate"onChange={e => this.setState({fromDate: new Date(e.target.value) })}></input>
                    </div>
                    <div className='marginLeft'>
                        <label htmlFor="UntilDate">Until</label>
                        <input type="date" name="UntilDate" id="UntilDate" onChange={e => this.setState({untilDate: new Date(e.target.value) })}></input>
                    </div>  
                </div>
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
                        var itemDate = new Date(item.date)
                        if((this.checkFromDate()&& this.checkUntilDate())|| (this.checkFromDate() && this.state.untilDate && itemDate <= this.state.untilDate) || (this.state.fromDate && itemDate >= this.state.fromDate && this.checkUntilDate()) || (this.state.fromDate && itemDate >= this.state.fromDate &&this.state.untilDate && itemDate <= this.state.untilDate)){
                            var minutes = itemDate.getMinutes().toString()
                            var hour = itemDate.getHours().toString()
                            if(minutes.length === 1){
                                minutes = `0${minutes}`
                            }
                            if(hour.length === 1){
                                hour = `0${hour}`
                            }
                            const date =  `${itemDate.getDate().toString()}/${(itemDate.getMonth()+1).toString()}/${itemDate.getFullYear().toString()}`
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
                        }
                    })}
                    
                    
                </tbody>
                </table>
            </div>
        )
    }
}

export default Reciepts