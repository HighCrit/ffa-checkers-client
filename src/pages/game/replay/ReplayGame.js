import React from 'react';
import { PlayerColor } from '../../../enums/PlayerColor';
import PlayerInfo from '../../../components/player_info/PlayerInfo';
import Board from '../../../components/board/Board';
import Game from '../base/Game';

import './replay_game.scss';

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
            moves: [],
            currentMove: -1
        });

        fetch(process.env.REACT_APP_API_URL + '/replays/' + this.props.id)
            .then((res) => res.json())
            .then((data) => {
                this.constructBoard(data.initialFen);
                this.setState({
                    moves: data.moves
                });
            });

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
            this.executeMove(this.state.moves[this.state.currentMove + 1]);
            this.setState({ currentMove: this.state.currentMove + 1 });
        }
    }

    prevMove() {
        if (this.hasPrevMove()) {
            this.undoMove(this.state.moves[this.state.currentMove]);
            this.setState({ currentMove: this.state.currentMove - 1, lastMove: this.state.moves[this.state.currentMove - 1] });
        }
    }

    hasNextMove() {
        return this.state.moves.length > 0 && this.state.currentMove < this.state.moves.length - 1;
    }

    hasPrevMove() {
        return this.state.moves.length > 0 && this.state.currentMove >= 0;
    }

    render() { 
        return (
            <div className='page replay'>
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
            </div>
        );
    }
}
 
export default ReplayGame;
