const moveSequenceToString = function() {
    if (this.sequence.length > 0) {
        return this.sequence[0].start + 'x' + this.sequence.map(m => m.end).join('x');
    }
    return '';
};

class MoveSequence {
    constructor(sequence = []) {
        this.sequence = sequence;
    }

    addMove(move) {
        this.sequence.push(move);
    }

    last() {
        if (this.sequence.length > 0) {
            return this.sequence[this.sequence.length - 1];
        }
        return null;
    }

    toString() {
        return moveSequenceToString.apply(this);
    }
}

export { MoveSequence, moveSequenceToString };
