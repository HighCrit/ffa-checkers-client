import React, { Component } from 'react';
import socket from '../../socketApi';
import LiveGame from './live/LiveGame';
import ReplayGame from './replay/ReplayGame';

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
            fetch(process.env.REACT_APP_API_URL + '/replays/' + this.props.match.params.code).then((res) => {
                if (res.status === 200) {
                    this.setState({ loading: false, replay: true });
                } else {
                    this.setState({ loading: false, replay: false }, () => {
                        // Setup sockets etc. because this code doesn't go to a replay
                        if (!this.props.location.state || !this.props.location.state.connected) {
                            socket.joinSession(this.props.match.params.code);
                        }
                    });
                }
            }).catch(console.error);
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
            return <ReplayGame id={this.props.match.params.code}/>;
        } else {
            return <LiveGame/>;
        }
    }
}
 
export default GameRouterPage;
