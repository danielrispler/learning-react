import React from 'react';
import { Link } from 'react-router-dom';
import serverRequest, { User } from './AdminRecieptUsers.api';
import "./AdminRecieptUsers.css";

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

    componentDidMount() {
        serverRequest.usersIds().then((value) => { this.setState({ users: value }); });
        serverRequest.readCookie().then((value) => {
            if (value == "false") {
                window.location.reload();
            }
        });
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
                            this.state.users.map(({ id, name }) => {
                                return (
                                    <tr >
                                        <td><Link to={`/AdminReciepts/reciepts/${id}`} state={id}>{id}</Link></td>
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