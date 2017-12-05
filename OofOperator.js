var OofOperator = {};

// initialize code called once per entity
OofOperator.initialize = function() {
    
};

//
// static
// ポケットに落ちたか
// @return true : 落ちた
//
OofOperator.isDropInPocket = function(ballindex) {

    // 未初期化対策:test
    if (!OofMain.balls) {
        return false;
    }
    
    var ball = OofMain.balls.ball[ballindex];
    if (ball.in_hole <= 0) {
        return false;
    }
    
    return true;
};

//
// static
// ポケット落下が終了したか
//
OofOperator.isFinishInPocket = function(ballindex) {
    
    var ball = OofMain.balls.ball[ballindex];
    
    if (ball.in_hole <= 0) {
        return false;
    }
    if (ball.in_game) {
        return false;
    }
    
    return true;
};

//
// static
// 落下したポケット番号を取得
// @return 0-5 -1:存在しない
//
OofOperator.getDropPocketNoByBall = function(ballindex) {

    var ball = OofMain.balls.ball[ballindex];
    
    return ball.in_hole - 1;
};


//
// static
// ボールの動きが停止したか
// @return true : 停止
//
OofOperator.isBallStop = function(ballindex) {

    var ball = OofMain.balls.ball[ballindex];
    if (!ball) {
        return true;
    }
    
    return ball.isBallStop();
};
//
// static
// ラックタイプの設定
// @param gameType : 0,1,8,9
//
OofOperator.setupRackType = function(gameType) {
    
    switch (gameType) {
        case 0:
            OofMain.set_gametype(Oof.GAME_BALL1);
            break;
        case 1:
            OofMain.set_gametype(Oof.GAME_BALL2);
            break;
        case 8:
            OofMain.set_gametype(Oof.GAME_8BALL);
            break;
        case 9:
            OofMain.set_gametype(Oof.GAME_9BALL);
            break;
    }
    OofMain.init_game_common();
};


//
// static
// ボールの位置設定  表示空間　チェックなし
// @param pos 表示空間
//
OofOperator.setPhysicsBallPositionByShowSpace = function(ballindex, pos) {
    
    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;
    
    var ball = OofMain.balls.ball[ballindex];

    var v = pos.clone();
    v.sub(OFFSET);
    v.scale(1.0 / SCALE);
    
    ball.r.x = v.x;
    ball.r.y = v.z;
    ball.r.z = v.y;
};

//
// static
// ボールが有効か
// @return true : 有効
//
OofOperator.isBallActive = function(ballindex) {

    var ball = OofMain.balls.ball[ballindex];
    if (!ball) {
        return false;
    }
    
    if (!ball.in_game) {
        return false;
    }
    
    return true;
};

//
// ショット
//
OofOperator.doShooting = function(power, dir, angleDegree, rotationRate) {

    // ショット変換
    var Zque = angleDegree;
    var queue_strength = power;
    var rotationRateX = rotationRate.x;
    var rotationRateY = rotationRate.y;
    
    rotationRateX = pc.math.clamp(rotationRateX, -1.0, 1.0);
    rotationRateY = pc.math.clamp(rotationRateY, -1.0, 1.0);

    var maxPoint = (OofBillard.BALL_D - OofBillard.QUEUE_D2) / 2.0;
    var queue_point_x = rotationRateX * maxPoint;
    var queue_point_y = rotationRateY * maxPoint;
    
    // 手玉有効
    OofOperator.setEnableBall(0, true);
    
    OofMain.queue_shot(Zque, queue_strength, queue_point_x, queue_point_y);

};

//
// static
// 有効ボール
// @param ballindex 0-15
//
OofOperator.setEnableBall = function(ballindex, enable) {

    var ball = OofMain.balls.ball[ballindex];
    if (!ball) {
        return;
    }
    
    ball.setEnableBall(enable);
};

//
// static
// 手玉の初期位置 表示空間のボール座標取得
//
OofOperator.getRackShowHandballPosition = function() {
    
    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;

    var org = OofVmath.vec_xyz(0.0,OofBillard.TABLE_L/4.0,0.0);
    
    var vec = new pc.Vec3(org.x, org.z, org.y);

    vec.scale(SCALE);
    vec.add(OFFSET);
    
    return vec;
};


//
// static
// 指定球の速度取得
//
OofOperator.getPhysicsBallVelocity = function(ballindex) {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;

    var result = new pc.Vec3();
    var ball = OofMain.balls.ball[ballindex];
    if (!ball) {
        return result;
    }

    result.set(ball.v.x, ball.v.z, ball.v.y);
    result.scale(SCALE);
    
    return result;
};

//
// 最大速度
//
OofOperator.getPhysicsBallMaxVelocity = function() {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    return Oof.CUEBALL_MAXSPEED * SCALE;
};

//
// 表示空間へのスケールを取得
// @return 1.0
//
OofOperator.getPhysicsShowScale = function() {
    return OofMain.PHYSICS_SHOW_SCALE;
};

//
// 表示空間へのオフセット取得
// @return Vec3
//
OofOperator.getPhysicsShowOffset = function() {
    return OofMain.PHYSICS_SHOW_POS_OFFSET;
};

//
// static
// 物理計算 ポーズ On
// @param state PhysicsControl.SIMULATIONPAUSE_RELOCATION
//
OofOperator.setSimulationPauseOn = function(state) {
    OofMain.enableSimulationState |= state;
};

//
// static
// 物理計算 ポーズ Off
// @param state PhysicsControl.SIMULATIONPAUSE_RELOCATION
//
OofOperator.setSimulationPauseOff = function(state) {
    OofMain.enableSimulationState &= ~state;
};

//
// static
// 物理計算有効 / 無効 取得
// @return true : 有効
//
OofOperator.isEnableSimulation = function() {
    return OofMain.enableSimulationState === 0;
};
    
    
//
// static
// 手玉が他のボールにあたっているかチェックする
// @param　margin 余白 表示空間
// @return true : 他の球にあたっている
//
OofOperator.isHandBallConflictBall = function(margin) {

    // 未初期化対策:test
    if (!OofMain.balls) {
        return false;
    }

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;

    var phyHandBall = OofMain.balls.ball[0];
    var posHnad = new pc.Vec3(phyHandBall.r.x, phyHandBall.r.y, phyHandBall.r.z);
    var diameter = OofBillard.BALL_D * OofBillard.BALL_D;

    // マージン
    if (margin) {
        margin *= 1.0 / SCALE; // 物理空間に変換
        diameter += margin * margin;
    }

    var max = OofMain.balls.nr;
    for (var i=1;i<max;i++) {
        var phyBall = OofMain.balls.ball[i];
        if (!phyBall.isBallActive()) {
            continue;
        }
        
        var pos = new pc.Vec3(phyBall.r.x, phyBall.r.y, phyBall.r.z);
        var diff = pos.sub(posHnad);
        if (diff.lengthSq() <= diameter) {
            // 衝突している
            return true;
        }
        
    }

    // 衝突してない
    return false;
};
    
//
// static
// ボールの位置と回転設定 物理空間単位
// @param ballindex ボール番号 0:手玉...
//
OofOperator.setPhysicsBallPosRotByPhy = function(ballindex, pos, rot) {
    
    var ball = OofMain.balls.ball[ballindex];

    ball.r.x = pos.x;
    ball.r.y = pos.y;
    ball.r.z = pos.z;

    ball.orientation.x = rot.x;
    ball.orientation.y = rot.y;
    ball.orientation.z = rot.z;
    ball.orientation.w = rot.w;

};
//
// static
// ボールの位置と回転取得 物理空間単位
// @param ballindex ボール番号 0:手玉...
// @return {pos:pos, rot:rot}
//
OofOperator.getPhysicsBallPosRotByPhy = function(ballindex) {

    var ball = OofMain.balls.ball[ballindex];
    
    var result = {pos:ball.r.clone(), rot:ball.orientation.clone()};
    
    return result;
};

//
// static
// 
// 移動球と球の衝突判定
//
// @param ballIndex
// @param vdir : pc.Vec3 方向と距離
//
// @return MathUtility.calcIntervalSphereSphere
//	outSec : 衝突時刻
//	outColPos : 衝突位置（接点）
//	outColPosS1(option) : 衝突時のパーティクルAの中心座標
//	outColPosS2(option) : 衝突時のパーティクルBの中心座標
//	
OofOperator.calcConflictMoveSphereToSphere = function(ballIndex, vdir) {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;

    // 物理空間に変換
    var dirVector = vdir.clone();
    dirVector.scale(1.0 / SCALE);
    
    var stepSec = 1.0;
    var ballRadius = OofBillard.BALL_D * 0.5;
    var ball1 = OofMain.balls.ball[ballIndex];
    var pos1 = new pc.Vec3(ball1.r.x, ball1.r.z, ball1.r.y);
    var s1 = {p:pos1 , r:ballRadius};
    var v1 = dirVector;

    var pos2 = new pc.Vec3();
    var hitLength = new pc.Vec3();
    
    var resultInfo;
    
    var i;
    for (i=0;i<16;i++) {
        if (i === ballIndex) {
            continue;
        }

        var phyBall = OofMain.balls.ball[i];
        if (!phyBall) {
            continue;
        }
        if (!phyBall.in_game) {
            continue;
        }
        
        pos2.set(phyBall.r.x, phyBall.r.z, phyBall.r.y);
        
        // 既にヒットした所より遠い場合は判定しない
        if (resultInfo) {
            if (resultInfo.hitLengthSq < hitLength.sub2(pos2, pos1).lengthSq()) {
                continue;
            }
        }

        var s2 = {p:pos2, r:ballRadius};
        var v2 = pc.Vec3.ZERO;
        
        var workResultInfo = MathUtility.calcIntervalSphereSphere(stepSec,s1,v1,s2,v2);
        // ヒットしてない
        if (!workResultInfo.hit) {
            continue;
        }
        // 遠い
        if (resultInfo && resultInfo.outSec < workResultInfo.outSec) {
            continue;
        }
        resultInfo = workResultInfo;
        resultInfo.ballNumber = i;
        resultInfo.hitLengthSq = hitLength.sub2(pos2, pos1).lengthSq();
    }
    
    // 衝突なし
    if (!resultInfo) {
        return {hit:false};
    }
    
    // 表示空間に変換
    resultInfo.outColPos.scale(SCALE);
    resultInfo.outColPosS1.scale(SCALE);
    resultInfo.outColPosS2.scale(SCALE);
    resultInfo.outColPos.add(OFFSET);
    resultInfo.outColPosS1.add(OFFSET);
    resultInfo.outColPosS2.add(OFFSET);
    
    return resultInfo;
    
};

//
// static
// 移動球と壁との衝突判定
//
// @param ballIndex
// @param vdir : pc.Vec3 方向と距離
//
// @return
// pOut_t : 衝突時間を格納するFLOAT型へのポインタ
// pOut_colli : パーティクルの衝突位置を格納するD3DXVECTOR型へのポインタ
//	
OofOperator.calcConflictMoveSphereToWall = function(ballIndex, vdir) {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;

    // 物理空間に変換
    var dirVector = vdir.clone();
    dirVector.scale(1.0 / SCALE);
    
    var ballRadius = OofBillard.BALL_D * 0.5;
    var ball1 = OofMain.balls.ball[ballIndex];
    var spos1 = new pc.Vec3(ball1.r.x, ball1.r.z, ball1.r.y);
    var spos2 = spos1.clone().add(dirVector);
    var linePos1 = new pc.Vec3();
    var linePos2 = new pc.Vec3();
    var walls = OofMain.walls.lines;
    
    var resultInfo;
    
    var i;
    var max = walls.length;
    for (i=0;i<max;i++) {
        var wall = walls[i];

        linePos1.set(wall.r1.x,0,wall.r1.y);
        linePos2.set(wall.r2.x,0,wall.r2.y);

        var workResultInfo = MathUtility.calcMoveSphereToSegment(ballRadius, spos1, spos2, linePos1, linePos2);
        // ヒットしてない
        if (!workResultInfo.hit) {
            continue;
        }
        // 遠い
        if (resultInfo && resultInfo.pOut_t < workResultInfo.pOut_t) {
            continue;
        }
        resultInfo = workResultInfo;
    }
    
    // 衝突なし
    if (!resultInfo) {
        return {hit:false};
    }
    
    // 表示空間に変換
    resultInfo.pOut_colli.scale(SCALE);
    resultInfo.pOut_colli.add(OFFSET);
    
    return resultInfo;

};


//
// static
// 表示空間のボール座標取得
// @return 表示空間
//
OofOperator.getBallPositionOnShowSpace = function(ballindex) {

    // 未初期化対策:test
    if (!OofMain.balls) {
        return pc.Vec3.ZERO.clone();
    }
    
    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;

    var ball = OofMain.balls.ball[ballindex];

    var vec = new pc.Vec3(ball.r.x, ball.r.z, ball.r.y);
    vec.scale(SCALE);
    vec.add(OFFSET);
    
    return vec;

};

//
// static
// ボールの位置設定  表示空間　チェックなし
// @param pos 表示空間
//
OofOperator.setBallPositionOnShowSpace = function(ballindex, pos) {

    // 未初期化対策:test
    if (!OofMain.balls) {
        return;
    }
    
    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;
    
    var ball = OofMain.balls.ball[ballindex];

    var v = pos.clone();
    v.sub(OFFSET);
    v.scale(1.0 / SCALE);
    
    ball.r.x = v.x;
    ball.r.y = v.z;
    ball.r.z = v.y;
};



//
// static
// 表示空間のPocketのAIが狙う座標
// @return 表示空間
//
OofOperator.getPocketCenterAiAimOnShowSpace = function(pocketIndex) {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;

    var hole = OofMain.walls.hole[pocketIndex];

    var vec = new pc.Vec3(hole.aim.x, hole.aim.z, hole.aim.y);
    vec.scale(SCALE);
    vec.add(OFFSET);
    
    return vec;
};

//
// static
// 表示空間のPocketの座標
// @return 表示空間
//
OofOperator.getPocketCenterOnShowSpace = function(pocketIndex) {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;

    var hole = OofMain.walls.hole[pocketIndex];

    var vec = new pc.Vec3(hole.pos.x, hole.pos.z, hole.pos.y);
    vec.scale(SCALE);
    vec.add(OFFSET);
    
    return vec;
};


//
// 対象ボールをテーブルの内側に収める
//
OofOperator.insideHandBallAtTable = function(ballIndex) {

    // 未初期化対策:test
    if (!OofMain.balls) {
        return;
    }

    var ball = OofMain.balls.ball[ballIndex];

    var insideLeft = OofMain.walls.insideLeft;
    var insideRight = OofMain.walls.insideRight;
    var insideBottom = OofMain.walls.insideBottom;
    var insideTop = OofMain.walls.insideTop;
    
    var c = ball.r;
    if (c.x < insideLeft)
      c.x = insideLeft;
    if (c.x > insideRight)
      c.x = insideRight;
    if (c.y < insideBottom)
      c.y = insideBottom;
    if (c.y > insideTop)
      c.y = insideTop;
};

//
// static
// 指定ボールをヘッドライン内に収める
// 長い辺の 2/8 まで
//
OofOperator.inclusionBallAtHeadline = function(ballIndex) {

    var ball = OofMain.balls.ball[ballIndex];

    var insideBottom = OofMain.walls.insideBottom;
    var insideTop = OofMain.walls.insideTop;
    var diff = (insideTop - insideBottom) * 2 / 8;
    insideBottom = insideTop - diff;
    
    var c = ball.r;
    if (c.y < insideBottom)
      c.y = insideBottom;
    if (c.y > insideTop)
      c.y = insideTop;
};


//
// static
// デバッグ用
// 指定したポケットを描画する
//
OofOperator.debugDrawTargetPocket = function(pocketIndex) {
    OofMain.debugDrawTargetPocket(pocketIndex);
};


//
// static
// ボール数取得
//
OofOperator.getPhysicsBallCount = function() {
    return OofMain.balls.ball.length;
};


//
// static
// テーブルの中心座標取得 表示空間
//
OofOperator.getTableCenterPosOnShowSpace = function() {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;

    var vec = new pc.Vec3(0, 0, 0);
    vec.scale(SCALE);
    vec.add(OFFSET);
    
    return vec;
};


//
// static
// Mission用の追加拡張ラインの削除
// 
OofOperator.clearExtraWallLine = function() {
    OofMain.walls.extraLinesForMission = [];
};

//
// static
// Mission用の拡張ライン追加
// @param p1,p2 表示空間の座標
//
OofOperator.addExtraWallLine = function(p1, p2) {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;

    var pp1 = p1.clone();
    pp1.sub(OFFSET);
    pp1.scale(1.0 / SCALE);

    var pp2 = p2.clone();
    pp2.sub(OFFSET);
    pp2.scale(1.0 / SCALE);
    
    var work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( pp1.x, pp1.z, 0 );
    work.r2 = OofVmath.vec_xyz( pp2.x, pp2.z, 0 );
    // @see OofBillard.create_6hole_walls
    work.mu          = 0.1;
    work.loss0       = 0.1;
    work.loss_max    = 0.2;
    work.loss_wspeed = 1.0;
    
    work.borderId = OofMain.walls.border.length + OofMain.walls.extraLinesForMission.length + 1;
    
    OofMain.walls.extraLinesForMission.push(work);
    
    // ライン用にも追加する
    OofMain.walls.lines.push(work);
    
};