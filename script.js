var currentPage = 0;

var resizedImage;
var imageBall;
var imgMask;
var name = "";
var gameStarted=false;
var clawImg;

var canvasScale = .7;
var windowWidth;

$(document).ready(function(){


	$('.next').click(function(){
		 var sections = $(".section");
		
		if (currentPage < sections.length){
			 $(sections[currentPage]).hide();
		    currentPage++;
		    nextSection = sections[currentPage];
		    $(nextSection).show();
		}

	});

	$(".startgame").click(function(){
		gameStarted = true;
	});



	var myShakeEvent = new Shake({
    threshold: 15, // optional shake strength threshold
    timeout: 1000 // optional, determines the frequency of event generation
	});
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




function preload() {
  imgMachineTop = loadImage('img/topMachine.svg');
  imgMachineBottom = loadImage('img/bottomMachine.svg');
  imgMask=loadImage('img/transparency.png');
  clawImg = loadImage('img/claw.svg');
}

var p5Canvas;
var background_color;
var paddingTop;

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
	console.log("SETUP CANVAS SCALE "+ canvasScale);
 	p5Canvas = createCanvas(600*canvasScale, 600*canvasScale+paddingTop);
  	p5Canvas.parent("canvasholder");
	background_color = color(17,0,32)
	background(background_color);
}



var drawMachineBottom = function(){
	image(imgMachineBottom, 0, paddingTop, width,height-paddingTop);

}
var drawMachineTop = function(){
	image(imgMachineTop, 0, paddingTop, width,height-paddingTop);

}
var progressBarWidth = 16;
var count = 0;

var numberOfSteps = 0;

var winState = false;
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
		winState=  true;
		droppedBall = true;
		rect(width/2-200+3, progress_yPosition+2, 396, 16, 20);
		// console.log("drew green bar");
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
		// console.log(canvasScale);
		// console.log(this.width*canvasScale,this.height*canvasScale);
		// console.log(canvasScale);
		// // image(clawImg, this.xPosition*canvasScale-this.width*canvasScale/2, this.yPosition*canvasScale,this.width*canvasScale,this.height*canvasScale);
		// // image(clawImg, this.xPosition-this.width/2, this.yPosition, this.width,this.height);
		// console.log(this.yPosition);
		image(clawImg, (this.xPosition-this.width/2)*canvasScale,(this.yPosition+paddingTop)*canvasScale, this.width*canvasScale,this.height*canvasScale);
		// fill(0,255,0);
		// rect(0,0,100,100);
		// rect(this.xPosition,this.yPosition,this.width,this.height);
	}
}

var ball = {
	width:80,
	height:80,
	xPosition: 0,
	yPosition: 0,

	groundPosition:480,
	drawBall: function(claw){
		if (droppedBall){
			var t = numberOfSteps - ballDropTime;
			// this.yPosition = this.yPosition+12*t**2;
			if (this.yPosition+12*t**2 < this.groundPosition*canvasScale){
				//Don't allow the ball to drop lower than the ground while in free fall
				this.yPosition = this.yPosition+12*t**2;
			    yPosition = this.yPosition;
			}else {
				//Let the ball sit on the ground
				this.yPosition= this.groundPosition;
				yPosition = this.yPosition*canvasScale;
			}
			if (winState){ 

			} else{
				//Not win state, dropped the ball
				xPosition= claw.xPosition*canvasScale;
				this.xPosition = xPosition;
			}


		} else {
			this.xPosition = claw.xPosition;
			xPosition=this.xPosition*canvasScale;
			
			yPosition= claw.yPosition*canvasScale+claw.height*canvasScale+this.height*canvasScale*.5;
			this.yPosition = yPosition;
		};
		fill(0,0,0);
		ellipse(xPosition, yPosition, this.width*canvasScale,this.height*canvasScale);
		console.log(xPosition, yPosition, this.width*canvasScale,this.height*canvasScale);
		console.log("drew ball");
		if (resizedImage){
			imageBall.mask(imgMask);
			image(imageBall, xPosition-this.width*canvasScale/2, yPosition-this.width/2*canvasScale,this.width*canvasScale,this.height*canvasScale);
		}
		
	}
}


function draw() {
	if (gameStarted){

		background(background_color);
		numberOfSteps++;
		drawMachineBottom();
		claw.drawClaw();
		drawProgress(count);
		ball.drawBall(claw);
		if (claw.xPosition < 135){
			clawIsMoving = false;
			droppedBall = true;
			ballDropTime = numberOfSteps;

		}else {
			claw.xPosition = claw.xPosition-.5;
		}
		drawMachineTop();
		


	}



}
window.addEventListener('devicemotion', function (e) {
    // This is where you put your code for dealing with the shake event here

    // Stop the default behavior from triggering the undo dialog (hopefully)
    e.preventDefault();
});
window.addEventListener('shake', shakeMotion, false);

//function to call when shake occurs
function shakeMotion () {
	count=count+3;
	p5Canvas.class('shake shake-constant');
	setTimeout(function(){p5Canvas.class(' '); },100);
}


function shakeMachine(){
	count++;
	p5Canvas.class('shake shake-constant');
	setTimeout(function(){p5Canvas.class(' '); },100);
	
}