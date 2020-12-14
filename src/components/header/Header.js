import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './header.scss';

class Header extends Component {
    render() { 
        return (
            <div className='header'>
                <div className='logo' onClick={() => this.props.history.push('/')}>
                    <h1>FFA-Checkers</h1>
                </div>
            </div>
        );
    }
}
 
export default withRouter(Header);
