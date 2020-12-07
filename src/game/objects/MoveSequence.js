class MoveSequence {
    constructor(sequence = []) {
        this.sequence = sequence;
    }

    addMove(move) {
        this.sequence.push(move);
    }

    toString() {
        if (this.sequence.length > 0) {
            return this.sequence[0].oldPosition + 'x' + this.sequence.map(m => m.newPosition).join('x');
        }
        return '';
    }
}

export default MoveSequence;
