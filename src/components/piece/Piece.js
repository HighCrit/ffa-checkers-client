import React, { Component } from 'react';
import './piece.scss';

class Piece extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imgUrl: this.getImgUrl()
        };
    }

    getImgUrl() {
        return process.env.PUBLIC_URL + '/pieces/' + this.props.playerColor + (this.props.isKing ? '_king' : '_piece') + '.png';
    }

    render() {        
        return (
            <div className={'piece'}>
                <img draggable={false} src={this.state.imgUrl}></img>
            </div>
        );
    }
}
 
export default Piece;
