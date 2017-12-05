//
// OofPlayer
//
function OofPlayer() {
    this.initialize();
}

OofPlayer.prototype.initialize = function() {
    
    this.is_AI = 0;
    this.is_net = 0;
    this.half_full = 0;
    this.queue_view = 0;
    this.winner = 0;
    this.cue_x = 0;
    this.cue_y = 0;
    this.strength = 0;

    /* err-ability of ai player */
    this.err = 0;

    this.name = "";
    this.text = null;
    this.textObj = null;
        
    /* 1: player is on red,   0: player is on coloured */
    this.snooker_on_red = 0;
    
    /* if all reds are gone : 0/1: any color, other : color to play*/
    this.snooker_next_color = 0;
    this.score = 0;

    /* index of cue ball for this player */
    this.cue_ball = 0;

    /* next ball to play in 9ball */
    this.next_9ball = 0;


};
