import React from 'react'
import "./Reciepts.css"
import { Link } from 'react-router-dom';
import serverRequests from './Reciepts.api';


type Props = {
    
}

type Reciept_Session= {
	userid    : number       
	recieptid  :number      
	totalprice: number      
	date      : Date 
}

type MyState = {    
    
    reciepts: Reciept_Session []; 
    user_id:string
     
    
};

class Reciepts extends React.Component<Props,MyState> {
    constructor(props:Props) {
        super(props);
        const current_url = window.location.href
        const myArray = current_url.split("/");
        if(myArray[5] == undefined){
            this.state = {
                reciepts: [],
                user_id: myArray[4]
            };
        }else{
            this.state = {
                reciepts: [],
                user_id: myArray[5]
            };
        }
    }
    
    componentDidMount() {
        serverRequests.reciepts(this.state.user_id).then( (response) => {
            this.setState({
                reciepts: response
              });
          });
          serverRequests.readCookie().then( (response) => {
              if(response == "false"){
                    window.location.reload()
            }
          })
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
                        if(minutes.length == 1){
                            minutes = "0" + minutes
                        }
                        if(hour.length == 1){
                            hour = "0" + hour
                        }
                        const date =  new Date(item.date).getDate().toString() + "/" + new Date(item.date).getMonth().toString()+ "/" + new Date(item.date).getFullYear().toString()
                        const time = hour + ":" + minutes
                        if(this.state.user_id == "0"){
                            return (
                                <tr >
                                        <td><Link to={"/reciepts/0/reciept_item/" + item.recieptid} state={item.recieptid}>{item.recieptid}</Link></td>
                                        <td>{date}</td>
                                        <td>{time}</td>
                                        <td>{item.totalprice} &#8362;</td>
                                </tr>
                            );
                        }else{
                            return (
                                <tr >
                                        <td><Link to={"/AdminReciepts/reciepts/" + this.state.user_id+ "/reciept_item/" + item.recieptid} state={item.recieptid}>{item.recieptid}</Link></td>
                                        <td>{date}</td>
                                        <td>{time}</td>
                                        <td>{item.totalprice} &#8362;</td>
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