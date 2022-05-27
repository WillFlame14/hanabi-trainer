<script>
import { afterUpdate, onMount } from 'svelte';
export let cards, clue;

const CANVAS_WIDTH = 619, CANVAS_HEIGHT = 230, CARD_WIDTH = 109, CARD_HEIGHT = 155, ARROW_WIDTH = 80, ARROW_HEIGHT = 120;
let card_layer, arrow_layer, clue_layer;
let loading = 0;
let card_ctx, arrow_ctx, clue_ctx;
let drawArea, area;
let images = {};

onMount(() => {
	drawArea = area.getContext('2d');
	card_layer = document.createElement('canvas');
	card_ctx = card_layer.getContext('2d');
	arrow_layer = document.createElement('canvas');
	arrow_ctx = arrow_layer.getContext('2d');
	clue_layer = document.createElement('canvas');
	clue_ctx = clue_layer.getContext('2d');

	for (const layer of [drawArea, card_ctx, arrow_ctx, clue_ctx]) {
		layer.canvas.width = CANVAS_WIDTH;
		layer.canvas.height = CANVAS_HEIGHT;
	}

	// Figure out how to add shadow on hoverover
	// area.onmousemove = function(event) {
	// 	const x = event.pageX, y = event.pageY;
	// 	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// 	for (let i = 0; i < circle.length; i++) {
	// 		if ((x > circle[i].x - circle[i].r) && (y > circle[i].y - circle[i].r) && (x < circle[i].x + circle[i].r) && (y < circle[i].y + circle[i].r)) {
	// 			ctx.beginPath();
	// 			ctx.arc(circle[i].x, circle[i].y, circle[i].r, 0, 2 * Math.PI);
	// 			ctx.fillStyle = "blue";
	// 			ctx.fill();
	// 			ctx.shadowBlur = 10;
	// 			ctx.lineWidth = 3;
	// 			ctx.strokeStyle = 'rgb(255,255,255)';
	// 			ctx.shadowColor = 'grey';
	// 			ctx.stroke();
	// 			ctx.shadowColor = 'white';
	// 			ctx.shadowBlur = 0;
	// 		}
	// 		else {
	// 			ctx.beginPath();
	// 			ctx.arc(circle[i].x, circle[i].y, circle[i].r, 0, 2 * Math.PI);
	// 			ctx.fillStyle = "blue";
	// 			ctx.fill();
	// 			ctx.shadowColor = 'white';
	// 			ctx.shadowBlur = 0;
	// 		}
	// 	}
	// }
});

function fillRoundRect (ctx, x, y, w, h, r) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	ctx.beginPath();
	ctx.moveTo(x+r, y);
	ctx.arcTo(x+w, y,   x+w, y+h, r);
	ctx.arcTo(x+w, y+h, x,   y+h, r);
	ctx.arcTo(x,   y+h, x,   y,   r);
	ctx.arcTo(x,   y,   x+w, y,   r);
	ctx.closePath();
	ctx.fill();
	ctx.shadowBlur = 0;
}

function fillCircle (ctx, x, y, r) {
	ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function draw(ctx, image, x, y, width, height, shadow) {
	if (shadow) {
		ctx.shadowColor = 'green';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
	}
	ctx.drawImage(image, x, y, width, height);
	ctx.shadowBlur = 0;
}

function preDraw(ctx, name, x, y, width, height, shadow) {
	if (images[name] === undefined) {
		loading++;
		const img = new Image;
		img.src = `images/${name}.svg`;
		img.onload = function() {
			images[name] = this;
			draw(ctx, this, x, y, width, height, shadow);
			loading--;
		}
	}
	else {
		// console.log(images[name]);
		draw(ctx, images[name], x, y, width, height, shadow);
	}
}

function drawClue(ctx, clue, x, y) {
	const radius = 25;
	if (isNaN(clue)) {

	}
	ctx.fillStyle = isNaN(clue) ? 'black' : 'white';
	fillCircle(ctx, x, y, radius);
	ctx.fillStyle = isNaN(clue) ? clue : 'black';
	fillCircle(ctx, x, y, radius - 3);

	if (!isNaN(clue)) {
		ctx.fillStyle = 'white';
		ctx.font = '36px Roboto';
		ctx.fillText(clue, x - 10, y + 13);
	}
}

function retry(func, callback, retry_time) {
	if (func()) {
		callback();
	}
	else {
		setTimeout(() => retry(func, callback, retry_time), retry_time);
	}
}

afterUpdate(async () => {
	for (const layer of [drawArea, card_ctx, arrow_ctx, clue_ctx]) {
		layer.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	for (const [i, card] of cards.entries()) {
		const current_clued = card.colour === clue || (!isNaN(clue) && card.number === Number(clue));

		if (card.clued || current_clued) {
			card_ctx.fillStyle = 'orange';
			fillRoundRect(card_ctx, 125*i, 65, CARD_WIDTH + 10, CARD_HEIGHT + 10, 10);
		}

		preDraw(card_ctx, `cards/${card.colour + card.number}`, 125*i + 5, 70, CARD_WIDTH, CARD_HEIGHT, false);

		if (current_clued) {
			preDraw(arrow_ctx, `pieces/arrow`, 125*i + 5 + CARD_WIDTH / 2 - ARROW_WIDTH / 2, 0, 80, 120);
			drawClue(clue_ctx, clue, 125*i + 5 + CARD_WIDTH / 2, 43);
		}
	}

	retry(() => loading == 0, () => {
		drawArea.drawImage(card_layer, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawArea.drawImage(arrow_layer, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawArea.drawImage(clue_layer, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}, 10);
});
</script>

<canvas id=area bind:this="{area}"></canvas>
