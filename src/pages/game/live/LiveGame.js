import React from 'react';
import Board from '../../../components/board/Board';
import Button from '../../../components/button/Button';
import GameState from '../../../enums/GameState';
import { PlayerColor } from '../../../enums/PlayerColor';
import Game from '../base/Game';
import socket from '../../../socketApi';
import './live_game.scss';
import { toast } from 'react-toastify';
import PlayerInfo from '../../../components/player_info/PlayerInfo';

class LiveGame extends Game {
    componentDidMount() {
        if (socket || !socket.connected) {
            socket.joinSession(this.props.id);
        }
        super.componentDidMount();
        this.registerListeners();
    }

    componentWillUnmount() {
        this.unregisterListeners();
    }

    registerListeners() {
        this.unregisterListeners();
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
    }

    render() {
        switch (this.state.gameState) {
            case GameState.PLAYING:
                return (
                    <div className='page game'>
                        <div className='player-info-container'>
                            {
                                this.state.players[PlayerColor.GREEN] && 
                                <PlayerInfo 
                                    name={PlayerColor.GREEN === this.state.playerColor ? 'You' : this.state.players[PlayerColor.GREEN]}
                                    playerColor={PlayerColor.GREEN}
                                    current={PlayerColor.GREEN === this.state.currentPlayer}
                                />
                            }
                            {
                                this.state.players[PlayerColor.BLUE] && 
                                <PlayerInfo 
                                    name={PlayerColor.BLUE === this.state.playerColor ? 'You' : this.state.players[PlayerColor.BLUE]}
                                    playerColor={PlayerColor.BLUE}
                                    current={PlayerColor.BLUE === this.state.currentPlayer}
                                />
                            }
                        </div>
                        <Board lastMove={this.state.lastMove} playerColor={this.state.playerColor} pieces={this.state.pieces}/>
                        <div className='player-info-container'>
                            {
                                this.state.players[PlayerColor.RED] && 
                                <PlayerInfo 
                                    name={PlayerColor.RED === this.state.playerColor ? 'You' : this.state.players[PlayerColor.RED]}
                                    playerColor={PlayerColor.RED}
                                    current={PlayerColor.RED === this.state.currentPlayer}
                                />
                            }
                            {
                                this.state.players[PlayerColor.YELLOW] && 
                                <PlayerInfo 
                                    name={PlayerColor.YELLOW === this.state.playerColor ? 'You' : this.state.players[PlayerColor.YELLOW]}
                                    playerColor={PlayerColor.YELLOW}
                                    current={PlayerColor.YELLOW === this.state.currentPlayer}
                                />
                            }
                        </div>
                    </div>
                );
            case GameState.PAUSED:
                return (
                    <div className='page lobby'>
                        <div className='lobby-info'>
                            <h1>Game Paused</h1>
                            <div className='player-container'>
                                {
                                    Object.keys(PlayerColor).map((color) => (
                                        <div key={color} className={`player ${color}`}>
                                            <h1>{color}</h1>
                                            <h2>{color === this.state.playerColor ? 'You' : this.state.players[color] || <span className='BLACK'>Waiting...</span>}</h2>
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
                        <div className='message'>
                            <h1 className={this.state.winner}>{this.state.players[this.state.winner]} won the game!</h1>
                            <div className='options'>
                                <Button text="Back to Home" onClick={() => this.props.history.push('/')}/>
                                <Button text="View Replay" onClick={() => location.reload()}/>
                            </div>
                        </div>
                    </div>
                );
            case GameState.WAITING:
            default:
                return (
                    <div className='page lobby'>
                        <div className='lobby-info'>
                            <div className='player-container'>
                                {
                                    Object.keys(PlayerColor).map((color) => (
                                        <div key={color} className={`player ${color}`}>
                                            <h1>{color}</h1>
                                            <h2>{color === this.state.playerColor ? 'You' : this.state.players[color] || <span className='BLACK'>Waiting...</span>}</h2>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='button-container'>
                                <Button text='Copy Invite Link' onClick={() => navigator.clipboard.writeText(process.env.REACT_APP_URL_SHORT + `/game/${sessionStorage.getItem('lobbyCode')}`)}/>
                                <Button text='Add AI' onClick={() => socket.addAi()}/>
                            </div>
                        </div>
                    </div>
                );
        }
    }
}
 
export default LiveGame;
