	
	function getRandomUnitVector(){
		let x = getRandom(-1,1);
		let y = getRandom(-1,1);
		let length = Math.sqrt(x*x + y*y);
		if(length == 0){ // very unlikely
			x=1; // point right
			y=0;
			length = 1;
		} else{
			x /= length;
			y /= length;
		}
	
		return {x:x, y:y};
	}

	function getRandom(min, max) {
		return Math.random() * (max - min) + min;
	}

	// Given 2 center points and 2 radius of squares are they collide
	function isCollide(o1C, o1R, o2C, o2R)
	{
		let xOverlap = Math.abs(o1C.x - o2C.x) < (o1R + o2R)
		let yOverlap = Math.abs(o1C.y - o2C.y) < (o1R + o2R)
		return xOverlap && yOverlap;
	}