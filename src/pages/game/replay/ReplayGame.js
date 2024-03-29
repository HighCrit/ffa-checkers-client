import React from 'react';
import { PlayerColor } from '../../../enums/PlayerColor';
import PlayerInfo from '../../../components/player_info/PlayerInfo';
import Board from '../../../components/board/Board';
import Game from '../base/Game';

import './replay_game.scss';
import Button from '../../../components/button/Button';

class ReplayGame extends Game {
    constructor(props) {
        super(props);

        this.onKeyDown = this.onKeyDown.bind(this);
        this.nextMove = this.nextMove.bind(this);
        this.prevMove = this.prevMove.bind(this);
        this.hasNextMove = this.hasNextMove.bind(this);
        this.hasPrevMove = this.hasPrevMove.bind(this);
    }

    componentDidMount() {
        this.setState({
            currentMove: -1,
            currentPlayer: PlayerColor.YELLOW
        });
        this.constructBoard(this.props.initialFen);

        document.addEventListener('keydown', this.onKeyDown);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 37: // LEFT ARROW
                this.prevMove();
                break;
            case 39: // RIGHT ARROW
                this.nextMove();
                break;
            default:
                break;
        }
    }

    nextMove() {
        if (this.hasNextMove()) {
            this.executeMove(this.props.moves[this.state.currentMove + 1]);
            this.setState({ currentMove: this.state.currentMove + 1 });
            if (this.hasNextMove()) {
                this.setState({ currentPlayer: this.state.pieces[this.props.moves[this.state.currentMove + 1].start].playerColor });
            }
        }
    }

    prevMove() {
        if (this.hasPrevMove()) {
            this.undoMove(this.props.moves[this.state.currentMove]);
            this.setState({ currentMove: this.state.currentMove - 1, lastMove: this.props.moves[this.state.currentMove - 1] });
            if (this.hasNextMove()) {
                this.setState({ currentPlayer: this.state.pieces[this.props.moves[this.state.currentMove + 1].start].playerColor });
            }
        }
    }

    hasNextMove() {
        return this.props.moves && this.state.currentMove < this.props.moves.length - 1;
    }

    hasPrevMove() {
        return this.props.moves && this.state.currentMove >= 0;
    }

    render() { 
        return (
            <div className='page replay'>
                <div className='player-info-container mobile'>
                    <PlayerInfo
                        name={this.state.currentPlayer}
                        playerColor={this.state.currentPlayer}
                        current={true}
                    />
                </div>
                <div className='player-info-container'>
                    <PlayerInfo
                        name={PlayerColor.GREEN}
                        playerColor={PlayerColor.GREEN}
                        current={PlayerColor.GREEN === this.state.currentPlayer}
                    />
                    <PlayerInfo 
                        name={PlayerColor.BLUE}
                        playerColor={PlayerColor.BLUE}
                        current={PlayerColor.BLUE === this.state.currentPlayer}
                    />
                </div>
                <Board lastMove={this.state.lastMove} playerColor={this.state.playerColor} pieces={this.state.pieces}/>
                <div className='player-info-container'>
                    <PlayerInfo 
                        name={PlayerColor.RED}
                        playerColor={PlayerColor.RED}
                        current={PlayerColor.RED === this.state.currentPlayer}
                    />
                    <PlayerInfo 
                        name={PlayerColor.YELLOW}
                        playerColor={PlayerColor.YELLOW}
                        current={PlayerColor.YELLOW === this.state.currentPlayer}
                    />
                </div>
                <div className='replay-controls'>
                    <h3>Controls</h3>
                    <div className='button-container'>
                        <Button disabled={!this.hasPrevMove()} onClick={() => this.prevMove()} text='Previous'/>
                        <Button disabled={!this.hasNextMove()} onClick={() => this.nextMove()} text='Next'/>
                    </div>
                </div>
            </div>
        );
    }
}
 
export default ReplayGame;
