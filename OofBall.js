//
// OofBall
//
function OofBall() {
    this.initialize();
}

OofBall.prototype.initialize = function() {
    
    // mass [kg]
    this.m = 0;
    
    // massentraegheitsmom [kg*m^2]
    this.I = 0;

    // diameter [m] 直径
    this.d = 0;
    
    // position　[m]
    this.r = OofVmath.vec_zero();
    
    // speed [m/s]
    this.v = OofVmath.vec_zero();

    // rotation speed and axe [rad./s] in table coords
    this.w = OofVmath.vec_zero();

    // 回転クォータニオン
    this.orientation = new pc.Quat();

    // 0=white, ...
    this.nr = 0;
    
    // ball in game
    this.in_game = false;
    
    // ball still in game but already in hole
    // ==0 not in, >0 Pocket in
    this.in_hole = 0;
    
    // ボールが動いている時間 保険用
    this.moveBallTime = 0;

    // 1frmに1回だけ速度をロスする false:ロス済み
    this.wallLossVelocityOneFrame = false;
};

OofBall.prototype.clone = function() {
    var ball = new OofBall();
    ball.copy(this);
    return ball;
};

OofBall.prototype.copy = function(ball) {

    this.m = ball.m;
    this.I = ball.I;
    this.d = ball.d;
    this.r = ball.r.clone();
    this.v = ball.v.clone();
    this.w = ball.w.clone();
    this.orientation = ball.orientation.clone();
    this.nr = ball.nr;
    this.in_game = ball.in_game;
    this.in_hole = ball.in_hole;
};

//
// ボールが停止したか
// @return true : 停止
//
OofBall.prototype.isBallStop = function() {

    // OofBillmove.proceed_dt_calc_speed で 0になるので0で良い
    var MOVEBALL_EPSIRON = 0.00 + Number.EPSILON;

    var velocity = OofVmath.vec_abs(this.v);
    var angularVelocity = OofVmath.vec_abs(this.w);

    if (velocity > MOVEBALL_EPSIRON) {
        return false;
    }
    if (angularVelocity > MOVEBALL_EPSIRON) {
        return false;
    }

    // 停止
    return true;
};

//
// ボール有効
//
OofBall.prototype.setEnableBall = function(enable) {

    if (enable) {
        this.in_game = true;
        this.in_hole = 0;
    }
    else {
        this.in_game = false;
        this.in_hole = 1;
    }
    
};

//
// ボールがアクティブか
// @return true : 有効
//
OofBall.prototype.isBallActive = function() {

    if (!this.in_game) {
        return false;
    }

    return true;
};

//
// ボールがポケットに入っているか
// @return true : 入っている
//
OofBall.prototype.isInHole = function() {

    if (this.in_hole <= 0) {
        return false;
    }
    return true;
};

//
// ボールが動いている時間を加算する
// 一定時間以上の場合は停止する
//
OofBall.prototype.calcMoveBallTime = function(dt) {
    this.moveBallTime += dt;
    if (this.moveBallTime > 11.0) {
        // 停止
        this.v = OofVmath.vec_zero();
        this.w = OofVmath.vec_zero();
        AppConfig.debugConsole("MoveBallTime stop");
    }
};

//
// ボールが動いている時間を加算する
// 一定時間以上の場合は停止する
//
OofBall.prototype.clearMoveBallTime = function() {
    this.moveBallTime = 0;
};
