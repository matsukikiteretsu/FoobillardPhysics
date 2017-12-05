//
// OofVec
//
function OofVec(x,y,z) {
    this.initialize(x,y,z);
}

OofVec.prototype.initialize = function(x,y,z) {
    if (x && x.x) {
        this.copy(x);
    }
    else {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }
};

OofVec.prototype.clone = function() {
    var vr = new OofVec();
    vr.copy(this);
    return vr;
};

OofVec.prototype.copy = function(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
};
