//
// OofHole
//
function OofHole() {
    this.initialize();
}

OofHole.prototype.initialize = function() {
    
    this.pos = OofVmath.vec_zero(); // pos
    this.aim = OofVmath.vec_zero(); // position to aim for ai-player
    this.r = 0;    // radius of hole (wall-coll free zone)

};
