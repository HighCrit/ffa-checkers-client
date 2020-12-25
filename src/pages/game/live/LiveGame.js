import React from 'react';
import Board from '../../../components/board/Board';
import Button from '../../../components/button/Button';
import GameState from '../../../enums/GameState';
import { PlayerColor } from '../../../enums/PlayerColor';
import Game from '../base/Game';
import socket from '../../../socketApi';
import './live_game.scss';
import { toast } from 'react-toastify';

class LiveGame extends Game {
    componentDidMount() {
        super.componentDidMount();
        this.registerListeners();
    }

    componentWillUnmount() {
        this.unregisterListeners();
    }

    registerListeners() {
        socket.socket.on('game-state', (data) => this.setGameState(data));
        socket.socket.on('game-your-color', (data) => this.setPlayerColor(data));
        socket.socket.on('game-board', (data) => this.constructBoard(data));
        socket.socket.on('game-move-set', (data) => this.setMoves(data));
        socket.socket.on('game-won-by', (data) => this.setWinner(data));

        socket.socket.on('game-current-player', (data) => {
            this.setCurrentPlayer(data);
            if (this.state.playerColor === data) {
                toast('It\'s your turn', { autoClose: 3000 });
            }
        });

        socket.socket.on('game-move-result', (data) => {
            if (!data.success) {
                return;
            }
            this.executeMove(data.move);
        });

        socket.socket.on('game-piece-promotion', (data) => {
            this.state.pieces[data].isKing = true;
            this.setState({ pieces: this.state.pieces });
        });

        /* Lobby Info Events */

        socket.socket.on('lobby-player-joined', (data) => {
            this.setPlayers(data.players);
        });

        socket.socket.on('lobby-player-left', (data) => {
            this.setPlayers(data.players);
        });

        // Let the server know we're done loading
        socket.socket.emit('lobby-loaded');
    }

    unregisterListeners() {
        if (!socket.socket) { 
            return;
        }
        socket.socket.off('game-state');
        socket.socket.off('game-your-color');
        socket.socket.off('game-board');
        socket.socket.off('game-current-player');
        socket.socket.off('game-move-set');
        socket.socket.off('game-move-result');
        socket.socket.off('game-won-by');
        socket.socket.off('game-piece-promotion');
    }

    render() {
        switch (this.state.gameState) {
            case GameState.PLAYING:
                return (
                    <div className='page game'>
                        <Board playerColor={this.state.playerColor} pieces={this.state.pieces}/>
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
