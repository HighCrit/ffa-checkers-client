import React, { Component } from 'react';
import socket from '../../socketApi';
import LiveGame from './live/LiveGame';

class GameRouterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            replay: false
        };
    }

    componentDidMount() {
        if (this.props.match.params.code) {
            // if game code isn't linked to stored game
            this.setState({ loading: false, replay: false });

            socket.init();
            if (!this.props.location.state || !this.props.location.state.connected) {
                socket.joinSession(this.props.match.params.code);
            }
        }
        
    }

    render() { 
        if (this.state.loading) {
            return (
                <div className='page'>
                    Loading game
                </div>
            );
        } else if (this.state.replay) {
            return (
                <div className='page'>
                    This feature isn't implemented yet
                </div>
            );
        } else {
            return <LiveGame/>;
        }
    }
}
 
export default GameRouterPage;
