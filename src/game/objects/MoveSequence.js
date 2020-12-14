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
        if (this.sequence.length > 0) {
            return this.sequence[0].oldPosition + 'x' + this.sequence.map(m => m.newPosition).join('x');
        }
        return '';
    }
}

export default MoveSequence;
