$.fn.exists = function(){
	return $(this).length > 0;
}

$(document).ready(function(){

	var Move = {
		RIGHT:39,
		LEFT:37
	};
    var message = {
        GAMEOVER: 1,
        RESUME: 2,
        WIN: 3
    };
    var button = {
        START: 1,
        PAUSE: 2,
        RESUME: 3
    };

    var BreakOut = {
        gameContext: null,
        canvas: {min:0,max:0},
        allowPressKeys: true,
        screen: $("#gameScreen"),
        allowPressKeys: false,
        score: 0,
        movement: null,
        status: "start",
        ballPosition: {x:50, y:50},
        ballSpeed: {x:2,y:4},
        ballDirection: {x:5,y:5},
        ballWidth: 16,
        platform: {w:100,h:10, direction:"",speed:5},
        platformPosition: {x:$("#gameScreen").width()/2, y:$("#gameScreen").height()-20},
        bricks: {values:null,rows:0, cols:0, w:0, h:0, p:0},
        draw: function(){
            BreakOut.gameContext.fillStyle = "#333";
            BreakOut.clearScreen();
            BreakOut.gameContext.fillStyle = "#FFF";
            BreakOut.createRect(BreakOut.platformPosition.x, BreakOut.platformPosition.y, BreakOut.platform.w, BreakOut.platform.h);
            BreakOut.createCircle(BreakOut.ballPosition.x, BreakOut.ballPosition.y, BreakOut.ballWidth/2);

            BreakOut.drawBricks();

            if ( BreakOut.collide() ){
                BreakOut.ballSpeed.y = -BreakOut.ballSpeed.y;
                if (BreakOut.complete()){
                    BreakOut.win();
                }
            }

            if ( BreakOut.ballPosition.x + BreakOut.ballSpeed.x < 0 || BreakOut.ballPosition.x + BreakOut.ballSpeed.x > BreakOut.screen.width() ){
                BreakOut.ballSpeed.x = -BreakOut.ballSpeed.x;
            }

            if ( BreakOut.ballPosition.y + BreakOut.ballSpeed.y < 0 ){
                BreakOut.ballSpeed.y = -BreakOut.ballSpeed.y;
            } else if ( BreakOut.ballPosition.y + BreakOut.ballSpeed.y > BreakOut.screen.height() - 20 /*&& BreakOut.ballPosition.y + BreakOut.ballSpeed.y < BreakOut.screen.height() - 10 */){

                if ( BreakOut.ballPosition.x + 20 > BreakOut.platformPosition.x && BreakOut.ballPosition.x < BreakOut.platformPosition.x + 20 + BreakOut.platform.w){
                    BreakOut.ballSpeed.y = -BreakOut.ballSpeed.y;
                    BreakOut.ballSpeed.x = 5 * ( (BreakOut.ballPosition.x - (BreakOut.platformPosition.x+BreakOut.platform.w/2))/BreakOut.platform.w );

                } else if ( BreakOut.ballPosition.y > BreakOut.screen.height()+10 ) {
                    BreakOut.gameOver();
                    clearInterval(BreakOut.movement);
                }
            }

        },
        complete: function(){
            for (var i=0; i<BreakOut.bricks.rows; i++){
                for (var j=0; j<BreakOut.bricks.cols; j++){
                    if ( !BreakOut.bricks.values[i][j].hit ){
                        return false;
                    }
                }
            }
            return true;
        },
        drawBricks: function(){
          for (i=0; i < BreakOut.bricks.rows; i++) {
            for (j=0; j < BreakOut.bricks.cols; j++) {
                BreakOut.gameContext.fillStyle = BreakOut.bricks.values[i][j].color;
              if (!BreakOut.bricks.values[i][j].hit) {
                  var x = j * (BreakOut.bricks.w + BreakOut.bricks.p);
                  var y = i * (BreakOut.bricks.h + BreakOut.bricks.p) + BreakOut.bricks.p;
                  var w = BreakOut.bricks.w;
                  var h = BreakOut.bricks.h;
                  BreakOut.createRect(x, y, w, h);
              }
            }
          }
        },
        createCircle: function(x, y, r){
            BreakOut.gameContext.beginPath();
            BreakOut.gameContext.arc(x, y, r, 0, Math.PI*2, true);
            BreakOut.gameContext.closePath();
            BreakOut.gameContext.fill();
        },
        createRect: function(x, y, w, h){
            BreakOut.gameContext.beginPath();
            BreakOut.gameContext.rect(x, y, w, h);
            BreakOut.gameContext.closePath();
            BreakOut.gameContext.fill();
        },
        clearScreen: function(){
          BreakOut.gameContext.clearRect(0, 0, BreakOut.screen.width(), BreakOut.screen.height());
          BreakOut.createRect(0, 0, BreakOut.screen.width(), BreakOut.screen.height());
        },
        init: function(){

            BreakOut.canvas.min = BreakOut.screen.offset().left;
            BreakOut.canvas.max = BreakOut.canvas.min + BreakOut.screen.width() - BreakOut.platform.w +20;
            BreakOut.bricks.cols = 10;
            BreakOut.bricks.rows = 6;
            BreakOut.bricks.w = BreakOut.screen.width()/BreakOut.bricks.cols;
            BreakOut.bricks.h = 20;
            BreakOut.bricks.p = 1;

            BreakOut.bricks.values = new Array(BreakOut.bricks.rows);
            var change = 5;

            for (i=0; i < BreakOut.bricks.rows; i++) {
                BreakOut.bricks.values[i] = new Array(BreakOut.bricks.cols);
                var r = parseInt(Math.random()*256);
                var b = parseInt(Math.random()*256);
                var g = parseInt(Math.random()*256);
                var c = parseInt(Math.random()*3);
                //var color = "rgb("+r+","+b+","+g+")";

                switch(c){
                    case 0:
                        if ( ((r*change) > 255 && change > 0) || ((r*change) < 0 && change < 0 ) ){
                            change = -change;
                        }
                        r = r*change;
                        break;
                    case 1:
                        if ( ((b*change) > 255 && change > 0) || ((b*change) < 0 && change < 0 ) ){
                            change = -change;
                        }
                        b = b*change;
                        break;
                    case 2:
                        if ( ((g*change) > 255 && change > 0) || ((g*change) < 0 && change < 0 ) ){
                            change = -change;
                        }
                        g = g*change;
                        break;
                }
                color = "rgb("+r+","+b+","+g+")";
                for (j=0; j < BreakOut.bricks.cols; j++) {
                    BreakOut.bricks.values[i][j] = {
                        hit:false,
                        color:color
                    };
                }
            }

            BreakOut.ballPosition.y = BreakOut.ballWidth + (BreakOut.bricks.rows * BreakOut.bricks.h);

        },
        start: function(){
            BreakOut.status = "playing";
            $("#score").text("0");
            BreakOut.init();
            BreakOut.movement = setInterval(BreakOut.ballMove, 10);
            BreakOut.allowPressKeys = true;
            BreakOut.showButton(button.PAUSE);
        },
        reset: function(){
            BreakOut.allowPressKeys= false;
            BreakOut.score= 0;
            BreakOut.movement= null;
            BreakOut.status= "start";
            BreakOut.ballPosition.x=50;
            BreakOut.ballPosition.y = BreakOut.ballWidth + (BreakOut.bricks.rows * BreakOut.bricks.h);
            BreakOut.ballSpeed= {x:2,y:4};
            BreakOut.ballDirection= {x:5,y:5};
            BreakOut.score = 0;
            BreakOut.status = "start";
        },
        pause: function(){
          clearInterval(BreakOut.movement);
          BreakOut.allowPressKeys = false;
          BreakOut.showButton(button.RESUME);
        },
        resume: function(){
            BreakOut.movement = setInterval(BreakOut.ballMove,10);
            BreakOut.allowPressKeys = true;
            BreakOut.showButton(button.PAUSE);
        },
        gameOver: function(){
            //BreakOut.reset();
            BreakOut.pause();
            BreakOut.reset();
            BreakOut.showMessage(message.GAMEOVER);
            BreakOut.showButton(button.START);
        },
        win: function(){
            BreakOut.pause();
            BreakOut.reset();
            BreakOut.showMessage(message.WIN);
            BreakOut.showButton(button.START);
        },
        showMessage: function(type){

            switch ( type ){
                case message.GAMEOVER:
                    $("#message").text("You Lost!");
                    break;
                case message.RESUME:
                    $("#message").text("click Resume to Continue");
                    break;
                case message.WIN:
                    $("#message").text("You Win! Dows XP");
                    break;
            }
            $("#message").fadeIn('fast');
            $("#messageBackground").fadeIn('fast');
        },
        collide: function(){
            var h = BreakOut.bricks.h + BreakOut.bricks.p;
            var w = BreakOut.bricks.w + BreakOut.bricks.p;
            var r = parseInt(Math.floor(BreakOut.ballPosition.y/h));
            var c = parseInt(Math.floor(BreakOut.ballPosition.x/w));

            if ( BreakOut.ballPosition.y < BreakOut.ballWidth + (BreakOut.bricks.rows * BreakOut.bricks.h) && !BreakOut.bricks.values[r][c].hit ){
                BreakOut.bricks.values[r][c].hit = true;
                BreakOut.score += 10;
                $("#score").text(BreakOut.score);
                return true;
            }

            return false;
        },
        ballMove: function(){

            if ( BreakOut.platform.direction != "" ){
                switch (BreakOut.platform.direction){
                    case "left":
                        BreakOut.platformPosition.x -= BreakOut.platform.speed;
                        break;
                    case "right":
                        BreakOut.platformPosition.x += BreakOut.platform.speed;
                        break;
                }
            }

            BreakOut.ballPosition.x += BreakOut.ballSpeed.x;//(BreakOut.ballDirection.x + BreakOut.ballSpeed.x);
            BreakOut.ballPosition.y += BreakOut.ballSpeed.y;//(BreakOut.ballDirection.y + BreakOut.ballSpeed.y);
            BreakOut.draw();
        },
        handleMove: function(){
			$(document).keydown(function(e){
                if ( !BreakOut.allowPressKeys ){
                    return false;
                }
				var key = e.charCode || e.keyCode || 0;
				if ( key == null){
					key = window.event.charCode || window.event.keyCode || 0;
				}
				switch(key){
					case Move.RIGHT:
                        BreakOut.platform.direction = "right";
						break;
					case Move.LEFT:
                        BreakOut.platform.direction = "left";
						break;
					default:
						break;
				}

			});

            $(document).keyup(function(e){
                if ( !BreakOut.allowPressKeys ){
                    return false;
                }
				var key = e.charCode || e.keyCode || 0;
				if ( key == null){
					key = window.event.charCode || window.event.keyCode || 0;
				}
				switch(key){
					case Move.RIGHT:
                        BreakOut.platform.direction = "";
						break;
					case Move.LEFT:
                        BreakOut.platform.direction = "";
						break;
					default:
						break;
				}

			});

            $(document).mousemove(function(e){
                if ( !BreakOut.allowPressKeys ){
                    return false;
                }
                if ( e.pageX > BreakOut.canvas.min && e.pageX < BreakOut.canvas.max){
                    BreakOut.platformPosition.x = e.pageX - BreakOut.canvas.min;
                }
            });
        },
        hideMessage: function(){
          $("#message").fadeOut('fast');
          $("#messageBackground").fadeOut('fast');
        },
        showButton: function(type){
            switch(type){
                case button.START:
                    $("#pauseStart").attr('value','Start');
                    break;
                case button.PAUSE:
                    $("#pauseStart").attr('value','Pause');
                    break;
                case button.RESUME:
                    $("#pauseStart").attr('value','Resume');
                    break;
            }
        }
    };

    if ( $('#gameScreen').exists() ){
		BreakOut.gameContext = $('#gameScreen').get(0).getContext('2d');
	} else {
		$("#gameScreen").before("<h1>Que Carajo, tu explorador web no soporta HTML5, seguro usas IE</h1>");
	}

    $("#restart").click(function(){
            BreakOut.pause();
            BreakOut.reset();
            BreakOut.start();
            BreakOut.hideMessage();

    });

    $("#pauseStart").click(function(){

        switch (BreakOut.status){
            case "start":
                BreakOut.status = "playing";
                BreakOut.start();
                BreakOut.hideMessage();
                break;
            case "playing":
                BreakOut.status = "pause";
                BreakOut.pause();
                BreakOut.showMessage(message.RESUME);
                break;
            case "pause":
                BreakOut.status = "playing";
                BreakOut.resume();
                BreakOut.hideMessage();
        }

    });

    BreakOut.init();
    BreakOut.handleMove();

});
