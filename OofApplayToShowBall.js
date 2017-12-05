//
// 物理空間の座標を表示空間に反映させる
//
var OofApplayToshowBall = {};

// initialize code called once per entity
OofApplayToshowBall.initialize = function(app) {

    OofApplayToshowBall.app = app;
    
    OofApplayToshowBall.initBall();

};

//
// 全ボール初期化
//
OofApplayToshowBall.initBall = function() {
    
    OofApplayToshowBall.targetBallEntityRef = [];

    var app = OofApplayToshowBall.app;
    
    for (var i=0;i<16;i++) {
        var entityName = "ball" + i.toString();
        if (i === 0) {
            entityName = "handball";
        }
        var ball = app.root.findByName(entityName);
        if (!ball) {
            continue;
        }
        OofApplayToshowBall.targetBallEntityRef[i] = ball;
    }
    
};

//
// 表示空間に同期
//
OofApplayToshowBall.applySyncBall = function() {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;
    
    var ballArray = OofApplayToshowBall.targetBallEntityRef;
    var max = ballArray.length;
    if (max > OofMain.balls.ball.length) {
        max = OofMain.balls.ball.length;
    }

    for (var i=0;i<max;i++) {
        var ballEntity = ballArray[i];
        
        // 物理が有効なのだけ反映させる
        if (ballEntity.getPhysicsEnable() === false) {
            continue;
        }
        
        var phyBall = OofMain.balls.ball[i];
        
        var v = new pc.Vec3(phyBall.r.x, phyBall.r.z, phyBall.r.y);
        v.scale(SCALE);
        v.add(OFFSET);
        ballEntity.setPosition(v);

        var q = phyBall.orientation;
        
        ballEntity.setRotation(q);
    }

};
