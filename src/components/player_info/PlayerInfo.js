import React, { Component } from 'react';
import './player_info.scss';

class PlayerInfo extends Component {
    render() { 
        return (
            <div className={`player-info ${this.props.playerColor} ${this.props.current ? '' : 'negative'}`}>
                <h1>{this.props.name}</h1>
            </div>
        );
    }
}
 
export default PlayerInfo;
