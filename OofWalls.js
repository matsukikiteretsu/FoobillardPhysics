//
// OofWalls
//
function OofWalls() {
    this.initialize();
}

OofWalls.prototype.initialize = function() {

    // 壁の数
    this.nr = 0;

    // 壁
    this.border = [new OofBorder()];

    // line OofBorder()
    // 予測線用のライン
    this.lines = [new OofBorder()];

    // ミッション用の追加ライン
    this.extraLinesForMission = [];
    
    // ポケット数
    this.holenr = 0;

    // ポケット
    this.hole = [new OofHole()];
    
    // 内側のテーブル
    this.insideLeft = 0;
    this.insideRight = 0;
    this.insideBottom = 0;
    this.insideTop = 0;

    // 外側のテーブル
    this.outsideLeft = 0;
    this.outsideRight = 0;
    this.outsideBottom = 0;
    this.outsideTop = 0;
};
