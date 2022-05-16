<script>
import { afterUpdate, onMount } from 'svelte';
export let cards, clue;

const CANVAS_WIDTH = 619, CANVAS_HEIGHT = 230, CARD_WIDTH = 109, CARD_HEIGHT = 155, ARROW_WIDTH = 80, ARROW_HEIGHT = 120;
let area, ctx;
let images = {};

onMount(() => {
	ctx = area.getContext("2d");
	ctx.canvas.width = CANVAS_WIDTH;
	ctx.canvas.height = CANVAS_HEIGHT;

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

function fillRoundRect (x, y, w, h, r) {
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
}

function fillCircle (x, y, r) {
	ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function preDraw(name, x, y, width, height) {
	if (images[name] === undefined) {
		const img = new Image;
		img.src = `images/${name}.svg`;
		img.onload = function() {
			images[name] = this;
			ctx.drawImage(this, x, y, width, height);
		}
	}
	else {
		ctx.drawImage(images[name], x, y, width, height);
	}
}

function drawClue(clue, x, y) {
	const radius = 25;
	if (isNaN(clue)) {

	}
	ctx.fillStyle = isNaN(clue) ? 'black' : 'white';
	fillCircle(x, y, radius);
	ctx.fillStyle = isNaN(clue) ? clue : 'black';
	fillCircle(x, y, radius - 3);

	if (!isNaN(clue)) {
		ctx.fillStyle = 'white';
		ctx.font = '36px Roboto';
		ctx.fillText(clue, x - 10, y + 13);
	}
}

afterUpdate(() => {
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	for (const [i, card] of cards.entries()) {
		const current_clued = card.colour === clue || (!isNaN(clue) && card.number === Number(clue));

		if (card.clued || current_clued) {
			ctx.fillStyle = 'orange';
			fillRoundRect(125*i, 65, CARD_WIDTH + 10, CARD_HEIGHT + 10, 10);
		}

		preDraw(`cards/${card.colour + card.number}`, 125*i + 5, 70, CARD_WIDTH, CARD_HEIGHT);

		if (current_clued) {
			setTimeout(() => preDraw(`pieces/arrow`, 125*i + 5 + CARD_WIDTH / 2 - ARROW_WIDTH / 2, 0, 80, 120), 25);
			setTimeout(() => drawClue(clue, 125*i + 5 + CARD_WIDTH / 2, 43), 50);
		}
	}
})
</script>

<canvas id=area bind:this="{area}"></canvas>