import React, { Component } from 'react';
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import PlayerColor from '../../enums/PlayerColor';
import BlackCell from '../cell/BlackCell';
import Cell from '../cell/Cell';
import Game from '../../game/Game';

import './board.scss';

class Board extends Component {
    constructor(props) {
        super(props);
        this.blackCellRefs = new Array(162);
        this.state = {
            size: '800px'
        };

        for (let i = 0; i < this.blackCellRefs.length; i++) {
            this.blackCellRefs[i] = React.createRef();
        }

        Game.setBoard(this);
    }

    componentDidMount() {
        Game.setPlayerColor(PlayerColor.RED);
        Game.constructBoard(Game.fen);
    }

    onChange(index) {
        this.blackCellRefs[index].current.getDecoratedComponentInstance().update();
    }

    render() {
        const cells = [];

        for (let row = 0; row < 18; row++) {
            for (let col = 0; col < 18; col++) {
                if ((row < 4 || row > 13) && (col < 4 || col > 13)) {
                    cells.push(<div key={row * 18 + col}/>);
                } else if (row % 2 === 0 ? col % 2 === 0 : col % 2 === 1) {
                    const index = Math.floor((row * 18 + col) / 2);
                    cells.push(<BlackCell ref={this.blackCellRefs[index]} index={index} key={row * 18 + col}/>);
                } else {
                    cells.push(<Cell key={row * 18 + col}/>);
                }      
            }
        }
        
        return (
            <div className={'board-container'} style={{ width: this.state.size, height: this.state.size }}>
                <DndProvider options={HTML5toTouch}>
                    <div className={'board'}>
                        {cells}
                    </div>
                </DndProvider>
            </div>
        );
    }
}
 
export default Board;
