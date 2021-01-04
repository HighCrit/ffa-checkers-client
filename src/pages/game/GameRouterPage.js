import React, { Component } from 'react';
import LiveGame from './live/LiveGame';
import ReplayGame from './replay/ReplayGame';
import './game-router.scss';
import Button from '../../components/button/Button';

class GameRouterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            replay: false,
            error: false,
            message: ''
        };
    }

    componentDidMount() {
        if (this.props.match.params.code) {
            fetch(process.env.REACT_APP_API_URL + '/replays/' + this.props.match.params.code).then((res) => {
                if (res.ok) {
                    this.setState({ loading: false, replay: true });
                } else {
                    switch (res.status) {
                        case 404:
                            this.setState({ loading: false });
                            break;
                        case 422:
                            this.setState({
                                loading: false,
                                error: true,
                                message: 'Malformed Lobby Code'
                            });
                            break;
                        case 502: 
                            this.setState({
                                loading: false,
                                error: true,
                                message: 'Failed to connect to the server'
                            });
                            break;
                        default:
                            this.setState({
                                loading: false,
                                error: true,
                                message: 'Failed to load game'
                            });
                    }
                    
                }
            }).catch((err) => {
                console.error(err);
                if (err.message === 'Failed to fetch') {
                    this.setState({
                        loading: false,
                        error: true,
                        message: 'Failed to connect to the server'
                    });
                }
            });
        }
    }

    render() { 
        if (this.state.loading) {
            return (
                <div className='page router'>
                    <div className='message'>
                        Loading Game...
                    </div>
                </div>
            );
        } else if (this.state.error) {
            return (
                <div className='page router'>
                    <div className='message'>
                        <h3>Error</h3>
                        {this.state.message}
                        <Button text="Back to Home" onClick={() => this.props.history.push('/')}/>
                    </div>
                </div>
            );
        } else if (this.state.replay) {
            return <ReplayGame id={this.props.match.params.code}/>;
        } else {
            return <LiveGame id={this.props.match.params.code}/>;
        }
    }
}
 
export default GameRouterPage;
