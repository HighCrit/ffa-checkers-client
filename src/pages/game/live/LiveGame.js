import React, { Component } from 'react';
import Board from '../../../components/board/Board';
import Button from '../../../components/button/Button';
import GameState from '../../../enums/GameState';
import { PlayerColor } from '../../../enums/PlayerColor';
import game from '../../../game/Game';
import socket from '../../../socketApi';
import './live_game.scss';

class LiveGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameState: GameState.WAITING,
            players: {},
            playerColor: null,
            currentPlayer: null,
            winner: null,
            refresh: true
        };
    }

    componentDidMount() {
        game.setGame(this);
        game.registerListeners();
    }

    componentWillUnmount() {
        game.unregisterListeners();
        game.reset();
    }

    render() {
        switch (game.gameState) {
            case GameState.PLAYING:
                return (
                    <div className='page game'>
                        <Board/>
                    </div>
                );
            case GameState.PAUSED:
                return (
                    <div className='page game'>
                        <div className='lobby-info'>
                            <h1>Game Paused</h1>
                            <div className='player-container'>
                                {
                                    Object.keys(PlayerColor).map((color) => (
                                        <div key={color} className={`player ${color}`}>
                                            <h1>{color}</h1>
                                            <span>{color === this.state.playerColor ? 'You' : this.state.players[color] || <span className='BLACK'>Waiting...</span>}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                );
            case GameState.ENDED:
                return (
                    <div className='page game'>
                        
                    </div>
                );
            case GameState.WAITING:
            default:
                return (
                    <div className='page game'>
                        <div className='lobby-info'>
                            <div className='player-container'>
                                {
                                    Object.keys(PlayerColor).map((color) => (
                                        <div key={color} className={`player ${color}`}>
                                            <h1>{color}</h1>
                                            <span>{color === this.state.playerColor ? 'You' : this.state.players[color] || <span className='BLACK'>Waiting...</span>}</span>
                                        </div>
                                    ))
                                }
                                <Button text='Add AI' onClick={() => socket.addAi()}/>
                            </div>
                        </div>
                    </div>
                );
        }
    }
}
 
export default LiveGame;
