import React from 'react';
import { Link } from 'react-router-dom';
import {usersIds,readCookie } from './AdminRecieptUsers.api';
import "./AdminRecieptUsers.css";
import {User} from './AdminRecieptUsers.types'

interface State {
    users: User[];
};

class AdminRecieptUsers extends React.Component<object, State> {
    constructor(props: object) {
        super(props);
        this.state = {
            users: [],
        };
    }

    async componentDidMount() {
        this.setState({users: await usersIds()}) 
        if (await readCookie() == "false") {
            window.location.reload();
        }
        console.log("users",this.state.users)
        
    }

    render() {
        return (
            <div className='page'>
                <h1>all the users</h1>

                <table id="customers">
                    <tbody>
                        <tr>
                            <th>User Id</th>
                            <th>Name</th>
                        </tr>
                        {this.state.users != null &&
                            this.state.users.map(({ _id, name }) => {
                                return (
                                    <tr >
                                        <td><Link to={`/AdminReciepts/reciepts/${_id}`} state={_id}>{_id}</Link></td>
                                        <td>{name} </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default AdminRecieptUsers;