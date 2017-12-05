var Oof = {};

Oof.GAME_8BALL = 1;
Oof.GAME_9BALL = 2;
Oof.GAME_CARAMBOL = 3;
Oof.GAME_SNOOKER = 4;
Oof.GAME_BALL1 = 5;
Oof.GAME_BALL2 = 6;

// BALL
Oof.BALL_FULL = 1;
Oof.BALL_HALF = 2;
Oof.BALL_ANY  = 0;

// CUEBALL_MAXSPEED def:7.0 
Oof.CUEBALL_MAXSPEED = 7.0;

// ----------- option -----------------------

// Balls can (1) jump out of the table or not (0)
Oof.options_jump_shots = 0;

// 7 ft (smallest normed) def:2.1336
Oof.options_table_size = 2.1336;

//
// 配置ランダムローテーション
// 初期配置でボールを回転させるか
//
Oof.options_random_rotation = false;

//
// 配置ランダム位置
// true : 初期配置でボールを少しだけずらす
// これでブレイクショットで同じ配置にならない
//
Oof.options_random_position = true;


