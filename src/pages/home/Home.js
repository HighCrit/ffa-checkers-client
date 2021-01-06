import React, { Component } from 'react';
import Button from '../../components/button/Button';
import socket from '../../socketApi';
import './home.scss';

class Home extends Component {
    componentDidMount() {
        socket.init();
    }

    render() { 
        return ( 
            <div className='page home'>
                <div className='menu'>
                    <div className='menu-item'>
                        <h1 className='title'>Create Game</h1>
                        <div className='content'>
                            <p>Create a game and invite up-to 3 friends by sharing the URL!</p>
                            <Button text='Create...' onClick={() => socket.createSession()}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default Home;
