let canvas = document.getElementById('myc');
let mouseX;
let mouseY;
let c = canvas.getContext('2d', {alpha:false});
let subQuery = "";

let queryResults = [];
let queryNodeArr = [];

let oY = 0;
let maxScroll;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function sigFig(num, sf){
	return(+(Math.round(String(num)+"e+"+sf)+"e-"+sf));
}

function contrain(num, max, min){
	if(num>max){
		num=max;
	}
	if(num<min){
		num=min;
	}
	return(num);
}

window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;	
});

window.addEventListener('mousemove', function(event){
	mouseX = event.x;
	mouseY = event.y;
});

window.addEventListener('click', function(event){
});

function submitText(event){
	if(event.key=='Enter'){
		queryNodeArr = [];
		oY = 0;
		//console.log(event.srcElement.value);
		subQuery = event.srcElement.value;
		queryResults = querySubject(subQuery);
		for(i=0;i<queryResults.length;i++){
			queryNodeArr.push(new subjectNode(
				0,
				0,
				queryResults[i]));
		}

		console.log("Queried: "+subQuery);
		console.log(queryNodeArr);

	}
}

window.addEventListener('mousewheel', function(event){
	oY = contrain(oY-sigFig(event.deltaY*0.4, 2), 0, -maxScroll);
});

function main(){
	requestAnimationFrame(main);
	c.fillStyle = 'rgb(0,180,240)';
	c.fillRect(0,0,canvas.width, canvas.height);
	let xGap = 10;
	let yGap = 20;
	let totalFit = Math.floor(canvas.width/(duckSub.w+xGap))*(duckSub.w+xGap);
	for(i=0;i<queryNodeArr.length;i++){
		queryNodeArr[i].x = (canvas.width - totalFit + xGap)*0.5 + (i%(totalFit/(duckSub.w+xGap)))*(duckSub.w+xGap);
	 	queryNodeArr[i].y = 0.5*yGap + (duckSub.h + yGap)*Math.floor(i*(duckSub.w+xGap)/totalFit);
	 	queryNodeArr[i].draw();
	 	if(i+1==queryNodeArr.length){
	 		maxScroll = queryNodeArr[i].y - canvas.width/4;
	 	}
	}
	
}

function subjectNode(x, y, subject){
 	this.x = x;
 	this.y = y;
 	this.w = 200;
 	this.h = 75;
 	this.r = 20;
 	this.subject = subject;

 	this.draw=function(){
 		c.beginPath();
 		c.rect(this.x, this.y+oY, this.w, this.h);
 		c.fillStyle = 'rgb(240,180,100)';
 		c.fill();

 		c.font = 'bolder 12px Verdana';
 		c.fillStyle = 'rgb(0,0,0)';
 		c.fillText(this.subject.code, this.x+10, this.y+20 +oY);
 		//this.shiver();
 	}
 	this.shiver=function(){
 		this.x += Math.random()*2 -1;
 		this.y += Math.random()*2 -1;
 	}
}

duckSub = new subjectNode(0,0,subjectArr[0]);

function querySubject(query, disp=1){
 	result = [];

 	for (var i = 0; i<subjectArr.length; i++){
 		subject = subjectArr[i];
 		// if(i%100==0){
 		// 	console.log(subject.code+" "+subject.name);
 		// 	console.log(query);
 		// }

 		if((subject.code+" "+subject.name).toLowerCase().includes(query.toLowerCase())){
 			// console.log(subject.code+" : "+subject.name);
 			result.push(subject);
 		}
 	}
 	return(result);
}

main();