import React, { Component } from 'react';
import './button.scss';

class Button extends Component {
    render() { 
        return ( 
            <div {...this.props} className='button-component'>
                {this.props.text}
            </div>
        );
    }
}
 
export default Button;
