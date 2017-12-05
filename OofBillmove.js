var OofBillmove = {};

OofBillmove.SQRTM1 = 100000.0;

// 1E-2 = 1 cm/s def:1.0e-2 0.01
OofBillmove.SLIDE_THRESH_SPEED = 0.01;

// m/s^2 
OofBillmove.GRAVITY = 9.81;
// table  roll-friction const  def:0.03
OofBillmove.MU_ROLL = 0.025;
// table slide-friction const  def:0.2
OofBillmove.MU_SLIDE = 0.4;
// 3mm radius der auflageflaeche - not used for rollmom (only rotational-friction around spot)
// def : 12.0e-3 0.012
OofBillmove.SPOT_R = 0.012;
// 22.5 /s def:0.833
OofBillmove.OMEGA_MIN = OofBillmove.SLIDE_THRESH_SPEED / OofBillmove.SPOT_R;
OofBillmove.OMEGA_MIN = 1.0;

/* friction const between ball and ball */
OofBillmove.MU_BALL = 0.1;

// ステップ分割数
OofBillmove.DIVIDE_TIMESTEP = 3;



// -- debug --

//
// ログ出力デバッグ用
//
function oofmovedebuglog(log) {
    if (AppConfig.isDebug()) {
        //console.log(log);
    }
}

// -- debug --


/***********************************************************************/

// コリジョンタイプ
OofBillmove.COLLTYPE_NONE =0;
OofBillmove.COLLTYPE_WALL =1;
OofBillmove.COLLTYPE_BALL =2;


/***********************************************************************/

//
// 初期化
//
OofBillmove.initialize = function() {
    
    OofBillmove.ballCollisions = [];
    OofBillmove.wallCollisions = [];
};

/***********************************************************************/

OofBillmove.plane_dist = function(r, rp, n)
{
    return OofVmath.vec_mul(
        OofVmath.vec_diff(
            r,
            rp
        ),
        n
    );
};

/***********************************************************************/

//
// 範囲内か
//
OofBillmove.inrange_advborder = function(ball, wall)
{
    var result = true;

    switch (wall.pnr) {
        case OofBorderShape.TRIANGLE:
            var dr1 = OofVmath.vec_diff(wall.r2, wall.r1);
            var dr2 = OofVmath.vec_diff(wall.r3, wall.r2);
            var dr3 = OofVmath.vec_diff(wall.r1, wall.r3);
            var n   = OofVmath.vec_unit(OofVmath.vec_cross(dr1,dr2));
            result = ( OofBillmove.plane_dist( ball.r, wall.r1, OofVmath.vec_unit(OofVmath.vec_cross(n,dr1)) ) >= 0.0 &&
                    OofBillmove.plane_dist( ball.r, wall.r2, OofVmath.vec_unit(OofVmath.vec_cross(n,dr2)) ) >= 0.0 &&
                    OofBillmove.plane_dist( ball.r, wall.r3, OofVmath.vec_unit(OofVmath.vec_cross(n,dr3)) ) >= 0.0 );
            break;

        case OofBorderShape.LINE:
            var r   = OofVmath.vec_diff(ball.r,wall.r1);
            var dr  = OofVmath.vec_diff(wall.r2, wall.r1);
            var dra = OofVmath.vec_abs(dr);
            var d   = OofVmath.vec_mul(r,dr)/dra;
            result = (d>=0.0 && d<dra);
            break;
    }
    
    return result;
};

/***********************************************************************/

//
// 壁までの衝突時間
// @return negative dt
//
OofBillmove.calc_wall_collision_time_old = function( ball, wall )
{
    var h, vn, ph, q, t1,t2;
    var dr, r, v;
    var rval = 1E20;

    // 範囲外
    if (!OofBillmove.inrange_advborder( ball, wall ) ) {
        return rval;
    }
    
    switch (wall.pnr) {
        case OofBorderShape.TRIANGLE:
            dr = OofVmath.vec_diff( ball.r, wall.r1 );
            h  = OofVmath.vec_mul( dr, wall.n ) - ball.d/2.0;
            vn = OofVmath.vec_mul( ball.v, wall.n );
            if (vn === 0) {
                return rval;
            }
            rval = -h/vn;
            break;
            
        case OofBorderShape.LINE:
            // del all comps par to cylinder 
            dr = OofVmath.vec_diff( wall.r2 ,wall.r1 );
            r = OofVmath.vec_diff( ball.r, wall.r1 );
            r = OofVmath.vec_diff( r, OofVmath.vec_proj(r,dr) );
            v = ball.v;
            v = OofVmath.vec_diff( v, OofVmath.vec_proj(v,dr) );
            ph = OofVmath.vec_mul(v,r)/OofVmath.vec_abssq(v);
            var velocityLengthSq = OofVmath.vec_abssq(v);
            if (velocityLengthSq === 0) {
                return rval;
            }
            q  = (OofVmath.vec_abssq(r) - ball.d*ball.d/4.0) / velocityLengthSq;
            if(ph*ph>q){
               t1 = -ph + OofVmath.MATH_SQRT(ph*ph-q);
               t2 = -ph - OofVmath.MATH_SQRT(ph*ph-q);
            } else {
               t1 = OofBillmove.SQRTM1;
               t2 = OofBillmove.SQRTM1;
            }
            
            // solve |r+vt|=d/2 
            rval = (t1<t2)?t1:t2;
            break;
            
        case OofBorderShape.POINT:
            r = OofVmath.vec_diff( ball.r, wall.r1 );
            ph = OofVmath.vec_mul(ball.v,r)/OofVmath.vec_abssq(ball.v);
            q  = (OofVmath.vec_abssq(r) - ball.d*ball.d/4.0)/OofVmath.vec_abssq(v);
            if(ph*ph>q){
                t1 = -ph+OofVmath.MATH_SQRT(ph*ph-q);
             t2 = -ph-OofVmath.MATH_SQRT(ph*ph-q);
            } else {
               t1 = OofBillmove.SQRTM1;
               t2 = OofBillmove.SQRTM1;
            }
            rval = (t1<t2)?t1:t2;
            break;
    }
    
    
    return rval;
};

//
// 壁までの衝突時間
// @return distance 0以下 衝突している
//
OofBillmove.calc_wall_collision_time = function( ball, wall )
{
    var resultDistance = 1E10;

    // 範囲外
    if (!OofBillmove.inrange_advborder( ball, wall ) ) {
        return resultDistance;
    }
    
    switch (wall.pnr) {
        case OofBorderShape.TRIANGLE:
            var difft = OofVmath.vec_diff( ball.r, wall.r1 );
            var h  = Math.abs( OofVmath.vec_mul( difft, wall.n ) ) - ball.d/2.0;
            resultDistance = h;
            break;
            
        case OofBorderShape.LINE:
            // del all comps par to cylinder 
            var drl = OofVmath.vec_diff( wall.r2 ,wall.r1 );
            var r = OofVmath.vec_diff( ball.r, wall.r1 );
            r = OofVmath.vec_diff( r, OofVmath.vec_proj(r,drl) );
            var q  = OofVmath.vec_abssq(r) - ball.d*ball.d/4.0;
            resultDistance = q;
            break;
    }
    
    return resultDistance;
};

/***********************************************************************/

//
// ball to ball
// dt1 should be negative 
// @return negative dt
//
OofBillmove.calc_ball_collision_time = function( b1, b2 )
{
    var p, q, rs, t1, t2, ds;
    var dv = OofVmath.vec_diff( b1.v, b2.v );
    var dr = OofVmath.vec_diff( b1.r, b2.r );
    var vs = dv.x*dv.x + dv.y*dv.y + dv.z*dv.z ;
    if (vs === 0) {
        return 0;
    }
    rs = dr.x*dr.x + dr.y*dr.y + dr.z*dr.z ;
    ds = (b1.d+b2.d) * 0.5;
    ds *= ds;
    p  = ( dv.x*dr.x + dv.y*dr.y + dv.z*dr.z ) / vs;
    q  = (rs-ds) / vs;
    q  = (p*p>q)?OofVmath.MATH_SQRT(p*p-q):OofBillmove.SQRTM1;
    t1 = -p + q;
    t2 = -p - q;
    
    return( (t1<t2)?t1:t2 );
};

/***********************************************************************/

//
// ball to ball hit
// @return distance 0以下 衝突している
//
OofBillmove.calc_ball_collision_check = function( b1, b2 )
{
    var dr = OofVmath.vec_diff( b1.r, b2.r );
    var rs = OofVmath.vec_abs(dr);
    var ds = (b1.d + b2.d) * 0.5;

    // 球がまったく同じ位置に存在する
    if (rs <= 0 + Number.EPSILON) {
        return {to1Dir:OofVmath.vec_xyz(1,0,0), distance: -b1.d};
    }
    
    // Normalize
    dr.x /= rs;
    dr.y /= rs;
    dr.z /= rs;
    
    return {to1Dir:dr, distance: (rs - ds)};
};

/***********************************************************************/

//
// only for 3-point wall
// 
OofBillmove.perimeter_speed_wall = function( ball, wall )
{
    return OofVmath.vec_cross(
        ball.w,
        vOofVmath.OofVmath.vec_scale(
            wall.n,
            -ball.d/2.0
        )
    );
};

/***********************************************************************/

OofBillmove.perimeter_speed_normal = function( ball, normal )
{
    return OofVmath.vec_cross(
        ball.w,
        OofVmath.vec_scale(
            normal,
            -ball.d/2.0
        )
    );
};

/***********************************************************************/

OofBillmove.ball_wall_interaction = function( ball, wall, collisionInfo )
{
    var hit_normal;
    var enableConflict = false;

    switch (wall.pnr) {
        case OofBorderShape.TRIANGLE:
            hit_normal=wall.n;
            enableConflict = true;
            break;

        case OofBorderShape.LINE:
            var dr = OofVmath.vec_diff( wall.r2, wall.r1 );
            hit_normal = OofVmath.vec_diff( ball.r, wall.r1 );
            hit_normal = OofVmath.vec_unit( OofVmath.vec_diff( hit_normal, OofVmath.vec_proj(hit_normal,dr) ) );
            enableConflict = true;
            break;

        case OofBorderShape.POINT:
            hit_normal = OofVmath.vec_unit( OofVmath.vec_diff( ball.r, wall.r1 ) );
            enableConflict = true;
            break;
    }

    if (!enableConflict) {
        return;
    }

    // 速度計算
    {
        var vn = OofVmath.vec_proj(ball.v, hit_normal);
        var vp = OofVmath.vec_diff(ball.v, vn);

        // normal component
        var loss = wall.loss0 + (wall.loss_max - wall.loss0) * (1.0 - Math.exp(-OofVmath.vec_abs(vn) / wall.loss_wspeed) );

        // 1frmに1回だけロスするようにする
        // 角だと複数回ヒットするため
        if (ball.wallLossVelocityOneFrame) {
            ball.wallLossVelocityOneFrame = false;
        }
        else {
            loss = 0;
        }
        
        var dv = OofVmath.vec_scale( vn, -(1.0+OofVmath.MATH_SQRT(1.0-loss)) );
        ball.v = OofVmath.vec_add(ball.v,dv);

        // parallel component
        dv = OofVmath.vec_scale( OofVmath.vec_unit(OofVmath.vec_add(OofBillmove.perimeter_speed_normal(ball, hit_normal),vp)), -OofVmath.vec_abs(dv)*wall.mu );
        var dw = OofVmath.vec_cross(OofVmath.vec_scale(dv,ball.m/2.0/ball.I),OofVmath.vec_scale(hit_normal,ball.d));
        var dw2 = OofVmath.vec_add(dw,OofVmath.vec_proj(ball.w,dw));
        if( OofVmath.vec_mul(dw2,ball.w) < 0.0 ){
            dw = OofVmath.vec_diff(dw,dw2);
            dv = OofVmath.vec_scale(OofVmath.vec_unit(dv),OofVmath.vec_abs(dw)*2.0*ball.I/ball.m/ball.d);
        }
        ball.w = OofVmath.vec_add(ball.w,dw);
        if (!Oof.options_jump_shots) {
          dv.z = 0.0;
        }
        ball.v = OofVmath.vec_add(ball.v,dv);

        // maybe some angular momentum loss has to be implemented here
    }

    // 外に押し出す
    {
        // 角だと何度も同じ壁に衝突するので少しバイアスをかける ボール 0.06515
        var PUSHWALL_EPSIRON = 0.001 + Number.EPSILON;
        
        ball.r = OofVmath.vec_add(
            ball.r,
            OofVmath.vec_scale(hit_normal, (-collisionInfo.distance) + PUSHWALL_EPSIRON)
        );
    }

    CollisionListener.addConflictToWall(ball.nr);
};

/***********************************************************************/

//
// ボール同士の衝突計算
//
OofBillmove.ball_ball_interaction = function( b1, b2, collisionInfo )
{
    var dvec = OofVmath.vec_diff(b1.r,b2.r);
    var duvec = OofVmath.vec_unit(dvec);

    // balls in coord system of b1
    // stoss
    var b1s = b1.clone();
    var b2s = b2.clone();
    b2s.v.x-=b1s.v.x;
    b2s.v.y-=b1s.v.y;
    b2s.v.z-=b1s.v.z;
    b1s.v.x=0.0;
    b1s.v.y=0.0;
    b1s.v.z=0.0;

    var dvn = OofVmath.vec_scale(duvec,OofVmath.vec_mul(duvec,b2s.v));
    var dvp = OofVmath.vec_diff( b2s.v, dvn );

    b2s.v = OofVmath.vec_diff( b2s.v, dvn );
    b2s.v = OofVmath.vec_add ( b2s.v, OofVmath.vec_scale(dvn,(b2s.m-b1s.m)/(b1s.m+b2s.m)) );
    b1s.v = OofVmath.vec_scale( dvn, 2.0*b2s.m/(b1s.m+b2s.m) );  /* (momentum transfer)/m1 */
    b2.v = OofVmath.vec_add( b1.v, b2s.v );
    b1.v = OofVmath.vec_add( b1.v, b1s.v );

    /* angular momentum transfer */
    var dpn  = OofVmath.vec_scale(b1s.v,b1s.m); /* momentum transfer from ball2 to ball1 */
    var perimeter_speed_b1=OofVmath.vec_cross( b1.w, OofVmath.vec_scale(duvec,-b1.d/2.0) );
    var perimeter_speed_b2=OofVmath.vec_cross( b2.w, OofVmath.vec_scale(duvec, b2.d/2.0) );
    var fric_dir = OofVmath.vec_unit(OofVmath.vec_add(OofVmath.vec_diff(perimeter_speed_b2,perimeter_speed_b1),dvp));
    var dpp = OofVmath.vec_scale(fric_dir,-OofVmath.vec_abs(dpn)*OofBillmove.MU_BALL);  /* dp parallel of ball2 */
    var dw2 = OofVmath.vec_scale( OofVmath.vec_cross(dpp,duvec), b2.d/b2.I );
    var dw1 = OofVmath.vec_scale( OofVmath.vec_cross(dpp,duvec), b1.d/b1.I );
    var dw2max = OofVmath.vec_scale(OofVmath.vec_proj(OofVmath.vec_diff(b2.w,b1.w),dw2),0.5);
    var dw1max = OofVmath.vec_scale(OofVmath.vec_proj(OofVmath.vec_diff(b1.w,b2.w),dw2),0.5);
    
    if( OofVmath.vec_abs(dw1)>OofVmath.vec_abs(dw1max) || OofVmath.vec_abs(dw2)>OofVmath.vec_abs(dw2max) ){
        /* correct momentum transfer to max */
        dpp = OofVmath.vec_scale(dpp,OofVmath.vec_abs(dw2max)/OofVmath.vec_abs(dw2));
        /* correct amg mom transfer to max */
        dw2=dw2max;
        dw1=dw1max;
    }
    
    b1.w = OofVmath.vec_diff( b1.w,dw1 );
    b2.w = OofVmath.vec_diff( b2.w,dw2 );

    // parallel momentum transfer due to friction between balls
    var dv1 = OofVmath.vec_scale(dpp,-b1.m);
    var dv2 = OofVmath.vec_scale(dpp, b2.m);
    dv1.z = 0.0;
    dv2.z = 0.0;
    b1.v = OofVmath.vec_add( b1.v, dv1 );
    b2.v = OofVmath.vec_add( b2.v, dv2 );

    // 外に押し出す
    {
        // 誤差用 ボール 0.06515
        var PUSHBALL_EPSIRON = 0.00001 + Number.EPSILON;
        
        b1.r = OofVmath.vec_add(
            b1.r,
            OofVmath.vec_scale(collisionInfo.to1Dir, (-collisionInfo.distance*0.5) + PUSHBALL_EPSIRON)
        );
        
        b2.r = OofVmath.vec_add(
            b2.r,
            OofVmath.vec_scale(collisionInfo.to1Dir, ((-collisionInfo.distance*0.5) + PUSHBALL_EPSIRON) * -1 )
        );
    }

    // 衝突情報を追加
    CollisionListener.addConflictToBall(b1.nr, b2.nr);
};

/***********************************************************************/

//
// ホールに入ったかチェックする
//
OofBillmove.check_ball_hole_in = function(ball, borders)
{
    var max = borders.holenr;
    for(var i=0;i<max;i++) {
        
        var hole = borders.hole[i];
        
        var lengthsq = OofVmath.vec_abssq(
            OofVmath.vec_diff(hole.pos, ball.r)
        );
        
        // 半分と少し
        var inLengthSq = (hole.r * hole.r) - (ball.d * 0.1) * (ball.d * 0.1);
        
        if (lengthsq < inLengthSq) {
            return i+1;
        }
    }
    return 0;
};

/***********************************************************************/

//
// 穴に落ちたボールを除外する
//
OofBillmove.remove_balls_from_game = function(balls)
{
    // ポケットの底までの長さ
    var POCKET_BOTTOM_LENGTH = 0.9;
    
    var max = balls.nr;
    
    for (var i=0; i<max; i++) {

        var ball = balls.ball[i];
        
        if (!ball.in_game) {
            continue;
        }
        
        var remove = false;
        
        // 穴の底についた
        if (ball.r.z < -POCKET_BOTTOM_LENGTH) {
            remove = true;
        }
        
        if (remove) {
            ball.in_game = false;
            ball.v = OofVmath.vec_zero();
            ball.w = OofVmath.vec_zero();
        }
    }
};

/***********************************************************************/

//
// proceed_dt_only
//
OofBillmove.proceed_dt_only = function(balls, dt) {

    var max = balls.nr;
    for(var i=0;i<max;i++){

        var ball = balls.ball[i];
        
        if (!ball.in_game) {
            continue;
        }
        
        // translate ball
        var dx = OofVmath.vec_scale(ball.v,dt);
        ball.r = OofVmath.vec_add(ball.r,dx);

        // perform rotation
        OofVmath.applyAngularVelocity( ball.w, dt, ball.orientation );
    }
};

/***********************************************************************/

//
// returns "true" if border and ball strobe away from each other, "false" else (at time dt)
// 
OofBillmove.wall_dv_pos = function( ball, wall, dt ) {

    var ballpos;
    var work;
    switch(wall.pnr) {
        case 3:
            work = OofVmath.vec_mul(ball.v,wall.n);
            return (work > 0.0);

        case 2:
            ballpos = OofVmath.vec_add(ball.r,OofVmath.vec_scale(ball.v,dt));
            work =  OofVmath.vec_mul(ball.v,OofVmath.vec_ncomp(OofVmath.vec_diff(ballpos, wall.r1),OofVmath.vec_diff(wall.r2,wall.r1)));
            return (work > 0.0);

        case 1:
            ballpos = OofVmath.vec_add(ball.r,OofVmath.vec_scale(ball.v,dt));
            work = OofVmath.vec_mul(OofVmath.vec_diff(ballpos,wall.r1),ball.v);
            return (work > 0.0);
    }
    
    return true;
};

/***********************************************************************/

//
// this one does not remove fallen balls
// あたり判定
//
OofBillmove.proceed_dt_euler = function(balls, borders, dt) {

    OofBillmove.proceedDtEulerMain(balls, borders, dt);
};

//
// あたり判定メイン
//
OofBillmove.proceedDtEulerMain = function(balls, borders, dt) {

    var COLLISION_MAX_LOOP = 8;
    
    var i;
    for (i=0; i<COLLISION_MAX_LOOP; i++) {

        // move all balls
        OofBillmove.proceed_dt_only(balls, dt);
        
        // 壁
        OofBillmove.proceedDtEulerCheckWall(balls, borders);
        
        // 球
        OofBillmove.proceedDtEulerCheckBall(balls, dt);
        
        // 衝突してない場合は終了
        if (OofBillmove.wallCollisions.length <= 0 && OofBillmove.ballCollisions.length <= 0) {
            break;
        }
        
        // reverse
        OofBillmove.proceed_dt_only(balls, -dt);
        
        // 衝突解決
        OofBillmove.handleCollisions(balls, borders);
    }
    
    // 衝突回数が最大を超えた場合は次のフレームに持ち越し
    if (i >= COLLISION_MAX_LOOP) {
        oofmovedebuglog("proceedDtEulerMain i:" + i + " COLLISION_MAX_LOOP:" + COLLISION_MAX_LOOP);
        OofBillmove.proceed_dt_only(balls, dt);
    }

};

//
// 壁とのあたりをチェック
//
OofBillmove.proceedDtEulerCheckWall = function(balls, borders) {

    var INSIDE_EPSIRON = 0.00001 + Number.EPSILON;
    var DISTANCE_EPSIRON = -(0.00001 + Number.EPSILON);
    
    var left = OofMain.walls.insideLeft + INSIDE_EPSIRON; // -
    var right = OofMain.walls.insideRight - INSIDE_EPSIRON;
    var bottom = OofMain.walls.insideBottom + INSIDE_EPSIRON; // -
    var top = OofMain.walls.insideTop - INSIDE_EPSIRON;
    
    var ballMax = balls.ball.length;
    var wallMax = borders.border.length;

    for(var i=0;i<ballMax;i++) {

        var checkBall = balls.ball[i];
        
        if (!checkBall.in_game) {
            continue;
        }
        
        // テーブルの内側にいる場合は壁と判定しない
        var x = checkBall.r.x;
        var y = checkBall.r.y;
        if (x > left &&
            x < right &&
            y > bottom &&
            y < top) {
            continue;
        }
        
        // check wall collisions
        for(var j=0;j<wallMax;j++){
            var distance = OofBillmove.calc_wall_collision_time(checkBall, borders.border[j]);

            if (distance >= DISTANCE_EPSIRON) {
                continue;
            }
            OofBillmove.wallCollisions.push({ballnr:i, border:borders.border[j], distance: distance});
   
            oofmovedebuglog("hitwall ball:" + i + " wall:" + j + " distance:" + distance.toFixed(6) + " vx:" + checkBall.v.x.toFixed(4) + " vy:" + checkBall.v.y.toFixed(4) + " frm:" + MiscUtility.getGameElapseFrame());
        }
    }
    
    // for Mission
    OofBillmove.proceedDtEulerCheckForMissionWall(balls, borders);
};

//
// Mission用の追加コリジョンとの判定
//
OofBillmove.proceedDtEulerCheckForMissionWall = function(balls, borders) {

    var DISTANCE_EPSIRON = -(0.00001 + Number.EPSILON);
    
    var ballMax = balls.ball.length;
    var wallMax = borders.extraLinesForMission.length;

    // Mission用なのでその他では処理しない
    if (wallMax <= 0) {
        return;
    }

    for(var i=0;i<ballMax;i++) {

        var checkBall = balls.ball[i];
        
        if (!checkBall.in_game) {
            continue;
        }
        for(var j=0;j<wallMax;j++){
            var distance = OofBillmove.calc_wall_collision_time(checkBall, borders.extraLinesForMission[j]);

            if (distance >= DISTANCE_EPSIRON) {
                continue;
            }
            OofBillmove.wallCollisions.push({ballnr:i, border:borders.extraLinesForMission[j], distance: distance});
   
            oofmovedebuglog("hitMission ball:" + i + " wall:" + j + " distance:" + distance.toFixed(6) + " vx:" + checkBall.v.x.toFixed(4) + " vy:" + checkBall.v.y.toFixed(4) + " frm:" + MiscUtility.getGameElapseFrame());
        }
    }
};



//
// ボールのあたり判定
//
OofBillmove.proceedDtEulerCheckBall = function(balls, dt) {

    var DISTANCE_EPSIRON = -(0.00001 + Number.EPSILON);

    var ballMax = balls.nr;
    for (var i=0; i<ballMax; i++) {
        var checkBall = balls.ball[i];
        if (!checkBall.in_game) {
            continue;
        }
        // check ball collisions
        for(var j=0; j<i; j++) {
            var targetBall = balls.ball[j];
            if (!targetBall.in_game) {
                continue;
            }
            var resultInfo = OofBillmove.calc_ball_collision_check(checkBall, targetBall);
            if (resultInfo.distance >= DISTANCE_EPSIRON) {
                continue;
            }
            
            // 衝突している
            OofBillmove.ballCollisions.push({collnr:i, collnr2:j, distance: resultInfo.distance, to1Dir:resultInfo.to1Dir});

            oofmovedebuglog("hitball ball:" + i + " ball:" + j + " distance:" + resultInfo.distance.toFixed(6) + " vx:" + checkBall.v.x.toFixed(4) + " vy:" + checkBall.v.y.toFixed(4) + " frm:" + MiscUtility.getGameElapseFrame());
        }
    }
};


//
// 衝突情報を解決する
//
OofBillmove.handleCollisions = function(balls, borders) {

    var maxWall = OofBillmove.wallCollisions.length;
    for (var wi = 0; wi < maxWall; ++wi) {
        var cwall = OofBillmove.wallCollisions[wi];
        
        OofBillmove.ball_wall_interaction(
            balls.ball[cwall.ballnr],
            cwall.border,
            cwall
        );
    }
    OofBillmove.wallCollisions = [];
    
    var maxBall = OofBillmove.ballCollisions.length;
    for (var bi = 0; bi < maxBall; ++bi) {
        var cball = OofBillmove.ballCollisions[bi];
            
        OofBillmove.ball_ball_interaction(
            balls.ball[cball.collnr],
            balls.ball[cball.collnr2],
            cball
        );
    }
    OofBillmove.ballCollisions = [];
};

/***********************************************************************/


OofBillmove.perimeter_speed = function( ball )
{
    return(OofVmath.vec_cross(ball.w,OofVmath.vec_xyz(0.0,0.0,-ball.d/2.0)));
};


/***********************************************************************/

//
// 物理実行
//
OofBillmove.doRunStep = function() {

    var stepCount = OofBillmove.DIVIDE_TIMESTEP;
    
    // 決定性のために固定dt
    var TIMESTEP = (1.0 / 60) / stepCount;

    // フラグ
    OofBillmove.setAllLossVelocityOneFrame( OofMain.balls );
    
    var ballsMoving = false;
    for (var i=0;i<stepCount;i++) {
        ballsMoving = OofBillmove.proceed_dt( OofMain.balls, OofMain.walls, TIMESTEP );
        if (!ballsMoving) {
            break;
        }
    }

    // ボール終了チェック
    OofBillmove.remove_balls_from_game( OofMain.balls );
    
    // ボールをすべて内側に入れる
    OofBillmove.checkOutsideTableToAllBall( OofMain.balls, OofMain.walls );
    
    return ballsMoving;
};

//
// proceed_dt
// @return true : ball move
//
OofBillmove.proceed_dt = function(balls, borders, dt)
{
    // timestep with actual speeds, omegas,... 
    OofBillmove.proceed_dt_euler(balls, borders, dt);

    // calc new accelerations and speeds
    var balls_moving = OofBillmove.proceed_dt_calc_speed(balls, borders, dt);

    OofBillmove.proceed_dt_check_pocket(balls, borders, dt);
    
    return balls_moving;
};

//
// calc new accelerations and speeds
// @return true : ball move
// 
OofBillmove.proceed_dt_calc_speed = function(balls, borders, dt) {

    var balls_moving = false;
    
    var waccel, uspeed, uspeed_eff, uspeed2, uspeed_eff2, fricaccel, fricmom, rollmom, totmom;
    var uspeed_eff_par, uspeed_eff2_par;
    
    // calc new accelerations and speeds
    for (var i=0; i<balls.nr; i++) {
        
        var ball = balls.ball[i];
        
        if (!ball.in_game) {
            continue;
        }

        // check if balls still moving
        if (ball.isBallStop() === false) {
            balls_moving = true;
            ball.calcMoveBallTime(dt);
        }
        else {
            ball.clearMoveBallTime();
        }

        // calc accel 3D
        // init acceleration
        var accel = OofVmath.vec_xyz(0.0,0.0,0.0);

        /* absolute and relative perimeter speed */
        uspeed = OofBillmove.perimeter_speed(ball);
        uspeed_eff = OofVmath.vec_add(uspeed,ball.v);

        /* only if  ball not flying do sliding/rolling */
        if( ball.r.z<=0.0) {
            /* if sliding */
            if( OofVmath.vec_abs( uspeed_eff ) > OofBillmove.SLIDE_THRESH_SPEED ) {

                /* acc caused by friction */
                fricaccel = OofVmath.vec_scale( OofVmath.vec_unit(uspeed_eff), -OofBillmove.MU_SLIDE*OofBillmove.GRAVITY );
                accel = OofVmath.vec_add(accel, fricaccel);

                /* angular acc caused by friction */
                fricmom = OofVmath.vec_scale( OofVmath.vec_cross(fricaccel, OofVmath.vec_xyz(0.0,0.0,-ball.d/2.0)), ball.m );
                waccel = OofVmath.vec_scale( fricmom,-1.0/ball.I );

                /* perform accel */
                ball.w = OofVmath.vec_add( ball.w, OofVmath.vec_scale(waccel,dt));
                ball.v = OofVmath.vec_add( ball.v, OofVmath.vec_scale(accel,dt));
                uspeed2 = OofBillmove.perimeter_speed(ball);
                uspeed_eff2 = OofVmath.vec_add(uspeed2,ball.v);

                /* if uspeed_eff passes 0 */
                uspeed_eff_par  = OofVmath.vec_mul( uspeed_eff,  OofVmath.vec_diff(uspeed_eff,uspeed_eff2));
                uspeed_eff2_par = OofVmath.vec_mul( uspeed_eff2, OofVmath.vec_diff(uspeed_eff,uspeed_eff2));


                if ( OofVmath.vec_ndist(OofVmath.vec_null(),uspeed_eff,uspeed_eff2) <= OofBillmove.SLIDE_THRESH_SPEED &&
                    ((uspeed_eff_par > 0.0 &&
                      uspeed_eff2_par < 0.0) ||
                     (uspeed_eff2_par > 0.0 &&
                      uspeed_eff_par < 0.0))) {

                    /* make rolling if uspeed_eff passed 0 */
                    ball.v = OofVmath.vec_cross( ball.w, OofVmath.vec_xyz(0.0,0.0,ball.d/2.0));
                }

                if( OofVmath.vec_abs(ball.w) < OofBillmove.OMEGA_MIN && OofVmath.vec_abs(ball.v) < OofBillmove.SLIDE_THRESH_SPEED ){
                    ball.v = OofVmath.vec_xyz( 0.0, 0.0, 0.0 );
                    ball.w = OofVmath.vec_xyz( 0.0, 0.0, 0.0 );
                }

            }
            /* rolling forces */
            else {
                fricmom = OofVmath.vec_xyz(0.0,0.0,0.0);

                /* moment of rotation around ballspot */

                if( Math.abs(OofVmath.vec_mul(OofVmath.vec_xyz(0.0,0.0,1.0),ball.w)) > OofBillmove.OMEGA_MIN ) {
                    fricmom = OofVmath.vec_add(
                        fricmom,
                        OofVmath.vec_scale(
                            OofVmath.vec_unit(
                                OofVmath.vec_xyz(0.0,0.0,ball.w.z)
                            ),
                            OofBillmove.MU_SLIDE * ball.m * OofBillmove.GRAVITY * OofBillmove.SPOT_R
                        )
                    );
                }

                /* wirkabstand von rollwid.-kraft */
                var ROLL_MOM_R = OofBillmove.MU_ROLL*ball.I/ball.m/ball.d;

                rollmom = OofVmath.vec_cross(OofVmath.vec_xyz(0.0,0.0,ball.m*OofBillmove.GRAVITY * ROLL_MOM_R), OofVmath.vec_unit(ball.v));

                totmom = OofVmath.vec_add(fricmom,rollmom);
                waccel = OofVmath.vec_scale( totmom,-1.0/ball.I );

                ball.w = OofVmath.vec_add( ball.w, OofVmath.vec_scale(waccel,dt));
                /* align v with w to assure rolling */
                ball.v = OofVmath.vec_cross( ball.w, OofVmath.vec_xyz(0.0,0.0,ball.d/2.0));

                var restVelocitySq = OofVmath.vec_abssq(ball.v);
                var restAngleSq = OofVmath.vec_abssq(ball.w);

                if( restAngleSq < (OofBillmove.OMEGA_MIN*OofBillmove.OMEGA_MIN) && restVelocitySq < (OofBillmove.SLIDE_THRESH_SPEED*OofBillmove.SLIDE_THRESH_SPEED) ) {
                    ball.v = OofVmath.vec_xyz( 0.0, 0.0, 0.0 );
                    ball.w = OofVmath.vec_xyz( 0.0, 0.0, 0.0 );
                }
            }
        }
    }
  
    return balls_moving;
};


//
// ポケットに入ったかチェックする
// proceed_dt_check_pocket
// 
OofBillmove.proceed_dt_check_pocket = function(balls, borders, dt) {

    var max = balls.nr;
    for (var i=0; i<max; i++) {
        
        var ball = balls.ball[i];

        if (!ball.in_game) {
            continue;
        }
        
        var j = ball.in_hole;
        if (j <= 0) {
            j = OofBillmove.check_ball_hole_in(ball, borders);
            if (j <= 0) {
                continue;
            }
            ball.in_hole = j;
        }
        
        var hole = borders.hole[j-1];
        
        OofBillmove.proceedDtInPocket(ball, hole, dt);
    }
};


//
// ポケットに入った後の処理
//
OofBillmove.proceedDtInPocket = function(ball, hole, dt) {

    var holeRadius = hole.r;
    var ballRadius = (ball.d * 0.5);
    var GRAVITY_LIMIT = holeRadius - ballRadius;

    var dr = OofVmath.vec_diff(ball.r, hole.pos);
    dr.z = 0;
        
    var length = OofVmath.vec_abs(dr);

    // 球がほぼ入ってから重力をかける
    if (length  < GRAVITY_LIMIT) {
        ball.v.z -= OofBillmove.GRAVITY * dt;
    }

    // 落ち始めたらポケットの外に出さない
    if (ball.v.z < 0) {
        if (length > holeRadius - ballRadius) {
            
            // 速度
            ball.v = OofVmath.vec_diff(
                ball.v,
                OofVmath.vec_scale(OofVmath.vec_proj(ball.v,dr),2.0)
            );
            
            // 位置
            var moveDistance = length - (holeRadius - ballRadius);
            var toHoleVec = OofVmath.vec_diff(hole.pos, ball.r);
            toHoleVec.z = 0;
            toHoleVec = OofVmath.vec_scale( OofVmath.vec_unit(toHoleVec), moveDistance );
            ball.r = OofVmath.vec_add(ball.r, toHoleVec);
        }
    }
    // 落ちるまでは中心に引っ張られる
    else {
        var toHoleDir = OofVmath.vec_diff(hole.pos, ball.r);
        var restSpeed = OofVmath.vec_abs(ball.v);
        var addSpeed = 0;
        // 遅い時は加速
        if (restSpeed < 0.1) {
            addSpeed = restSpeed * 1.0 / OofBillmove.DIVIDE_TIMESTEP;
        }
        else {
            // 反対を向いている場合も加算
            if (OofVmath.vec_mul(ball.v, toHoleDir) < 0) {
                addSpeed = restSpeed * 1.0 / OofBillmove.DIVIDE_TIMESTEP;
            }
        }
        if (addSpeed > 0) {
            toHoleDir = OofVmath.vec_scale(OofVmath.vec_unit(toHoleDir), addSpeed);
            ball.v = OofVmath.vec_add(ball.v, toHoleDir);
        }
    }

    
};


//***********************************************************************

//
// テーブルの外側に出たら内側にいれる
//
//
// テーブルの外に球があればすべて内側にいれる
// 壁抜け防止用
//
OofBillmove.checkOutsideTableToAllBall = function(balls, borders) {

    var ballArray = balls.ball;
    var walls = borders;
    
    var max = ballArray.length;
    for (var i = 0; i < max; ++i) {
        var ball = ballArray[i];
        
        // 動いてないの無視
        if (!ball.isBallActive()) {
            continue;
        }
        
        // ポケットに入ったの無視
        if (ball.isInHole()) {
            continue;
        }
    
        var c = ball.r;
        if (c.x < walls.outsideLeft)
          c.x = walls.insideLeft;
        if (c.x > walls.outsideRight)
          c.x = walls.insideRight;
        if (c.y < walls.outsideBottom)
          c.y = walls.insideBottom;
        if (c.y > walls.outsideTop)
          c.y = walls.insideTop;
    }

};

//
// 壁衝突1回のみ減衰フラグセット
// 
OofBillmove.setAllLossVelocityOneFrame = function(balls) {

    var max = balls.ball.length;
    for (var i=0; i<max; i++) {
        var ball = balls.ball[i];
        ball.wallLossVelocityOneFrame = true;
    }
};
