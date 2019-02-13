var currentPage = 0;

var resizedImage;
var imageBall;
var imgMask;
var name = "";
var gameEntered=false;
var clawImg;

var canvasScale = .7;
var windowWidth;
// var myShakeEvent;

var gameStarted = false;
var second;

$(document).ready(function(){


			console.log("confetti started");
	startConfetti();
	particleSpeed = .2;
	maxParticleCount = 100;





	$('.next').click(function(){
		removeConfetti();


		 var sections = $(".section");
		
		if (currentPage < sections.length){
			 $(sections[currentPage]).hide();
		    currentPage++;
		    nextSection = sections[currentPage];
		    $(nextSection).show();
		}

	});







});

function updateTime(){
	second= second + 1;
	console.log(second);
}

	$(".enterGame").click(function(){
		second = 0;
		gameEntered = true;
		$("#shakeButton").focus();
		setInterval(function(){
			// console.log("SECOND PASSED");
			// second++;
			// console.log(second);
			updateTime();
		}, 1000);
	});




function inputDone(){
	$(".inputPage .next").removeClass('inactive');
	// $(".dropPreview").removeClass('hidden');
}


function saveName(){
	name = document.querySelector('input[type=text]').value;
	if (document.querySelector('input[type=file]').files[0]){
		inputDone();
	}
	$("#name").html(name);
	$(".name").html(name);
}
function previewFile() {
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();
  if (file) {

  	 ImageTools.resize(file, {
        width: 80, // maximum width
        height: 80 // maximum height
    }, function(blob, didItResize) {
        // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
         resizedImage  = window.URL.createObjectURL(blob);
        $('.preview').attr("src",resizedImage);
        // makeBallImage(resizedImage);
        // you can also now upload this blob using an XHR.
        imageBall = loadImage($(".preview").attr("src"));
        

    });
    // var originalImage = reader.readAsDataURL(file);
    // makeBallImage(originalImage);

    if (name != "" ){
    	console.log(name);
    	inputDone();
    }
  }
}
function makeBallImage(originalDataURL) {
	// var canvas = 
	//Take input image
	//Size down to 80 px by 80px
	//Then create a new image file with alpha where the gaps are, and 
	//pixel colors from where the ball pixels are

}


var countdownImgs = []

function preload() {
	imgMachineTop = loadImage('img/topMachine.svg');
	imgMachineBottom = loadImage('img/bottomMachine.svg');
	machineOverlay = loadImage('img/overlay.svg');
	imgMask=loadImage('img/transparency.png');
	clawImg = loadImage('img/claw.svg');
	img_3 = loadImage('img/3.svg');
	img_2 = loadImage('img/2.svg');
	img_1 = loadImage('img/1.svg');
	img_go = loadImage('img/GO.svg');
	countdownImgs = [img_3,img_2,img_1,img_go];
	win = loadImage('img/win.svg');
	lose = loadImage('img/lose.svg');
}

var p5Canvas;
var background_color;
var paddingTop;
var canvas_width;
var canvas_height;

function setup() {
	windowWidth = window.innerWidth;
	if (windowWidth < 500){
		canvasScale = .5;
	} else if (windowWidth < 900){
		canvasScale = .6
	} else {
		canvasScale = .7;
	}
	paddingTop = 60*canvasScale;
	canvas_height =  600*canvasScale+paddingTop;
	canvas_width =  600*canvasScale;
 	p5Canvas = createCanvas(canvas_width,canvas_height);
  	p5Canvas.parent("canvasholder");
	background_color = color(80,0,106)
	background(background_color);
}



var drawMachineBottom = function(){
	image(imgMachineBottom, 0, paddingTop, width,height-paddingTop);

}
var drawMachineTop = function(){
	image(imgMachineTop, 0, paddingTop, width,height-paddingTop);

}
var drawMachineOverlay = function(){
	image(machineOverlay, 0, paddingTop, width,height-paddingTop);

}
var progressBarWidth = 16;
var count = 0;

var numberOfSteps = 0;

var winState = false;
var loseState = false;
var clawIsMoving = true;
var droppedBall = false;
var ballDropTime;

var inputImage;

// var makeBallImage = function(url){
	
// }
var drawProgress = function(countNum){
	var progress_yPosition = 10;
	fill(255);
	noStroke();
	rect(width/2-200, progress_yPosition, 400, 20, 20);
	let green = color(137, 255, 185); 
	fill(green);
	noStroke();

	// console.log(progressBarWidth+(10*countNum));
	if (progressBarWidth+(10*countNum) > 390){
		// console.log("YOU WIN");
		if (!loseState){
			winState=  true;
		}
		
		droppedBall = true;
		rect(width/2-200+3, progress_yPosition+2, 396, 16, 20);

		if (ballDropTime == null){
			ballDropTime = numberOfSteps;
		}
	} else {
		rect(width/2-200+3, progress_yPosition+2,  progressBarWidth+(10*countNum), 16, 20);
	}
}

var claw = {
	width: 120,
	height: 200,
	xPosition: 460,
	yPosition: 100,
	drawClaw: function(){
		image(clawImg, (this.xPosition-this.width/2)*canvasScale,(this.yPosition+paddingTop)*canvasScale, this.width*canvasScale,this.height*canvasScale);

	}
}
var dropAnimationDone = false;
var ball = {
	width:80,
	height:80,
	xPosition: 0, //store xPosition and yPosition as unscaled values
	yPosition: 0,

	groundPosition:480,
	drawBall: function(claw){
		if (droppedBall){
			// console.log("draw dropped ball");
			//Compute difference between current time and ball drop time
			var t = numberOfSteps - ballDropTime;
			var accelerated_yPosition = this.yPosition+(6)*t**2;
			// console.log(accelerated_yPosition);
			if (winState){
				console.log('drop ball: win state');
				if (accelerated_yPosition  < this.groundPosition){
					//Don't allow the ball to drop lower than the ground while in free fall
					this.yPosition = accelerated_yPosition;
				    yPositionScaled = this.yPosition*canvasScale;
				}else {
					//Let the ball sit on the ground
					this.yPosition= this.groundPosition;
					yPositionScaled = this.yPosition*canvasScale;
					dropAnimationDone = true;
				}
			}
			if (loseState){
				console.log('drop ball: lose state');
				if (accelerated_yPosition  < 600+paddingTop-5){
					// console.log("dropping");
					//Don't allow the ball to drop lower than the ground while in free fall
					this.yPosition = accelerated_yPosition;
				    yPositionScaled = this.yPosition*canvasScale;
				}else {
					//Let the ball sit on the ground
					this.yPosition= 600+paddingTop-5;
					yPositionScaled = this.yPosition*canvasScale;
					dropAnimationDone = true;
				}
			}

			// if (winState){ 

			// } else{
			// 	//Not win state, dropped the ball
			// 	xPositionScaled= claw.xPosition*canvasScale;
			// 	// this.xPosition = xPosition;
			// }

		} else {
			//Let the ball continue horizontal motion
			this.xPosition = claw.xPosition;
			xPositionScaled=this.xPosition*canvasScale;
			this.yPosition = claw.yPosition+claw.height+this.height*.5;
			yPositionScaled= claw.yPosition*canvasScale+claw.height*canvasScale+this.height*canvasScale*.5;
			
		};
		fill(0,0,0);
		ellipse(xPositionScaled, yPositionScaled, this.width*canvasScale,this.height*canvasScale);
		if (resizedImage){
			imageBall.mask(imgMask);
			image(imageBall, xPositionScaled-this.width*canvasScale/2, yPositionScaled-this.width/2*canvasScale,this.width*canvasScale,this.height*canvasScale);
		}
		
	}
}

var introSequenceComplete = false;

function drawCountdownImg(imgCountdown){
	// console.log(imgCountdown);
	var width = 342*.75;
	var height = 224*.75;
	image(imgCountdown,canvas_width/2-width/2,canvas_height/2-height/2,width,height);
}




function draw() {
	if (gameEntered){

		background(background_color);
		drawMachineBottom();
		claw.drawClaw();
		ball.drawBall(claw);
		if (gameStarted == true){
			introSequenceComplete = true;
			numberOfSteps++;
			if (claw.xPosition < 135){
				console.log("Lost and dropped the ball");
				if (!winState){
					loseState= true;
				}
				clawIsMoving = false;
				droppedBall = true;
				
				if (ballDropTime == null){
					ballDropTime = numberOfSteps;
				}
			}else {
				claw.xPosition = claw.xPosition-.5;
			}
		}

		drawMachineTop();
		drawMachineOverlay();
		if (!introSequenceComplete){
			console.log("INTRO SEQUENCE NOT COMPLETE");
			// console.log(countdownImgs);
			if (second < countdownImgs.length){
				 drawCountdownImg(countdownImgs[second])
			}
			if (second == 3){
				gameStarted = true;
				introSequenceComplete = false;
			}
		}
		if (dropAnimationDone){
			if (winState){
				// noLoop();
				$(".progressText").css('visibility','hidden');
				$(".gameText").html("Congrats, you dropped "+name+"! Now go move on to something bigger and better.")
				var widthToHeight = 750/460;
				$("#win").fadeIn(2000);
				// image(win,0,canvas_height/2-canvas_width/widthToHeight/2,canvas_width,canvas_width/widthToHeight);

				$("#shakeButton").hide();

				$("#share").delay(2000).fadeIn(1000);
				
			} else if (loseState) {
				// noLoop();
				$(".progressText").css('visibility','hidden');
				$(".gameText").html("You held onto "+name+" for too long. Drop 'em faster nest time.")
				var widthToHeight = 750/460;
				// image(lose,0,canvas_height/2-canvas_width/widthToHeight/2,canvas_width,canvas_width/widthToHeight);
				$("#lose").fadeIn(2000);
				$("#shakeButton").hide();
				$("#restart").fadeIn(60);
				
			} 
		} else {
				//Game still in progress
				drawProgress(count);
			}
		
		

	}



}

$("#restart").click(function(){
		// loop();
		loseState = false;
		winState = false;
		gameEntered = true;
		gameStarted = false;
		introSequenceComplete = false;
		second = 0;
		console.log(second);
		droppedBall = false;
		count = 0;
		numberOfSteps = 0;
		$("#restart").hide();
		$("#share").hide();
		$("#shakeButton").show();
		$("#lose").hide();
		$(".gameText").html("Drop "+name+" before the time runs out!");
		ballDropTime = null;
		clawIsMoving = true;
		ball.xPosition = 0;
		ball.yPosition = 0;
		claw.xPosition = 460;
		claw.yPosition= 100;
		dropAnimationDone = false;
});

// function restartGame() {
// 		loop();
// 		loseState = false;
// 		winState = false;
// 		gameEntered = true;
// 		gameStarted = false;
// 		introSequenceComplete = false;
// 		second = 0;
// 		droppedBall = false;
// 		count = 0;
// 		numberOfSteps = 0;
// 		$("#restart").hide();
// 		$("#share").hide();
// 		$("#shakeButton").show();
// 		$("#lose").hide();
// 		$(".gameText").html("Drop "+name+" before the time runs out!");
// 		ballDropTime = null;
// 		clawIsMoving = true;
// 		ball.xPosition = 0;
// 		ball.yPosition = 0;
// 		claw.xPosition = 460;
// 		claw.yPosition= 100;
// 	};

window.addEventListener('shake', function (e) {
    e.preventDefault();
});

window.addEventListener('devicemotion', function (e) {
    // This is where you put your code for dealing with the shake event here

    // Stop the default behavior from triggering the undo dialog (hopefully)
    e.preventDefault();
});
window.addEventListener('shake', shakeMotion, false);

//function to call when shake occurs
function shakeMotion() {

	count=count+3;
	p5Canvas.class('shake shake-constant');
	setTimeout(function(){p5Canvas.class(' '); },100);
}


function shakeMachine(){
	if (gameStarted){
		count++;
		p5Canvas.class('shake shake-constant');
		setTimeout(function(){p5Canvas.class(' '); },100);
	}
}