var w = window.innerWidth,
	h = window.innerHeight,
	amount = ((w * h) / 10000) | 0;
c.width = w;
c.height = h;
var ctx = c.getContext('2d');

var inGame = false,
	cells = [];

function getRandomColor(min) {
	return 'rgb(cr, cg, cb)'.replace(
		'cr', (Math.random() * (255 - min)) | 0 + min).replace(
		'cg', (Math.random() * (255 - min)) | 0 + min).replace(
		'cb', (Math.random() * (255 - min)) | 0 + min)
};
clicked = false;
finished = false;
score = 0;
frames = 0;
scoreFrame = null;

function init() {
	clicked = false;
	finished = false;
	score = 0;
	frames = 0;
	scoreFrame = null;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, w, h);
	cells = [];
	for (var n = 0; n < amount; ++n) {
		cells.push(new Cell);
	}
	inGame = true;
	anim();
}
var maxSize = 10,
	minSize = 6,
	maxV = 4;

function Cell(size, x, y) {
	this.color = getRandomColor(100);
	this.size = size || Math.random() * (maxSize - minSize) + minSize;
	this.initSize = this.size;
	this.x = x || Math.random() * w;
	this.y = y || Math.random() * h;
	this.vx = Math.random() * maxV * 2 - maxV;
	this.vy = Math.random() * maxV * 2 - maxV;
	this.exploded = false;
	this.explosionSize = 10;
}
Cell.prototype.update = function() {
	this.x += this.vx;
	this.y += this.vy;

	if (this.x < 0 || this.x > w) this.vx *= -1;
	if (this.y < 0 || this.y > h) this.vy *= -1;


	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(this.x, this.y, Math.abs(this.size / 2), 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();
	//ctx.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size);

	if (this.exploded) {
		if (this.size > 0) {
			this.explosionSize += 1 / this.explosionSize * 10;
			this.size -= 0.05;
		} else {
			cells.splice(cells.indexOf(this), 1);
		}
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.explosionSize, 0, Math.PI * 2);

		for (var i = 0; i < cells.length; ++i) {
			var cell = cells[i];
			if (!cell.exploded) {
				var a = this,
					b = cell;
				var distX = a.x - b.x,
					distY = a.y - b.y,
					dist = Math.sqrt((distX * distX) + (distY * distY));
				if (dist <= this.explosionSize) cells[i].explode();
			}
		}

		ctx.strokeStyle = this.color;
		ctx.stroke();
		ctx.closePath();
	}
}
Cell.prototype.explode = function() {
	this.exploded = true;
	this.vx = this.vy = 0;
	score++;
	scoreFrame = frames;
}
nextInit = false;

function map(x, s, e) {
	return x * (e - s) + s;
}

function anim() {
	if (nextInit) {
		nextInit = false;
		init();
		return;
	}
	if (inGame) window.requestAnimationFrame(anim);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
	ctx.fillRect(0, 0, w, h);
	var c;
	for (c = 0; c < cells.length; ++c) cells[c].update();

	if (finished) {
		ctx.fillStyle = "rgba(255,255,255,.3)";
		ctx.font = ".45em 'Baloo Bhai'";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("YOUR SCORE", w / 2, h / 2 - 60);

		ctx.font = "2.2em 'Baloo Bhai'";
		ctx.fillText(totalPoints.toString(), w / 2, h / 2 + 20);
	} else if (scoreFrame !== null && frames - scoreFrame <= 200 && score > 1) {
		var progress = (frames - scoreFrame) / 200;
		var fontSizeStart = map(score / (amount + 1), 1.3, 2.3);
		var fontSize = map(progress, fontSizeStart, fontSizeStart * 3);
		var alpha = map((frames - scoreFrame) / 10, .6, .2);
		ctx.fillStyle = "rgba(255,255,255," + alpha.toString() + ")";
		ctx.font = fontSize.toString() + "em 'Baloo Bhai'";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(score.toString(), w / 2, h / 2 + 20);
	}

	if (clicked && !finished) {
		frames++;
		for (c = 0; c < cells.length; c++)
			if (cells[c].exploded) return;

		finished = true;
		gameFinished();
	}
}
init();
document.addEventListener('click', function(e) {
	if (!inGame) init();
	else if (clicked) {
		if (finished) nextInit = true;
	} else {
		var cell = new Cell(15, e.clientX, e.clientY)
		cells.push(cell);
		cell.explode();
		clicked = true;
	}
});

function gameFinished() {
	completion = score / (amount + 1);
	timePerExplosion = frames / score;
	pointsByCompletion = Math.pow(completion, 2.1) * 4 * (Math.pow(amount, 1) + 300) / 300;
	pointsByTime = Math.pow(timePerExplosion, -0.5);
	totalPoints = Math.round(150 * pointsByCompletion + 400 * pointsByTime);

	if (totalPoints > 300) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.open("GET", "submitExplode/" + totalPoints + location.search, true);
		httpRequest.send(null);
	}
}
