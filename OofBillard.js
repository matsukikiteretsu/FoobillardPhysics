var OofBillard = {};

// テーブルサイズ def:Oof.options_table_size
OofBillard.TABLE_W  =(Oof.options_table_size/2.0);
OofBillard.TABLE_L  =(Oof.options_table_size) + 0.01;

// ボール質量
// 170 g  def:0.17
OofBillard.BALL_M = 0.17;

// ボール直径
// 57.15 mm 0.05715 def:57.15e-3
OofBillard.BALL_D = 0.05715 + 0.0080; // 0.0080

// hole corner d=110 mm def:0.110/2.0
OofBillard.HOLE1_R = (0.110/2.0);
// hole center d=115 mm def:0.115/2.0
OofBillard.HOLE2_R = (0.115/2.0);

OofBillard.QUEUE_L    =1.4;     /* 1.4 m */
OofBillard.QUEUE_D1   =0.035;   /* 3.5cm */
OofBillard.QUEUE_D2   =0.010;   /* 1.0cm */

// cornerあたりの角度
// corner cotan(35) def:1.42815
OofBillard.HOLE1_TAN  =1.00000;
OofBillard.HOLE2_TAN  =0.36397; /* tan(20) */

OofBillard.SQR2 = Math.sqrt(2.0);

OofBillard.BANDE_D   =0.035;  /* 3.5cm to be conform with normed opening of middle pockets */
OofBillard.BANDE_D2RATIO  =0.5;  /* (1-0.3)*BANDE_D */
OofBillard.BANDE_D2 =(OofBillard.BANDE_D*(1.0-0.3));  /* (1-0.3)*BANDE_D */

// Hole Corner 幅
// def: (2.0*OofBillard.HOLE1_R - OofBillard.SQR2 * OofBillard.BANDE_D * (1.0 - OofBillard.HOLE1_TAN))
OofBillard.HOLE1_W = (2.0*OofBillard.HOLE1_R - OofBillard.SQR2 * OofBillard.BANDE_D * (1.0 - OofBillard.HOLE1_TAN)) - 0.01;

OofBillard.HOLE2_W  =(OofBillard.HOLE2_R*2.0 + OofBillard.HOLE2_TAN * OofBillard.BANDE_D*2.0);  /* */
OofBillard.HOLE1_WH = OofBillard.HOLE1_W/2.0;  /* */
OofBillard.HOLE2_WH = OofBillard.HOLE2_W/2.0;  /* */
OofBillard.FRAME_D  =(2.0*OofBillard.HOLE2_R+0.05);   /* d_hole+5cm */
OofBillard.FRAME_H   =0.09;   /*  9cm */
OofBillard.FRAME_H2  =0.16;   /* 16cm */
OofBillard.FRAME_DH =0.010;           /* +7mm */
OofBillard.FRAME_PHASE =0.01;        /* 1cm */
/* 1.7cm */
OofBillard.FRAME_DW = 0.017;
/* */
OofBillard.WOOD_D = (OofBillard.FRAME_D - OofBillard.BANDE_D);
OofBillard.HOLE1_XYOFFS =(0.04/OofBillard.SQR2);  /* */
OofBillard.HOLE2_XYOFFS =(OofBillard.HOLE2_R+0.005);  /* */

// for AI corner def: 0.02
OofBillard.HOLE1_AIMOFFS =0.010;
// for AI center def: 0.02
OofBillard.HOLE2_AIMOFFS = -0.010;

OofBillard.HOLE1_PHASE   =0.005;  /* */
OofBillard.HOLE2_PHASE   =0.005;  /* */


/***********************************************************************/

/* positions:            */
/* ==========            */
/*   11  12  13  14  15  */
/*     07  08  09  10    */
/*       04  05  06      */
/*         02  03        */
/*           01          */
//
// 0 と 8 以外ランダム配置
//
OofBillard.place8ballnrsAtRandom = function( balls )
{
    var i,j;

    for(i=0 ; i<balls.nr ; i++){

        if (i===0) {
            balls.ball[i].nr=0;
            continue;
        }
        if(i===5){
            balls.ball[i].nr=8;
            continue;
        }
        
        // 1〜15の乱数を発生
        var rand = Math.floor( Math.random() * balls.nr ) + 1;
        var act = rand;
        
        var ok2;
        do {
            ok2 = true;
            act = (act+1) % balls.nr;
            for(j=0;j<i;j++){
                if( act === balls.ball[j].nr ) {
                    ok2 = false;
                    break;
                }
            }
            if( act === 8 || act === 0 ) {
                ok2 = false;
            }
        } while(!ok2);

        balls.ball[i].nr = act;
    }

    for(i=0;i<balls.nr;i++){
        AppConfig.debugConsole("i=" + i + ": ball#=" + balls.ball[i].nr);
    }
};

OofBillard.place8ballnrs = function( balls )
{
    for (var i=0 ; i<balls.nr ; i++){
        balls.ball[i].nr = i;
    }
};

/***********************************************************************/

OofBillard.create_6hole_walls = function( walls ) {
    var i;

    // borders
    walls.nr = 30;
    
    walls.border = [];
    OofBillard.createBorderToArray(walls.border, walls.nr);

    // bonds
    walls.border[0].pnr = OofBorderShape.TRIANGLE;
    walls.border[0].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[0].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.HOLE2_W/2.0, 0.0 );
    walls.border[0].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[0].n  = OofVmath.vec_xyz( -1.0, 0.0, 0.0 );

    walls.border[1].pnr = OofBorderShape.TRIANGLE;
    walls.border[1].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[1].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0,              -OofBillard.HOLE2_W/2.0, 0.0 );
    walls.border[1].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[1].n  = OofVmath.vec_xyz( -1.0, 0.0, 0.0 );

    walls.border[2].pnr = OofBorderShape.TRIANGLE;
    walls.border[2].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[2].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0,              +OofBillard.HOLE2_W/2.0, 0.0 );
    walls.border[2].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[2].n  = OofVmath.vec_xyz( +1.0, 0.0, 0.0 );

    walls.border[3].pnr = OofBorderShape.TRIANGLE;
    walls.border[3].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[3].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0,              -OofBillard.HOLE2_W/2.0, 0.0 );
    walls.border[3].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[3].n  = OofVmath.vec_xyz( +1.0, 0.0, 0.0 );

    walls.border[4].pnr = OofBorderShape.TRIANGLE;
    walls.border[4].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[4].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, 0.0 );
    walls.border[4].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[4].n  = OofVmath.vec_xyz( 0.0, -1.0, 0.0 );

    walls.border[5].pnr = OofBorderShape.TRIANGLE;
    walls.border[5].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[5].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, 0.0 );
    walls.border[5].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[5].n  = OofVmath.vec_xyz( 0.0, +1.0, 0.0 );

    
    // edges
    // upper right
    walls.border[6].pnr = OofBorderShape.LINE;
    walls.border[6].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[6].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[18].pnr = OofBorderShape.TRIANGLE;
    walls.border[18].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[18].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[18].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, 0.0 );
    walls.border[18].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[18].r2,walls.border[18].r1),OofVmath.vec_diff(walls.border[18].r3,walls.border[18].r1)));

    /* upper right */
    walls.border[7].pnr = OofBorderShape.LINE;
    walls.border[7].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[7].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[19].pnr = OofBorderShape.TRIANGLE;
    walls.border[19].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[19].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[19].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, +OofBillard.TABLE_L/2.0+1.0, 0.0 );
    walls.border[19].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[19].r1,walls.border[19].r2),OofVmath.vec_diff(walls.border[19].r3,walls.border[19].r1)));

    /* upper left */
    walls.border[8].pnr = OofBorderShape.LINE;
    walls.border[8].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[8].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[20].pnr = OofBorderShape.TRIANGLE;
    walls.border[20].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[20].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[20].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, 0.0 );
    walls.border[20].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[20].r1,walls.border[20].r2),OofVmath.vec_diff(walls.border[20].r3,walls.border[20].r1)));

    /* upper left */
    walls.border[9].pnr = OofBorderShape.LINE;
    walls.border[9].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[9].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[21].pnr = OofBorderShape.TRIANGLE;
    walls.border[21].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[21].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[21].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, +OofBillard.TABLE_L/2.0+1.0, 0.0 );
    walls.border[21].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[21].r2,walls.border[21].r1),OofVmath.vec_diff(walls.border[21].r3,walls.border[21].r1)));

    /* lower right */
    walls.border[10].pnr = OofBorderShape.LINE;
    walls.border[10].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[10].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[22].pnr = OofBorderShape.TRIANGLE;
    walls.border[22].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[22].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[22].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, 0.0 );
    walls.border[22].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[22].r1,walls.border[22].r2),OofVmath.vec_diff(walls.border[22].r3,walls.border[22].r1)));

    /* lower right */
    walls.border[11].pnr = OofBorderShape.LINE;
    walls.border[11].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[11].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[23].pnr = OofBorderShape.TRIANGLE;
    walls.border[23].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[23].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[23].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, -OofBillard.TABLE_L/2.0-1.0, 0.0 );
    walls.border[23].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[23].r2,walls.border[23].r1),OofVmath.vec_diff(walls.border[23].r3,walls.border[23].r1)));

    /* lower left */
    walls.border[12].pnr = OofBorderShape.LINE;
    walls.border[12].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[12].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[24].pnr = OofBorderShape.TRIANGLE;
    walls.border[24].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[24].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[24].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, 0.0 );
    walls.border[24].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[24].r2,walls.border[24].r1),OofVmath.vec_diff(walls.border[24].r3,walls.border[24].r1)));

    /* lower left */
    walls.border[13].pnr = OofBorderShape.LINE;
    walls.border[13].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[13].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[25].pnr = OofBorderShape.TRIANGLE;
    walls.border[25].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[25].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[25].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, -OofBillard.TABLE_L/2.0-1.0, 0.0 );
    walls.border[25].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[25].r1,walls.border[25].r2),OofVmath.vec_diff(walls.border[25].r3,walls.border[25].r1)));

    /* middle left */
    walls.border[14].pnr = OofBorderShape.LINE;
    walls.border[14].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[14].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[26].pnr = OofBorderShape.TRIANGLE;
    walls.border[26].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[26].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[26].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, OofBillard.HOLE2_W/2.0-OofBillard.HOLE2_TAN, 0.0 );
    walls.border[26].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[26].r2,walls.border[26].r1),OofVmath.vec_diff(walls.border[26].r3,walls.border[26].r1)));

    /* middle left */
    walls.border[15].pnr = OofBorderShape.LINE;
    walls.border[15].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[15].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[27].pnr = OofBorderShape.TRIANGLE;
    walls.border[27].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[27].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[27].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, -OofBillard.HOLE2_W/2.0+OofBillard.HOLE2_TAN, 0.0 );
    walls.border[27].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[27].r1,walls.border[27].r2),OofVmath.vec_diff(walls.border[27].r3,walls.border[27].r1)));

    /* middle right */
    walls.border[16].pnr = OofBorderShape.LINE;
    walls.border[16].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[16].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[28].pnr = OofBorderShape.TRIANGLE;
    walls.border[28].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[28].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[28].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, OofBillard.HOLE2_W/2.0-OofBillard.HOLE2_TAN, 0.0 );
    walls.border[28].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[28].r1,walls.border[28].r2),OofVmath.vec_diff(walls.border[28].r3,walls.border[28].r1)));

    /* middle right */
    walls.border[17].pnr = OofBorderShape.LINE;
    walls.border[17].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[17].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[29].pnr = OofBorderShape.TRIANGLE;
    walls.border[29].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[29].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[29].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, -OofBillard.HOLE2_W/2.0+OofBillard.HOLE2_TAN, 0.0 );
    walls.border[29].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[29].r2,walls.border[29].r1),OofVmath.vec_diff(walls.border[29].r3,walls.border[29].r1)));

    /* friction constants and loss factors */
    for(i=0;i<walls.nr;i++){
        walls.border[i].mu          = 0.1;
        walls.border[i].loss0       = 0.2;
        walls.border[i].loss_max    = 0.5;
        walls.border[i].loss_wspeed = 4.0;  /* [m/s] */
    }

    // holes
    {
        walls.holenr = 6;

        walls.hole = [];
        OofBillard.createHoleToArray(walls.hole, walls.holenr);

        /* middle right */
        walls.hole[0].aim = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE2_AIMOFFS, 0.0, 0.0 );
        walls.hole[0].pos = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+OofBillard.HOLE2_XYOFFS, 0.0, 0.0 );
        walls.hole[0].r   = OofBillard.HOLE2_R;
        /* middle left */
        walls.hole[1].aim = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE2_AIMOFFS, 0.0, 0.0 );
        walls.hole[1].pos = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-OofBillard.HOLE2_XYOFFS, 0.0, 0.0 );
        walls.hole[1].r   = OofBillard.HOLE2_R;
        /* upper right */
        walls.hole[2].aim = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_AIMOFFS, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_AIMOFFS, 0.0 );
        walls.hole[2].pos = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+OofBillard.HOLE1_XYOFFS, +OofBillard.TABLE_L/2.0+OofBillard.HOLE1_XYOFFS, 0.0 );
        walls.hole[2].r   = OofBillard.HOLE1_R;
        /* upper left */
        walls.hole[3].aim = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_AIMOFFS, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_AIMOFFS, 0.0 );
        walls.hole[3].pos = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-OofBillard.HOLE1_XYOFFS, +OofBillard.TABLE_L/2.0+OofBillard.HOLE1_XYOFFS, 0.0 );
        walls.hole[3].r   = OofBillard.HOLE1_R;
        // lower left
        walls.hole[4].aim = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_AIMOFFS, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_AIMOFFS, 0.0 );
        walls.hole[4].pos = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-OofBillard.HOLE1_XYOFFS, -OofBillard.TABLE_L/2.0-OofBillard.HOLE1_XYOFFS, 0.0 );
        walls.hole[4].r   = OofBillard.HOLE1_R;
        // lower right
        walls.hole[5].aim = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_AIMOFFS, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_AIMOFFS, 0.0 );
        walls.hole[5].pos = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+OofBillard.HOLE1_XYOFFS, -OofBillard.TABLE_L/2.0-OofBillard.HOLE1_XYOFFS, 0.0 );
        walls.hole[5].r   = OofBillard.HOLE1_R;
    }
    
    // ライン用も追加する
    OofBillard.create_6hole_walls_for_line(walls);
    
    // 内側のテーブルサイズを作成
    OofBillard.create_6hole_walls_for_inside_table(walls);
    
    // 外側のテーブルサイス作成
    OofBillard.create_6hole_walls_for_outside_table(walls);

    // ラインに外側のラインも追加する
    OofBillard.create_6hole_walls_for_outsideline(walls);

};

/***********************************************************************/


OofBillard.create_6hole_walls_for_line = function( walls ) {

    walls.lines = [];
    var work;

    // bonds 
    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.HOLE2_W/2.0, 0.0 );
    //work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.lines.push(work);

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, 0.0 );
    //work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.lines.push(work);

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0,              +OofBillard.HOLE2_W/2.0, 0.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.lines.push(work);

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0,              -OofBillard.HOLE2_W/2.0, 0.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.lines.push(work);

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, 0.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.lines.push(work);

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, 0.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.lines.push(work);

    /* edges */
    /* upper right */
    //work = new OofBorder();
    //work.pnr = OofBorderShape.LINE;
    //work.r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2,  OofBillard.BALL_D/2.0 );
    //walls.lines.push(work);
    
    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0,     +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0,     +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2,  OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, 0.0 );
    walls.lines.push(work);

    /* upper right */
    //walls.border[7].pnr = OofBorderShape.LINE;
    //walls.border[7].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    //walls.border[7].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, +OofBillard.TABLE_L/2.0+1.0, 0.0 );
    walls.lines.push(work);

    /* upper left */
    //walls.border[8].pnr = OofBorderShape.LINE;
    //walls.border[8].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    //walls.border[8].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, 0.0 );
    walls.lines.push(work);

    /* upper left */
    //walls.border[9].pnr = OofBorderShape.LINE;
    //walls.border[9].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    //walls.border[9].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, +OofBillard.TABLE_L/2.0+1.0, 0.0 );
    walls.lines.push(work);

    /* lower right */
    //walls.border[10].pnr = OofBorderShape.LINE;
    //walls.border[10].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    //walls.border[10].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, 0.0 );
    walls.lines.push(work);

    /* lower right */
    //walls.border[11].pnr = OofBorderShape.LINE;
    //walls.border[11].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    //walls.border[11].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    //
    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, -OofBillard.TABLE_L/2.0-1.0, 0.0 );
    walls.lines.push(work);

    /* lower left */
    //walls.border[12].pnr = OofBorderShape.LINE;
    //walls.border[12].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    //walls.border[12].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, 0.0 );
    walls.lines.push(work);

    /* lower left */
    //walls.border[13].pnr = OofBorderShape.LINE;
    //walls.border[13].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    //walls.border[13].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, -OofBillard.TABLE_L/2.0-1.0, 0.0 );
    walls.lines.push(work);

    /* middle left */
    //walls.border[14].pnr = OofBorderShape.LINE;
    //walls.border[14].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    //walls.border[14].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    
    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, OofBillard.HOLE2_W/2.0-OofBillard.HOLE2_TAN, 0.0 );
    walls.lines.push(work);

    /* middle left */
    //walls.border[15].pnr = OofBorderShape.LINE;
    //walls.border[15].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    //walls.border[15].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, -OofBillard.HOLE2_W/2.0+OofBillard.HOLE2_TAN, 0.0 );
    walls.lines.push(work);

    /* middle right */
    //walls.border[16].pnr = OofBorderShape.LINE;
    //walls.border[16].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    //walls.border[16].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    
    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, OofBillard.HOLE2_W/2.0-OofBillard.HOLE2_TAN, 0.0 );
    walls.lines.push(work);

    /* middle right */
    //walls.border[17].pnr = OofBorderShape.LINE;
    //walls.border[17].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    //walls.border[17].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    //
    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    //work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    work.r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, -OofBillard.HOLE2_W/2.0+OofBillard.HOLE2_TAN, 0.0 );
    walls.lines.push(work);
};

/***********************************************************************/

//
// ラインに外側のラインも追加する
//
OofBillard.create_6hole_walls_for_outsideline = function( walls ) {

    walls.outsideLeft = -(OofBillard.TABLE_W/2.0 + OofBillard.BALL_D + OofBillard.HOLE1_R);
    walls.outsideRight = +(OofBillard.TABLE_W/2.0 + OofBillard.BALL_D + OofBillard.HOLE1_R);
    walls.outsideTop = +(OofBillard.TABLE_L/2.0 + OofBillard.BALL_D + OofBillard.HOLE1_R);
    walls.outsideBottom = -(OofBillard.TABLE_L/2.0 + OofBillard.BALL_D + OofBillard.HOLE1_R);

    var work;
    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( walls.outsideLeft, walls.outsideTop, 0 );
    work.r2 = OofVmath.vec_xyz( walls.outsideLeft, walls.outsideBottom, 0 );
    walls.lines.push(work);
    
    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( walls.outsideRight, walls.outsideTop, 0 );
    work.r2 = OofVmath.vec_xyz( walls.outsideRight, walls.outsideBottom, 0 );
    walls.lines.push(work);

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( walls.outsideLeft, walls.outsideTop, 0 );
    work.r2 = OofVmath.vec_xyz( walls.outsideRight, walls.outsideTop, 0 );
    walls.lines.push(work);

    work = new OofBorder();
    work.pnr = OofBorderShape.LINE;
    work.r1 = OofVmath.vec_xyz( walls.outsideLeft, walls.outsideBottom, 0 );
    work.r2 = OofVmath.vec_xyz( walls.outsideRight, walls.outsideBottom, 0 );
    walls.lines.push(work);
};

/***********************************************************************/

OofBillard.create_6hole_walls_for_inside_table = function( walls ) {

    walls.insideLeft = -(OofBillard.TABLE_W/2.0 - OofBillard.BALL_D * 0.5);
    walls.insideRight = +(OofBillard.TABLE_W/2.0 - OofBillard.BALL_D * 0.5);
    walls.insideTop = +(OofBillard.TABLE_L/2.0 - OofBillard.BALL_D * 0.5);
    walls.insideBottom = -(OofBillard.TABLE_L/2.0 - OofBillard.BALL_D * 0.5);

};

//
// 外側のラインを作成
//
OofBillard.create_6hole_walls_for_outside_table = function( walls ) {

    walls.outsideLeft = -(OofBillard.TABLE_W/2.0 + OofBillard.BALL_D + OofBillard.HOLE1_R);
    walls.outsideRight = +(OofBillard.TABLE_W/2.0 + OofBillard.BALL_D + OofBillard.HOLE1_R);
    walls.outsideTop = +(OofBillard.TABLE_L/2.0 + OofBillard.BALL_D + OofBillard.HOLE1_R);
    walls.outsideBottom = -(OofBillard.TABLE_L/2.0 + OofBillard.BALL_D + OofBillard.HOLE1_R);

};

    
/***********************************************************************/

OofBillard.create_6hole_walls_snooker = function( walls ) {

    var i;

    /* borders */
    walls.nr=32;
    
    walls.border = [];
    OofBillard.createBorderToArray(walls.border, walls.nr);

    /* bonds */
    walls.border[0].pnr = OofBorderShape.TRIANGLE;
    walls.border[0].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[0].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0,              +OofBillard.HOLE2_W/2.0, 0.0 );
    walls.border[0].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[0].n  = OofVmath.vec_xyz( -1.0, 0.0, 0.0 );

    walls.border[1].pnr = OofBorderShape.TRIANGLE;
    walls.border[1].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[1].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0,              -OofBillard.HOLE2_W/2.0, 0.0 );
    walls.border[1].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[1].n  = OofVmath.vec_xyz( -1.0, 0.0, 0.0 );

    walls.border[2].pnr = OofBorderShape.TRIANGLE;
    walls.border[2].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[2].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0,              +OofBillard.HOLE2_W/2.0, 0.0 );
    walls.border[2].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[2].n  = OofVmath.vec_xyz( +1.0, 0.0, 0.0 );

    walls.border[3].pnr = OofBorderShape.TRIANGLE;
    walls.border[3].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[3].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0,              -OofBillard.HOLE2_W/2.0, 0.0 );
    walls.border[3].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[3].n  = OofVmath.vec_xyz( +1.0, 0.0, 0.0 );

    walls.border[4].pnr = OofBorderShape.TRIANGLE;
    walls.border[4].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[4].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, 0.0 );
    walls.border[4].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[4].n  = OofVmath.vec_xyz( 0.0, -1.0, 0.0 );

    walls.border[5].pnr = OofBorderShape.TRIANGLE;
    walls.border[5].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[5].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, 0.0 );
    walls.border[5].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[5].n  = OofVmath.vec_xyz( 0.0, +1.0, 0.0 );

    /* edges */
    /* upper right */
    walls.border[6].pnr = OofBorderShape.LINE;
    walls.border[6].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[6].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[18].pnr = OofBorderShape.TRIANGLE;
    walls.border[18].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[18].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[18].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, 0.0 );
    walls.border[18].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[18].r2,walls.border[18].r1),OofVmath.vec_diff(walls.border[18].r3,walls.border[18].r1)));

    /* upper right */
    walls.border[7].pnr = OofBorderShape.LINE;
    walls.border[7].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[7].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[19].pnr = OofBorderShape.TRIANGLE;
    walls.border[19].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[19].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[19].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, +OofBillard.TABLE_L/2.0+1.0, 0.0 );
    walls.border[19].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[19].r1,walls.border[19].r2),OofVmath.vec_diff(walls.border[19].r3,walls.border[19].r1)));

    /* upper left */
    walls.border[8].pnr = OofBorderShape.LINE;
    walls.border[8].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[8].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[20].pnr = OofBorderShape.TRIANGLE;
    walls.border[20].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[20].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[20].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, 0.0 );
    walls.border[20].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[20].r1,walls.border[20].r2),OofVmath.vec_diff(walls.border[20].r3,walls.border[20].r1)));

    /* upper left */
    walls.border[9].pnr = OofBorderShape.LINE;
    walls.border[9].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[9].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[21].pnr = OofBorderShape.TRIANGLE;
    walls.border[21].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[21].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, +OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[21].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, +OofBillard.TABLE_L/2.0+1.0, 0.0 );
    walls.border[21].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[21].r2,walls.border[21].r1),OofVmath.vec_diff(walls.border[21].r3,walls.border[21].r1)));

    /* lower right */
    walls.border[10].pnr = OofBorderShape.LINE;
    walls.border[10].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[10].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[22].pnr = OofBorderShape.TRIANGLE;
    walls.border[22].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[22].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[22].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, 0.0 );
    walls.border[22].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[22].r1,walls.border[22].r2),OofVmath.vec_diff(walls.border[22].r3,walls.border[22].r1)));

    /* lower right */
    walls.border[11].pnr = OofBorderShape.LINE;
    walls.border[11].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[11].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[23].pnr = OofBorderShape.TRIANGLE;
    walls.border[23].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[23].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[23].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_W/OofBillard.SQR2+OofBillard.HOLE1_TAN, -OofBillard.TABLE_L/2.0-1.0, 0.0 );
    walls.border[23].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[23].r2,walls.border[23].r1),OofVmath.vec_diff(walls.border[23].r3,walls.border[23].r1)));

    /* lower left */
    walls.border[12].pnr = OofBorderShape.LINE;
    walls.border[12].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[12].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[24].pnr = OofBorderShape.TRIANGLE;
    walls.border[24].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.BALL_D/2.0 );
    walls.border[24].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, OofBillard.BALL_D/2.0 );
    walls.border[24].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, 0.0 );
    walls.border[24].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[24].r2,walls.border[24].r1),OofVmath.vec_diff(walls.border[24].r3,walls.border[24].r1)));

    /* lower left */
    walls.border[13].pnr = OofBorderShape.LINE;
    walls.border[13].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[13].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[25].pnr = OofBorderShape.TRIANGLE;
    walls.border[25].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[25].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2, -OofBillard.TABLE_L/2.0, OofBillard.BALL_D/2.0 );
    walls.border[25].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_W/OofBillard.SQR2-OofBillard.HOLE1_TAN, -OofBillard.TABLE_L/2.0-1.0, 0.0 );
    walls.border[25].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[25].r1,walls.border[25].r2),OofVmath.vec_diff(walls.border[25].r3,walls.border[25].r1)));

    /* middle left */
    walls.border[14].pnr = OofBorderShape.LINE;
    walls.border[14].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[14].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[26].pnr = OofBorderShape.TRIANGLE;
    walls.border[26].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[26].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[26].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, OofBillard.HOLE2_W/2.0-OofBillard.HOLE2_TAN, 0.0 );
    walls.border[26].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[26].r2,walls.border[26].r1),OofVmath.vec_diff(walls.border[26].r3,walls.border[26].r1)));

    /* middle left */
    walls.border[15].pnr = OofBorderShape.LINE;
    walls.border[15].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[15].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[27].pnr = OofBorderShape.TRIANGLE;
    walls.border[27].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[27].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[27].r3 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-1.0, -OofBillard.HOLE2_W/2.0+OofBillard.HOLE2_TAN, 0.0 );
    walls.border[27].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[27].r1,walls.border[27].r2),OofVmath.vec_diff(walls.border[27].r3,walls.border[27].r1)));

    /* middle right */
    walls.border[16].pnr = OofBorderShape.LINE;
    walls.border[16].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[16].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[28].pnr = OofBorderShape.TRIANGLE;
    walls.border[28].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[28].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[28].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, OofBillard.HOLE2_W/2.0-OofBillard.HOLE2_TAN, 0.0 );
    walls.border[28].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[28].r1,walls.border[28].r2),OofVmath.vec_diff(walls.border[28].r3,walls.border[28].r1)));

    /* middle right */
    walls.border[17].pnr = OofBorderShape.LINE;
    walls.border[17].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[17].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[29].pnr = OofBorderShape.TRIANGLE;
    walls.border[29].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, -OofBillard.BALL_D/2.0 );
    walls.border[29].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.HOLE2_W/2.0, OofBillard.BALL_D/2.0 );
    walls.border[29].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+1.0, -OofBillard.HOLE2_W/2.0+OofBillard.HOLE2_TAN, 0.0 );
    walls.border[29].n  = OofVmath.vec_unit(OofVmath.vec_cross(OofVmath.vec_diff(walls.border[29].r2,walls.border[29].r1),OofVmath.vec_diff(walls.border[29].r3,walls.border[29].r1)));

    /* friction constants and loss factors */
    for(i=0;i<walls.nr;i++){
        walls.border[i].mu          = 0.1;
        walls.border[i].loss0       = 0.2;
        walls.border[i].loss_max    = 0.5;
        walls.border[i].loss_wspeed = 4.0;  /* [m/s] */
    }

    /* table surface */
    var TABLE_W2 = (OofBillard.TABLE_W-OofBillard.BALL_D*0.9);
    var TABLE_L2 = (OofBillard.TABLE_L-OofBillard.BALL_D*0.9);
    walls.border[30].pnr = OofBorderShape.TRIANGLE;
    walls.border[30].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[30].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[30].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[30].n  = OofVmath.vec_xyz( 0.0, 0.0, 1.0 );

    walls.border[31].pnr = OofBorderShape.TRIANGLE;
    walls.border[31].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[31].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[31].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[31].n  = OofVmath.vec_xyz( 0.0, 0.0, 1.0 );

    walls.border[30].mu          = 0.2;
    walls.border[30].loss0       = 0.6;
    walls.border[30].loss_max    = 0.99;
    walls.border[30].loss_wspeed = 1.5;
    walls.border[31].mu          = 0.2;
    walls.border[31].loss0       = 0.6;
    walls.border[31].loss_max    = 0.99;
    walls.border[31].loss_wspeed = 1.5;

    /* holes */
    walls.holenr = 6;
    walls.hole = [];
    OofBillard.createHoleToArray(walls.hole, walls.holenr);
    
    /* middle right */
    walls.hole[0].aim = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE2_AIMOFFS, 0.0, 0.0 );
    walls.hole[0].pos = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+OofBillard.HOLE2_XYOFFS, 0.0, 0.0 );
    walls.hole[0].r   = OofBillard.HOLE2_R;
    /* middle left */
    walls.hole[1].aim = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE2_AIMOFFS, 0.0, 0.0 );
    walls.hole[1].pos = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-OofBillard.HOLE2_XYOFFS, 0.0, 0.0 );
    walls.hole[1].r   = OofBillard.HOLE2_R;
    /* upper right */
    walls.hole[2].aim = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_AIMOFFS, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_AIMOFFS, 0.0 );
    walls.hole[2].pos = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+OofBillard.HOLE1_XYOFFS, +OofBillard.TABLE_L/2.0+OofBillard.HOLE1_XYOFFS, 0.0 );
    walls.hole[2].r   = OofBillard.HOLE1_R;
    /* upper left */
    walls.hole[3].aim = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_AIMOFFS, +OofBillard.TABLE_L/2.0-OofBillard.HOLE1_AIMOFFS, 0.0 );
    walls.hole[3].pos = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-OofBillard.HOLE1_XYOFFS, +OofBillard.TABLE_L/2.0+OofBillard.HOLE1_XYOFFS, 0.0 );
    walls.hole[3].r   = OofBillard.HOLE1_R;
    /* lower left */
    walls.hole[4].aim = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0+OofBillard.HOLE1_AIMOFFS, -OofBillard.TABLE_L/2.0-OofBillard.HOLE1_AIMOFFS, 0.0 );
    walls.hole[4].pos = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0-OofBillard.HOLE1_XYOFFS, -OofBillard.TABLE_L/2.0-OofBillard.HOLE1_XYOFFS, 0.0 );
    walls.hole[4].r   = OofBillard.HOLE1_R;
    /* lower right */
    walls.hole[5].aim = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0-OofBillard.HOLE1_AIMOFFS, -OofBillard.TABLE_L/2.0+OofBillard.HOLE1_AIMOFFS, 0.0 );
    walls.hole[5].pos = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0+OofBillard.HOLE1_XYOFFS, -OofBillard.TABLE_L/2.0-OofBillard.HOLE1_XYOFFS, 0.0 );
    walls.hole[5].r   = OofBillard.HOLE1_R;
};

/***********************************************************************/

OofBillard.create_0hole_walls = function( walls )
{
    var i;

    /* borders */
    walls.nr=6;

    walls.border = [];
    OofBillard.createBorderToArray(walls.border, walls.nr);

    /* bonds */

    walls.border[0].pnr = OofBorderShape.LINE;
    walls.border[0].r1 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, Oof.options_jump_shots ? 0.14*OofBillard.BALL_D : 0.0 );
    walls.border[0].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, Oof.options_jump_shots ? 0.14*OofBillard.BALL_D : 0.0 );

    walls.border[1].pnr = OofBorderShape.LINE;
    walls.border[1].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, Oof.options_jump_shots ? 0.14*OofBillard.BALL_D : 0.0 );
    walls.border[1].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, Oof.options_jump_shots ? 0.14*OofBillard.BALL_D : 0.0 );

    walls.border[2].pnr = OofBorderShape.LINE;
    walls.border[2].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, Oof.options_jump_shots ? 0.14*OofBillard.BALL_D : 0.0 );
    walls.border[2].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, Oof.options_jump_shots ? 0.14*OofBillard.BALL_D : 0.0 );

    walls.border[3].pnr = OofBorderShape.LINE;
    walls.border[3].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, Oof.options_jump_shots ? 0.14*OofBillard.BALL_D : 0.0 );
    walls.border[3].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, Oof.options_jump_shots ? 0.14*OofBillard.BALL_D : 0.0 );

    for(i=0;i<walls.nr;i++){
        walls.border[i].mu          = 0.12;
        walls.border[i].loss0       = 0.2;
        walls.border[i].loss_max    = 0.5;
        walls.border[i].loss_wspeed = 4.0;  /* [m/s] */
    }

    /* table surface */
    walls.border[4].pnr = OofBorderShape.TRIANGLE;
    walls.border[4].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[4].r2 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[4].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[4].n  = OofVmath.vec_xyz( 0.0, 0.0, 1.0 );

    walls.border[5].pnr = OofBorderShape.TRIANGLE;
    walls.border[5].r1 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, -OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[5].r3 = OofVmath.vec_xyz( +OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[5].r2 = OofVmath.vec_xyz( -OofBillard.TABLE_W/2.0, +OofBillard.TABLE_L/2.0, -OofBillard.BALL_D/2.0-0.0001 );
    walls.border[5].n  = OofVmath.vec_xyz( 0.0, 0.0, 1.0 );

    walls.border[4].mu          = 0.2;
    walls.border[4].loss0       = 0.6;
    walls.border[4].loss_max    = 0.9;
    walls.border[4].loss_wspeed = 2.0;
    walls.border[5].mu          = 0.2;
    walls.border[5].loss0       = 0.6;
    walls.border[5].loss_max    = 0.9;
    walls.border[5].loss_wspeed = 2.0;

    /* no holes */
    walls.holenr = 0;
    walls.hole = [];
};

/***********************************************************************/

OofBillard.create_8ball_scene = function( balls )
{
    var i,j;

    // balls
    balls.nr=16;
    balls.ball = [];
    OofBillard.createBallToArray(balls.ball, balls.nr);

    OofBillard.place8ballnrs(balls);

    for(i=0;i<balls.nr;i++){
        balls.ball[i].m = OofBillard.BALL_M;
        // I_kugel = (m.r^2)2/5 = (m.d^2)/10 
        balls.ball[i].I = OofBillard.BALL_M*OofBillard.BALL_D*OofBillard.BALL_D/10.0;
        balls.ball[i].d = OofBillard.BALL_D;
        balls.ball[i].v = OofVmath.vec_xyz(0.0,0.0,0.0);
        balls.ball[i].w = OofVmath.vec_xyz(0.0,0.0,0.0);
        
        if (Oof.options_random_rotation) {
            balls.ball[i].b[0] = OofVmath.vec_unit(OofVmath.vec_xyz(Math.random(),Math.random(),Math.random()));
            var vdummy = OofVmath.vec_xyz(Math.random(),Math.random(),Math.random());
            balls.ball[i].b[1] = OofVmath.vec_unit(OofVmath.vec_diff(vdummy,OofVmath.vec_proj(vdummy,balls.ball[i].b[0])));
            balls.ball[i].b[2] = OofVmath.vec_cross(balls.ball[i].b[0],balls.ball[i].b[1]);
        }
        else {
            balls.ball[i].orientation.setFromEulerAngles(-90,0,0);
        }
        
        balls.ball[i].in_game = 1;
        balls.ball[i].in_hole = 0;
    }
    
    // 基本位置
    var basePosition1 = OofVmath.vec_xyz(0.0,-OofBillard.TABLE_L/4.0,0.0);
    
    // add randomness to init positions
    if (Oof.options_random_position) {
        var BALL_OFFSET = 0.0001;
        basePosition1.x += Math.random() * BALL_OFFSET;
        basePosition1.y += Math.random() * BALL_OFFSET;
    }

    // ボール同士の隙間 隙間を空けないとめり込む
    var BALL_GAP = 0.000;
    var dball1 = OofVmath.vec_scale( OofVmath.vec_xyz(-0.5, -0.5*Math.sqrt(3.0), 0.0), OofBillard.BALL_D + BALL_GAP );
    var dball2 = OofVmath.vec_scale( OofVmath.vec_xyz( 1.0,                 0.0, 0.0), OofBillard.BALL_D + BALL_GAP );
    
    // white ball
    balls.ball[0].r = OofVmath.vec_xyz(0.0,OofBillard.TABLE_L/4.0,0.0);
    // other balls
    balls.ball[ 1].r = basePosition1;
    balls.ball[ 2].r = OofVmath.vec_add( balls.ball[ 1].r, dball1 );
    balls.ball[ 3].r = OofVmath.vec_add( balls.ball[ 2].r, dball2 );
    balls.ball[ 4].r = OofVmath.vec_add( balls.ball[ 2].r, dball1 );
    balls.ball[ 5].r = OofVmath.vec_add( balls.ball[ 4].r, dball2 );
    balls.ball[ 6].r = OofVmath.vec_add( balls.ball[ 5].r, dball2 );
    balls.ball[ 7].r = OofVmath.vec_add( balls.ball[ 4].r, dball1 );
    balls.ball[ 8].r = OofVmath.vec_add( balls.ball[ 7].r, dball2 );
    balls.ball[ 9].r = OofVmath.vec_add( balls.ball[ 8].r, dball2 );
    balls.ball[10].r = OofVmath.vec_add( balls.ball[ 9].r, dball2 );
    balls.ball[11].r = OofVmath.vec_add( balls.ball[ 7].r, dball1 );
    balls.ball[12].r = OofVmath.vec_add( balls.ball[11].r, dball2 );
    balls.ball[13].r = OofVmath.vec_add( balls.ball[12].r, dball2 );
    balls.ball[14].r = OofVmath.vec_add( balls.ball[13].r, dball2 );
    balls.ball[15].r = OofVmath.vec_add( balls.ball[14].r, dball2 );
    
    // 位置入れ替え
    {
        // 5 -> 8
        MiscUtility.swapClone(balls.ball[5], balls.ball[8], "r");
        // 15 -> 2
        MiscUtility.swapClone(balls.ball[15], balls.ball[2], "r");
        // 9, 10, 12, 13, 14, 3, 4, 5, 6, 7
        MiscUtility.swapClone(balls.ball[9], balls.ball[ MiscUtility.randomIntegerMinMax(3,7) ], "r");
        MiscUtility.swapClone(balls.ball[10], balls.ball[ MiscUtility.randomIntegerMinMax(3,7) ], "r");
        MiscUtility.swapClone(balls.ball[12], balls.ball[ MiscUtility.randomIntegerMinMax(3,7) ], "r");
        MiscUtility.swapClone(balls.ball[13], balls.ball[ MiscUtility.randomIntegerMinMax(3,7) ], "r");
        MiscUtility.swapClone(balls.ball[14], balls.ball[ MiscUtility.randomIntegerMinMax(3,7) ], "r");
    }
    

};

/***********************************************************************/

OofBillard.place9ballnrs = function( balls ) {
    for(var i=0;i<balls.nr;i++){
        balls.ball[i].nr=i;
    }
};

/***********************************************************************/

OofBillard.create_9ball_scene = function( balls ) {

    var i;

    // balls
    balls.nr=10;
    balls.ball = [];
    OofBillard.createBallToArray(balls.ball, balls.nr);

    OofBillard.place9ballnrs(balls);

    for(i=0;i<balls.nr;i++){
        balls.ball[i].m=OofBillard.BALL_M;
        // I_kugel = (m.r^2)2/5 = (m.d^2)/10 
        balls.ball[i].I=OofBillard.BALL_M*OofBillard.BALL_D*OofBillard.BALL_D/10.0;
        balls.ball[i].d=OofBillard.BALL_D;
        balls.ball[i].v=OofVmath.vec_xyz(0.0,0.0,0.0);
        balls.ball[i].w=OofVmath.vec_xyz(0.0,0.0,0.0);
        if (Oof.options_random_rotation) {
            balls.ball[i].b[0]=OofVmath.vec_unit(OofVmath.vec_xyz(Math.random(),Math.random(),Math.random()));
            var vdummy = OofVmath.vec_xyz(Math.random(),Math.random(),Math.random());
            balls.ball[i].b[1]=OofVmath.vec_unit(OofVmath.vec_diff(vdummy,OofVmath.vec_proj(vdummy,balls.ball[i].b[0])));
            balls.ball[i].b[2]=OofVmath.vec_cross(balls.ball[i].b[0],balls.ball[i].b[1]);
        }
        else {
            balls.ball[i].orientation.setFromEulerAngles(-90,0,0);
        }
        balls.ball[i].in_game = true;
        balls.ball[i].in_hole=0;
    }
    
    var basePosition1 = OofVmath.vec_xyz(0.0,-OofBillard.TABLE_L/4.0,0.0);
    // add randomness to init positions
    if (Oof.options_random_position) {
        var BALL_OFFSET = 0.0001;
        basePosition1.x += Math.random() * BALL_OFFSET;
        basePosition1.y += Math.random() * BALL_OFFSET;
    }

    // ボール同士の隙間 隙間を空けないとめり込む
    var BALL_GAP = 0.0000001 + Number.EPSILON;
    var dball1 = OofVmath.vec_scale(OofVmath.vec_xyz(-0.5*1.01, -0.5*Math.sqrt(3.0)*1.01, 0.0), OofBillard.BALL_D + BALL_GAP);
    var dball2 = OofVmath.vec_scale(OofVmath.vec_xyz(+0.5*1.01, -0.5*Math.sqrt(3.0)*1.01, 0.0), OofBillard.BALL_D + BALL_GAP);
    
    // white ball
    balls.ball[0].r = OofVmath.vec_xyz(0.0,+OofBillard.TABLE_L/4.0,0.0);
    // other balls
    balls.ball[ 1].r = basePosition1;
    balls.ball[ 2].r = OofVmath.vec_add( balls.ball[1].r, OofVmath.vec_scale(dball2,2.0) );
    balls.ball[ 3].r = OofVmath.vec_add( balls.ball[2].r, OofVmath.vec_scale(dball1,2.0) );
    balls.ball[ 4].r = OofVmath.vec_add( balls.ball[1].r, OofVmath.vec_scale(dball1,2.0) );
    balls.ball[ 5].r = OofVmath.vec_add( balls.ball[1].r, dball1 );
    balls.ball[ 6].r = OofVmath.vec_add( balls.ball[1].r, dball2 );
    balls.ball[ 7].r = OofVmath.vec_add( balls.ball[2].r, dball1 );
    balls.ball[ 8].r = OofVmath.vec_add( balls.ball[4].r, dball2 );
    balls.ball[ 9].r = OofVmath.vec_add( balls.ball[1].r, OofVmath.vec_add(dball1,dball2) );

};

/***********************************************************************/

OofBillard.placecarambolballnrs = function( balls ) {
    var i;
    for(i=0;i<balls.nr;i++){
        balls.ball[i].nr=i;
    }
};

/***********************************************************************/

OofBillard.create_carambol_scene = function( balls ) {

    var i;
    var vdummy;

    /* balls */
    balls.nr=3;
    balls.ball = [];
    OofBillard.createBallToArray(balls.ball, balls.nr);

    OofBillard.placecarambolballnrs(balls);

    for(i=0;i<balls.nr;i++){
        balls.ball[i].nr=i;
    }

    for(i=0;i<balls.nr;i++){
        balls.ball[i].m=OofBillard.BALL_M;
        /* I_kugel = (m.r^2)2/5 = (m.d^2)/10 */
        balls.ball[i].I=OofBillard.BALL_M*OofBillard.BALL_D*OofBillard.BALL_D/10.0/**0.01*/;
        balls.ball[i].d=OofBillard.BALL_D;
        balls.ball[i].v=OofVmath.vec_xyz(0.0,0.0,0.0);
        balls.ball[i].w=OofVmath.vec_xyz(0.0,0.0,0.0);
        balls.ball[i].b[0]=OofVmath.vec_unit(OofVmath.vec_xyz(Math.random(),Math.random(),Math.random()));
        vdummy=OofVmath.vec_xyz(Math.random(),Math.random(),Math.random());
        balls.ball[i].b[1]=OofVmath.vec_unit(OofVmath.vec_diff(vdummy,OofVmath.vec_proj(vdummy,balls.ball[i].b[0])));
        balls.ball[i].b[2]=OofVmath.vec_cross(balls.ball[i].b[0],balls.ball[i].b[1]);
        balls.ball[i].in_game=true;
        balls.ball[i].in_hole=0;
    }

    /* white ball */
    balls.ball[0].r = OofVmath.vec_xyz( OofBillard.TABLE_W/4.0, -OofBillard.TABLE_L/4.0, 0.0 );
    balls.ball[1].r = OofVmath.vec_xyz(         0.0, -OofBillard.TABLE_L/4.0, 0.0 );
    balls.ball[2].r = OofVmath.vec_xyz(         0.0, +OofBillard.TABLE_L/4.0, 0.0 );
};

/***********************************************************************/

OofBillard.placesnookerballnrs = function( balls )
{
    var i;
    for(i=0;i<balls.nr;i++){
        balls.ball[i].nr=i;
    }
};

/***********************************************************************/

OofBillard.try_snooker_spot = function(balls, spot) {

    var i;
    var available=1;
    
   for(i=0;i<22;i++) {
      if(balls.ball[i].in_game && OofVmath.vec_abs(OofVmath.vec_diff(spot,balls.ball[i].r)) < (balls.ball[i].d) + 0.001) {
         available=0;
       }
   }
   return available;
};

/***********************************************************************/

OofBillard.spot_snooker_ball = function(balls, nr)
{
    var TABLE_SCALE = (OofBillard.TABLE_L/(3.571042));

    var i,found=0;
    var spots = [];

    spots[0]=OofVmath.vec_xyz(0.1,-OofBillard.TABLE_L/2+TABLE_SCALE*0.737,0.0);/*white*/
    spots[2]=OofVmath.vec_xyz(TABLE_SCALE*0.292,-OofBillard.TABLE_L/2+TABLE_SCALE*0.737,0.0);/*yellow*/
    spots[3]=OofVmath.vec_xyz(-TABLE_SCALE*0.292,-OofBillard.TABLE_L/2+TABLE_SCALE*0.737,0.0);/*green*/
    spots[4]=OofVmath.vec_xyz(0.0,-OofBillard.TABLE_L/2+TABLE_SCALE*0.737,0.0);/*brown*/
    spots[5]=OofVmath.vec_xyz(0.0,0.0,0.0);/*blue*/
    spots[6]=OofVmath.vec_xyz(0.0,OofBillard.TABLE_L/4.0,0.0);/*pink*/
    spots[7]=OofVmath.vec_xyz(0.0,OofBillard.TABLE_L/2-TABLE_SCALE*0.324,0.0);/*black*/

    balls.ball[nr].in_game=false;

    if(try_snooker_spot(balls,spots[nr])) {
        balls.ball[nr].r=spots[nr];
        found=1;
      } else {
         i=7;
         while(i>=2 && !found) {
           if(try_snooker_spot(balls,spots[i])) {
             balls.ball[nr].r=spots[i];
             found=1;
            }
          i--;
         }
      }
    if(!found) {
        var tryp = spots[nr];
        while(!try_snooker_spot(balls,tryp)) {
           tryp.y-=0.001;
          }
        balls.ball[nr].r=tryp;
      }
    balls.ball[nr].in_game=true;
    balls.ball[nr].in_hole=0;
    balls.ball[nr].v=OofVmath.vec_xyz(0.0,0.0,0.0);
    balls.ball[nr].w=OofVmath.vec_xyz(0.0,0.0,0.0);
};

/***********************************************************************/

OofBillard.create_snooker_scene = function( balls )
{
    var i;
    var dball1, dball2, vdummy;
    var ang, ampl;
    var verr;

    /* balls */
    balls.nr=22;
    balls.ball = [];
    OofBillard.createBallToArray(balls.ball, balls.nr);

    OofBillard.placesnookerballnrs(balls);

    for(i=0;i<balls.nr;i++){
        balls.ball[i].m=OofBillard.BALL_M;
        /* I_kugel = (m.r^2)2/5 = (m.d^2)/10 */
        balls.ball[i].I=OofBillard.BALL_M*OofBillard.BALL_D*OofBillard.BALL_D/10.0/**0.01*/;
        balls.ball[i].d=OofBillard.BALL_D;
        balls.ball[i].r = OofVmath.vec_xyz(OofBillard.TABLE_L*3,OofBillard.TABLE_L*3,0.0); /* get balls out of the way */
        balls.ball[i].v=OofVmath.vec_xyz(0.0,0.0,0.0);
        balls.ball[i].w=OofVmath.vec_xyz(0.0,0.0,0.0);
        balls.ball[i].b[0]=OofVmath.vec_unit(OofVmath.vec_xyz(Math.random(),Math.random(),Math.random()));
        vdummy=OofVmath.vec_xyz(Math.random(),Math.random(),Math.random());
        balls.ball[i].b[1]=OofVmath.vec_unit(OofVmath.vec_diff(vdummy,OofVmath.vec_proj(vdummy,balls.ball[i].b[0])));
        balls.ball[i].b[2]=OofVmath.vec_cross(balls.ball[i].b[0],balls.ball[i].b[1]);
        balls.ball[i].in_game=true;
        balls.ball[i].in_hole=0;
    }

    dball1=OofVmath.vec_scale(OofVmath.vec_xyz(-0.5*1.01, 0.5*Math.sqrt(3.0)*1.01,0.0),OofBillard.BALL_D);
    dball2=OofVmath.vec_scale(OofVmath.vec_xyz( 1.01,      0.0,     0.0),OofBillard.BALL_D);
    /* red balls */
    balls.ball[ 1].r = OofVmath.vec_xyz(0.0,OofBillard.TABLE_L/4.0+1.1*OofBillard.BALL_D,0.0);
    balls.ball[ 8].r = OofVmath.vec_add( balls.ball[ 1].r, dball1 );
    balls.ball[ 9].r = OofVmath.vec_add( balls.ball[ 8].r, dball2 );
    balls.ball[10].r = OofVmath.vec_add( balls.ball[ 8].r, dball1 );
    balls.ball[11].r = OofVmath.vec_add( balls.ball[10].r, dball2 );
    balls.ball[12].r = OofVmath.vec_add( balls.ball[11].r, dball2 );
    balls.ball[13].r = OofVmath.vec_add( balls.ball[10].r, dball1 );
    balls.ball[14].r = OofVmath.vec_add( balls.ball[13].r, dball2 );
    balls.ball[15].r = OofVmath.vec_add( balls.ball[14].r, dball2 );
    balls.ball[16].r = OofVmath.vec_add( balls.ball[15].r, dball2 );
    balls.ball[17].r = OofVmath.vec_add( balls.ball[13].r, dball1 );
    balls.ball[18].r = OofVmath.vec_add( balls.ball[17].r, dball2 );
    balls.ball[19].r = OofVmath.vec_add( balls.ball[18].r, dball2 );
    balls.ball[20].r = OofVmath.vec_add( balls.ball[19].r, dball2 );
    balls.ball[21].r = OofVmath.vec_add( balls.ball[20].r, dball2 );

    /* color balls */
    for(i=7;i>=2;i--) {
        spot_snooker_ball(balls,i);
      }
    /* white ball */
    spot_snooker_ball(balls,0);

    /* add randomness to init positions */
    for( i=1 ; i<balls.nr ; i++ ){
        ang  = Math.random()*2.0*OofVmath.M_PI;
        ampl = Math.random()*0.0049*OofBillard.BALL_D;
        verr = OofVmath.vec_scale(
            OofVmath.vec_xyz(
                Math.cos(ang),
                Math.sin(ang),
                0.0
            ),
            ampl
        );
        balls.ball[i].r = OofVmath.vec_add( balls.ball[i].r, verr );
    }

    balls.ball[0].v=OofVmath.vec_xyz(0.0,0.0,0.0);
};

/***********************************************************************/

//
// 対象の配列に指定数ボールを作成する
//
OofBillard.createBallToArray = function(targetArray, count) {

    for (var i=0; i<count; i++) {
        targetArray[i] = new OofBall();
    }
};

//
// 対象の配列に指定数Border壁を作成する
//
OofBillard.createBorderToArray = function(targetArray, count) {

    for (var i=0; i<count; i++) {
        targetArray[i] = new OofBorder();
        targetArray[i].borderId = i + 1;
    }
};

//
// 対象の配列に指定数Hole 穴を作成する
//
OofBillard.createHoleToArray = function(targetArray, count) {

    for (var i=0; i<count; i++) {
        targetArray[i] = new OofHole();
    }
};



//
// 0番以外無効
//
OofBillard.create_ball1_scene = function( balls ) {

    OofBillard.create_8ball_scene(balls);

    var max = balls.nr;
    for(var i=0; i<max; i++){
        if (i <= 0) {
            continue;
        }
        balls.ball[i].in_game = false;
    }

};

//
// 0番 1番 以外無効
//
OofBillard.create_ball2_scene = function( balls ) {

    OofBillard.create_8ball_scene(balls);

    var max = balls.nr;
    for(var i=0; i<max; i++){
        if (i <= 1) {
            continue;
        }
        balls.ball[i].in_game = false;
    }

};
