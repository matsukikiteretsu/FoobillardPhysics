OofBorderShape = {};

OofBorderShape.ARC = 4;
OofBorderShape.TRIANGLE = 3;
OofBorderShape.LINE = 2;
OofBorderShape.POINT = 1;


//
// OofBorder
//
function OofBorder() {
    this.initialize();
}

OofBorder.prototype.initialize = function() {
    
    this.pnr = 0;          // 4=arc 3=triangle 2=line 1=point
    this.r1 = OofVmath.vec_zero();          // pos
    this.r2 = OofVmath.vec_zero();          // pos
    this.r3 = OofVmath.vec_zero();          // pos (tangent vec for arc)
    
    // normal vector
    this.n = OofVmath.vec_zero();
    
    this.mu = 0;           // friction const
    this.loss0 = 0;        // const loss per hit (0th order in speed)
    this.loss_max = 0;     // max loss
    this.loss_wspeed = 0;  // width of higher order loss curve

    // id for debug
    this.borderId = 0;
};
