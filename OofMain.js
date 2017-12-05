var OofMain = {};

// static
// 表示する時のスケール
OofMain.PHYSICS_SHOW_SCALE = 2.30;
// 表示時のオフセット
OofMain.PHYSICS_SHOW_POS_OFFSET = new pc.Vec3(0.42, 0, 0.01);


//
// 初期化処理
//
OofMain.initialize = function(app) {
    
    OofMain.app = app;

    // 初期化
    OofBillmove.initialize();
    
    // 変数の初期化
    OofMain.initializeValue();
    
    // ボール初期化
    OofApplayToshowBall.initialize(app);
    
    // 配置初期化
    //OofMain.set_gametype(Oof.GAME_BALL1);
    //OofMain.init_game_common();
};

//
// 変数の初期化
//
OofMain.initializeValue = function() {

    // ボール
    OofMain.balls = {
        nr:0,
        ball:[new OofBall()],
    };
    
    // 壁
    OofMain.walls = new OofWalls();

    // プレイヤー
    // Player
    OofMain.player = [new OofPlayer(), new OofPlayer()];

    /* 0 or 1 */
    OofMain.act_player = 0;

    OofMain.gametype = 0; // Oof.GAME_8BALL;
    OofMain.create_scene = null; // OofBillard.create_8ball_scene;
    OofMain.create_walls = null; // OofBillard.create_6hole_walls;
    OofMain.evaluate_last_move = null; //evaluate_last_move_8ball;
    OofMain.ai_get_stroke_dir = null; //ai_get_stroke_dir_8ball;
    
    OofMain.balls_moving = false;
    
    // 物理有効/無効
    OofMain.enableSimulationState = 0;
};


/***********************************************************************
 *                  select gametype, standard 8Ball                    *
 ***********************************************************************/

OofMain.set_gametype = function( gtype ) {

    OofMain.gametype = gtype;
    
    switch (gtype) {
        case Oof.GAME_9BALL:
          //setfunc_evaluate_last_move( evaluate_last_move_9ball );
          OofMain.create_scene = OofBillard.create_9ball_scene;
          OofMain.create_walls = OofBillard.create_6hole_walls;
          //setfunc_ai_get_stroke_dir( ai_get_stroke_dir_9ball );
          OofMain.player[0].cue_ball=0;
          OofMain.player[1].cue_ball=0;
          break;
            
        case Oof.GAME_CARAMBOL:
          setfunc_evaluate_last_move( evaluate_last_move_carambol );
          OofMain.create_scene = OofBillard.create_carambol_scene;
          setfunc_create_walls( OofBillard.create_0hole_walls );
          setfunc_ai_get_stroke_dir( ai_get_stroke_dir_carambol );
          player[0].cue_ball=0;
          player[1].cue_ball=1;
          break;
        case Oof.GAME_SNOOKER:
          setfunc_evaluate_last_move( evaluate_last_move_snooker );
          OofMain.create_scene = OofBillard.create_snooker_scene;
          setfunc_create_walls( OofBillard.create_6hole_walls );
          setfunc_ai_get_stroke_dir( ai_get_stroke_dir_snooker );
          player[0].cue_ball=0;
          player[1].cue_ball=0;
          break;
            
        case Oof.GAME_8BALL:
          // Standard 8Ball
          //setfunc_evaluate_last_move( evaluate_last_move_8ball );
          OofMain.create_scene = OofBillard.create_8ball_scene;
          OofMain.create_walls = OofBillard.create_6hole_walls;
          //setfunc_ai_get_stroke_dir( ai_get_stroke_dir_8ball );
          OofMain.player[0].cue_ball=0;
          OofMain.player[1].cue_ball=0;
          break;

        case Oof.GAME_BALL1:
            OofMain.gametype = Oof.GAME_8BALL;
            OofMain.create_scene = OofBillard.create_ball1_scene;
            OofMain.create_walls = OofBillard.create_6hole_walls;
            OofMain.player[0].cue_ball=0;
            OofMain.player[1].cue_ball=0;
            break;
            
        case Oof.GAME_BALL2:
            OofMain.gametype = Oof.GAME_8BALL;
            OofMain.create_scene = OofBillard.create_ball2_scene;
            OofMain.create_walls = OofBillard.create_6hole_walls;
            OofMain.player[0].cue_ball=0;
            OofMain.player[1].cue_ball=0;
            break;
    }
};

//
// init_game_common
//
OofMain.init_game_common = function() {

    OofMain.player[0].half_full = Oof.BALL_ANY;
    OofMain.player[1].half_full = Oof.BALL_ANY;
    OofMain.player[0].winner=0;
    OofMain.player[1].winner=0;
    OofMain.player[0].score=0;
    OofMain.player[1].score=0;

    OofMain.create_walls( OofMain.walls );
    OofMain.create_scene( OofMain.balls );

    if (OofMain.gametype === Oof.GAME_CARAMBOL) {
        OofMain.player[0].cue_ball=0;
        OofMain.player[1].cue_ball=1;
    }
    else {
        OofMain.player[0].cue_ball=0;
        OofMain.player[1].cue_ball=0;
    }
};

//
// 更新処理
//
OofMain.doUpdate = function(dt) {
    
    OofMain.doRunPhysics(dt);
    
    // for debug
    if (AppConfig.isDebug()) {
        //OofMain.debugDrawTablePath();
        //OofMain.debugDrawTableForLine();
        //OofMain.debugDrawInsideTable();
        //OofMain.debugDrawOutsideTable();
        //OofMain.debugDrawPockets();
        //OofMain.debugDrawBallCircle();
        //OofMain.debugDrawTableNormal();
        OofMain.debugDrawWallLineForMission();
    }
};

//
// 物理実行
//
OofMain.doRunPhysics = function(dt) {


    if (OofOperator.isEnableSimulation()) {
        // dtは固定
        OofMain.balls_moving = OofBillmove.doRunStep();
    }
    
    // 実際のボールに反映
    OofApplayToshowBall.applySyncBall();
    
    // 衝突を通知
    CollisionListener.notifyConflictOnMessage();
};

//
// テーブル描画
// デバッグ用
//
OofMain.debugDrawTablePath = function() {

    var app = OofMain.app;
    var walls = OofMain.walls.border;

    var color = new pc.Color(1,0.2,0.2);

    var max = walls.length;
    for (var i=0;i<max;i++) {
        var wall = walls[i];

        var vecArray = [];
        
        if (wall.pnr === OofBorderShape.TRIANGLE) {
            vecArray.push(new pc.Vec3(wall.r1.x, wall.r1.z, wall.r1.y));
            vecArray.push(new pc.Vec3(wall.r2.x, wall.r2.z, wall.r2.y));
            vecArray.push(new pc.Vec3(wall.r2.x, wall.r2.z, wall.r2.y));
            vecArray.push(new pc.Vec3(wall.r3.x, wall.r3.z, wall.r3.y));
            vecArray.push(new pc.Vec3(wall.r3.x, wall.r3.z, wall.r3.y));
            vecArray.push(new pc.Vec3(wall.r1.x, wall.r1.z, wall.r1.y));
        }
        else if (wall.pnr === OofBorderShape.LINE) {
            vecArray.push(new pc.Vec3(wall.r1.x, wall.r1.z, wall.r1.y));
            vecArray.push(new pc.Vec3(wall.r2.x, wall.r2.z, wall.r2.y));
        }
        
        var sizevec = vecArray.length;
        var j;
        for (j=0 ; j<sizevec ; j++) {
            vecArray[j].scale(OofMain.PHYSICS_SHOW_SCALE);
            vecArray[j].add(OofMain.PHYSICS_SHOW_POS_OFFSET);
        }

        for (j=0 ; j<sizevec ; j+=2) {
            app.renderLine(vecArray[j], vecArray[j+1], color, pc.LINEBATCH_OVERLAY);
        }
        
    }
    
};

//
// テーブル line 描画
// デバッグ用
//
OofMain.debugDrawTableForLine = function() {

    var app = OofMain.app;
    var walls = OofMain.walls.lines;

    var color = new pc.Color(1,0.2,0.2);

    var max = walls.length;
    for (var i=0;i<max;i++) {
        var wall = walls[i];

        var vecArray = [];
        
        if (wall.pnr === OofBorderShape.LINE) {
            vecArray.push(new pc.Vec3(wall.r1.x, wall.r1.z, wall.r1.y));
            vecArray.push(new pc.Vec3(wall.r2.x, wall.r2.z, wall.r2.y));
        }
        
        var sizevec = vecArray.length;
        var j;
        for (j=0 ; j<sizevec ; j++) {
            vecArray[j].scale(OofMain.PHYSICS_SHOW_SCALE);
            vecArray[j].add(OofMain.PHYSICS_SHOW_POS_OFFSET);
        }

        for (j=0 ; j<sizevec ; j+=2) {
            app.renderLine(vecArray[j], vecArray[j+1], color, pc.LINEBATCH_OVERLAY);
        }
        
    }
    
};

//
// デバッグ用
// Mission用追加コリジョンの描画
//
OofMain.debugDrawWallLineForMission = function() {

    var app = OofMain.app;
    var walls = OofMain.walls.extraLinesForMission;

    var color = new pc.Color(0.2,0.2,0.2);

    var max = walls.length;
    for (var i=0;i<max;i++) {
        var wall = walls[i];

        var vecArray = [];
        
        if (wall.pnr === OofBorderShape.LINE) {
            vecArray.push(new pc.Vec3(wall.r1.x, wall.r1.z, wall.r1.y));
            vecArray.push(new pc.Vec3(wall.r2.x, wall.r2.z, wall.r2.y));
        }
        
        var sizevec = vecArray.length;
        var j;
        for (j=0 ; j<sizevec ; j++) {
            vecArray[j].scale(OofMain.PHYSICS_SHOW_SCALE);
            vecArray[j].add(OofMain.PHYSICS_SHOW_POS_OFFSET);
        }

        for (j=0 ; j<sizevec ; j+=2) {
            app.renderLine(vecArray[j], vecArray[j+1], color, pc.LINEBATCH_OVERLAY);
        }
        
    }
    
};

//
// テーブル内側描画
// デバッグ用
//
OofMain.debugDrawInsideTable = function() {

    var app = OofMain.app;
    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;
    
    var colorR = new pc.Color(0.8,0.6,0.2);
    var start = new pc.Vec3();
    var end = new pc.Vec3();
    
    var l = OofMain.walls.insideLeft;
    var r = OofMain.walls.insideRight;
    var t = OofMain.walls.insideTop;
    var b = OofMain.walls.insideBottom;

    var varray = [
        {s:new pc.Vec3(l,0,t), e:new pc.Vec3(r,0,t)},
        {s:new pc.Vec3(l,0,b), e:new pc.Vec3(r,0,b)},
        {s:new pc.Vec3(l,0,t), e:new pc.Vec3(l,0,b)},
        {s:new pc.Vec3(r,0,t), e:new pc.Vec3(r,0,b)},
    ];
    
    var max = varray.length;
    for (var i=0;i<max;i++) {
        var info = varray[i];

        start.copy(info.s);
        end.copy(info.e);
        start.scale(SCALE);
        end.scale(SCALE);
        start.add(OFFSET);
        end.add(OFFSET);

        app.renderLine(start, end, colorR, pc.LINEBATCH_OVERLAY);
        
    }
};

//
// デバッグ用
// テーブル外側描画
//
OofMain.debugDrawOutsideTable = function() {

    var app = OofMain.app;
    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;
    
    var colorR = new pc.Color(0.8,0.6,0.2);
    var start = new pc.Vec3();
    var end = new pc.Vec3();
    
    var l = OofMain.walls.outsideLeft;
    var r = OofMain.walls.outsideRight;
    var t = OofMain.walls.outsideTop;
    var b = OofMain.walls.outsideBottom;

    var varray = [
        {s:new pc.Vec3(l,0,t), e:new pc.Vec3(r,0,t)},
        {s:new pc.Vec3(l,0,b), e:new pc.Vec3(r,0,b)},
        {s:new pc.Vec3(l,0,t), e:new pc.Vec3(l,0,b)},
        {s:new pc.Vec3(r,0,t), e:new pc.Vec3(r,0,b)},
    ];
    
    var max = varray.length;
    for (var i=0;i<max;i++) {
        var info = varray[i];

        start.copy(info.s);
        end.copy(info.e);
        start.scale(SCALE);
        end.scale(SCALE);
        start.add(OFFSET);
        end.add(OFFSET);

        app.renderLine(start, end, colorR, pc.LINEBATCH_OVERLAY);
        
    }
};

//
// ポケット描画
// デバッグ用
//
OofMain.debugDrawPockets = function() {

    var app = OofMain.app;
    var holes = OofMain.walls.hole;

    var color = new pc.Color(0.2,0.2,1.0);

    var max = holes.length;
    for (var i=0;i<max;i++) {
        var hole = holes[i];
        var radius = hole.r * OofMain.PHYSICS_SHOW_SCALE;

        var center = new pc.Vec3(hole.pos.x, hole.pos.z, hole.pos.y);
        
        center.scale(OofMain.PHYSICS_SHOW_SCALE);
        center.add(OofMain.PHYSICS_SHOW_POS_OFFSET);

        RenderUtility.drawCircle(app, center, radius, color);
    }
};


//
// static
// デバッグ用
// 指定したポケットを描画する
//
OofMain.debugDrawTargetPocket = function(pocketIndex) {

    var SCALE = OofMain.PHYSICS_SHOW_SCALE;
    var OFFSET = OofMain.PHYSICS_SHOW_POS_OFFSET;

    var app = OofMain.app;
    
    var color = new pc.Color(0.6,0.4,0.8);

    var hole = OofMain.walls.hole[pocketIndex];
    var radius = hole.r * SCALE;

    var vec = new pc.Vec3(hole.pos.x, hole.pos.z, hole.pos.y);
    vec.scale(SCALE);
    vec.add(OFFSET);

    RenderUtility.drawCircle(app, vec, radius, color);
};

//
// ボールの大きさ描画
// デバッグ用
//
OofMain.debugDrawBallCircle = function() {

    var app = OofMain.app;
    var balls = OofMain.balls.ball;

    var color = new pc.Color(0.8,0.2,0.4);

    var max = balls.length;
    for (var i=0;i<max;i++) {
        var ball = balls[i];
        
        var radius = ball.d * 0.5 * OofMain.PHYSICS_SHOW_SCALE;
        var center = new pc.Vec3(ball.r.x, ball.r.z, ball.r.y);

        center.scale(OofMain.PHYSICS_SHOW_SCALE);
        center.add(OofMain.PHYSICS_SHOW_POS_OFFSET);

        RenderUtility.drawCircle(app, center, radius, color);
    }
    
};

//
// テーブル法線描画
// デバッグ用
//
OofMain.debugDrawTableNormal = function() {

    var app = OofMain.app;
    var walls = OofMain.walls.border;

    var color = new pc.Color(0.2,0.2,1.0);

    var max = walls.length;
    for (var i=0;i<max;i++) {
        var wall = walls[i];
        
        var vecArray = [];
        
        if (wall.pnr === OofBorderShape.LINE) {
            vecArray.push(new pc.Vec3(wall.r1.x, wall.r1.z, wall.r1.y));
            vecArray.push(new pc.Vec3(wall.r2.x, wall.r2.z, wall.r2.y));
            
            var dir = new pc.Vec3().sub2(vecArray[1], vecArray[0]);
            dir.scale(0.5);
            vecArray[0].add(dir);
            vecArray[1].copy(vecArray[0]);

            vecArray[1].x += 0.025;
            vecArray[1].y += 0;
            vecArray[1].z += 0.025;
        }
        else if (wall.pnr === OofBorderShape.TRIANGLE) {
            vecArray.push(new pc.Vec3(wall.r1.x, wall.r1.z, wall.r1.y));
            vecArray.push(new pc.Vec3(wall.r2.x, wall.r2.z, wall.r2.y));
            vecArray.push(new pc.Vec3(wall.r3.x, wall.r3.z, wall.r3.y));
            
            vecArray[0].add(vecArray[1]);
            vecArray[0].add(vecArray[2]);
            vecArray[0].scale(1.0/3.0);
            
            vecArray[1].copy(vecArray[0]);

            vecArray[1].x += wall.n.x * 0.2;
            vecArray[1].y += wall.n.z * 0.2;
            vecArray[1].z += wall.n.y * 0.2;
            
            vecArray.pop();
        }
        else {
            continue;
        }
        
        var j;
        var sizevec = vecArray.length;
        for (j=0 ; j<sizevec ; j++) {
            vecArray[j].scale(OofMain.PHYSICS_SHOW_SCALE);
            vecArray[j].add(OofMain.PHYSICS_SHOW_POS_OFFSET);
        }

        for (j=0 ; j<sizevec ; j+=2) {
            app.renderLine(vecArray[j], vecArray[j+1], color, pc.LINEBATCH_OVERLAY);
        }
        
    }
    
};

/***********************************************************************
 *             The shoot with the cue (german: queue)                  *
 ***********************************************************************/

//
// Zque 角度 Degree 0-360
// queue_strength ショットの強さ 0-1.0
// queue_point_x 回転 -0.027575 ～ 0.027575 : (OofBillard.BALL_D - OofBillard.QUEUE_D2) / 2.0 
// queue_point_y 回転 -0.027575 ～ 0.027575
//
OofMain.queue_shot = function(Zque, queue_strength, queue_point_x, queue_point_y) {

    var Xque = 90;
    
    var i;
    var cue_ball = OofMain.player[OofMain.act_player].cue_ball;

    var dir = OofVmath.vec_xyz(
        OofVmath.MATH_SIN(Zque * OofVmath.M_PI/180.0) * OofVmath.MATH_SIN(Xque * OofVmath.M_PI/180.0),
        OofVmath.MATH_COS(Zque * OofVmath.M_PI/180.0) * OofVmath.MATH_SIN(Xque * OofVmath.M_PI/180.0),
        OofVmath.MATH_COS(Xque * OofVmath.M_PI/180.0)
    );
    
    /* parallel to table */
    var nx = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_ez(),dir));
    /* orthogonal to dir and nx */
    var ny = OofVmath.vec_unit(OofVmath.vec_cross(nx,dir));
    
    var hitpoint = OofVmath.vec_add(
        OofVmath.vec_scale(nx,queue_point_x),
        OofVmath.vec_scale(ny,queue_point_y)
    );
    
    var cueBall = OofMain.balls.ball[cue_ball];
    cueBall.v = OofVmath.vec_scale(dir, -Oof.CUEBALL_MAXSPEED * queue_strength);
    
    if (!Oof.options_jump_shots) {
        cueBall.v.z =  0.0;
    }

    if (OofVmath.vec_abssq(hitpoint)===0.0) {
        cueBall.w = OofVmath.vec_xyz(0.0,0.0,0.0);
    }
    else {
        var maxLength = (OofBillard.BALL_D - OofBillard.QUEUE_D2) / 2.0;
        var length = Math.sqrt(queue_point_x*queue_point_x + queue_point_y*queue_point_y);
        var rotationRate = length / maxLength;
        var result = 2.0 * 3.0 * Oof.CUEBALL_MAXSPEED * queue_strength / cueBall.d / cueBall.d * rotationRate;
        //AppConfig.debugConsole("rotationRate:" + rotationRate + " result:" + result + " queue_point_x:" + queue_point_x + " queue_point_y:" + queue_point_y);
        cueBall.w = OofVmath.vec_scale(
            OofVmath.vec_cross(dir,hitpoint),
            result
        );
    }

    /* reset offset parameters */
    queue_point_x=0.0;
    queue_point_y=0.0;
};

//***********************************************************************

//
// no ball split into another (for one balls)
// called from all_balls_free_place
// 
// これは最終手段かなりワープする
//
OofMain.ball_free_place = function( index, pballs )
{
    var MAX_LOOP_COUNT = 6;
    var BALLHIT_EPSIRON = 0.00001 + Number.EPSILON;
    
    var targetBall = pballs.ball[index];
    var x = targetBall.r.x;
    var y = targetBall.r.y;
    var xBase = x;
    var yBase = y;
    var angleDegree = 0;
    var max = pballs.nr;
    var moveLength = 0;

    var workLoopCount = 0;
    do {
        var noConflict = true;
        x = xBase + moveLength * OofVmath.MATH_COS(angleDegree * pc.math.DEG_TO_RAD);
        y = yBase + moveLength * OofVmath.MATH_SIN(angleDegree * pc.math.DEG_TO_RAD);

        for (var i=0; i<max; i++)  {
            if (index === i) {
                continue;
            }
            var checkBall = pballs.ball[i];
            if (!checkBall.in_game) {
                continue;
            }
            var lengthsq = OofVmath.vec_abssq(
                OofVmath.vec_diff(
                    OofVmath.vec_xyz(x,y,0),
                    checkBall.r
                )
            );
            var diameter = (targetBall.d + checkBall.d) * 0.5;
            var diameterSq = diameter * diameter;
            if (lengthsq + BALLHIT_EPSIRON < diameterSq) {
                moveLength = Math.sqrt(lengthsq) + (workLoopCount * 0.1);
                noConflict = false;
                break;
            }
        }
        
        if (noConflict) {
            break;
        }
        
        angleDegree += 360 / MAX_LOOP_COUNT;
        workLoopCount++;
    } while(workLoopCount < MAX_LOOP_COUNT);

    if (workLoopCount >= MAX_LOOP_COUNT) {
        AppConfig.debugConsole("OofMain.ball_free_place workLoopCount:" + workLoopCount);
    }
    
    targetBall.r.x = x;
    targetBall.r.y = y;
};

//***********************************************************************

//
// no ball split into another (for all balls)
// 
OofMain.all_balls_free_place = function(pballs) {

    var max = pballs.nr;
    for (var i=0;i<max;i++) {
        
        if (!pballs.ball[i].in_game) {
            continue;
        }
    
        OofMain.ball_free_place( i, pballs );
    }
};


/***********************************************************************
 *         Is the cue ball inside the region of the table ?            *
 ***********************************************************************/

OofMain.in_cue_ball_region = function( pos )
{
    switch (OofMain.gametype) {
    case Oof.GAME_8BALL:
    case Oof.GAME_9BALL:
        if(pos.x >  (OofBillard.TABLE_W - OofBillard.BALL_D)/2.0 ||
           pos.x < -(OofBillard.TABLE_W - OofBillard.BALL_D)/2.0 ||
           pos.y > -OofBillard.TABLE_L/4.0 ||
           pos.y < -(OofBillard.TABLE_L - OofBillard.BALL_D)/2.0) {
        	return(0);
        }
        break;
    case Oof.GAME_CARAMBOL:
        break;
    case Oof.GAME_SNOOKER:
        var TABLE_SCALE = (TABLE_L/(3.571042));
        if(pos.y > -OofBillard.TABLE_L/2.0+OofBillard.TABLE_SCALE * 0.737 ||
           vec_abs(vec_diff(pos,vec_xyz(0,-OofBillard.TABLE_L/2.0+OofBillard.TABLE_SCALE*0.737,0))) > OofBillard.TABLE_SCALE*0.292) {
        	return(0);
        }
        break;
    }
    return(1);
};

/***********************************************************************
 *          Is the pos inside the playground of the table ?            *
 ***********************************************************************/

OofMain.in_table_region = function( pos )
{
    if(pos.x >  (OofBillard.TABLE_W - OofBillard.BALL_D)/2.0 ||
       pos.x < -(OofBillard.TABLE_W - OofBillard.BALL_D)/2.0 ||
       pos.y >  (OofBillard.TABLE_L - OofBillard.BALL_D)/2.0 ||
       pos.y < -(OofBillard.TABLE_L - OofBillard.BALL_D)/2.0) {
    	return(0);
    }
    return(1);
};

