import React, { Component } from 'react';
import Board from '../../../components/board/Board';
import GameState from '../../../enums/GameState';
import game from '../../../game/Game';
import socket from '../../../socketApi';
import './live_game.scss';

class LiveGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameState: GameState.WAITING
        };
        
        game.setGame(this);
    }

    componentDidMount() {
        socket.init();
        game.registerListeners();
    }

    render() {
        switch (game.gameState) {
            case GameState.PLAYING:
                return (
                    <div className='page game'>
                        <Board/>
                    </div>
                );
            case GameState.WAITING:
            default:
                return (
                    <div className='page game'>
                        <div className=''>

                        </div>
                    </div>
                );
        }
    }
}
 
export default LiveGame;
