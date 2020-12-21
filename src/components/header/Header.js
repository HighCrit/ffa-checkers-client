import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './header.scss';

class Header extends Component {
    constructor(props) {
        super(props);

        this.goToHome = this.goToHome.bind(this);
    }

    goToHome() {
        this.props.history.push('/');
    }

    render() { 
        return (
            <div className='header'>
                <div className='logo' onClick={this.goToHome}>
                    <h1>FFA-Checkers</h1>
                </div>
            </div>
        );
    }
}
 
export default withRouter(Header);
