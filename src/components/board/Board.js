import React, { Component } from 'react';
import { DndProvider } from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import BlackCell from '../cell/BlackCell';
import Cell from '../cell/Cell';

import './board.scss';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: '800px'
        };
    }

    render() {
        const cells = [];
        for (let row = 0; row < 18; row++) {
            for (let col = 0; col < 18; col++) {
                if ((row < 4 || row > 13) && (col < 4 || col > 13)) {
                    cells.push(<div key={row * 18 + col}/>);
                } else if (row % 2 === 0 ? col % 2 === 0 : col % 2 === 1) {
                    const index = Math.floor((row * 18 + col) / 2);
                    const piece = this.props.pieces[index];
                    cells.push(<BlackCell lastMove={this.props.lastMove && (this.props.lastMove.start === index || this.props.lastMove.end === index)} { ...piece } isMine={piece && (piece.playerColor === this.props.playerColor)} index={index} key={row * 18 + col}/>);
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
