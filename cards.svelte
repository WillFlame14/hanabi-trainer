<script>
import { afterUpdate, onMount } from 'svelte';
export let cards, clue;

const LEFT_OFFSET = 5, TOP_OFFSET = 25;
const CANVAS_WIDTH = LEFT_OFFSET + 655, CANVAS_HEIGHT = TOP_OFFSET + 245, CARD_WIDTH = 109, CARD_HEIGHT = 155, ARROW_WIDTH = 80, ARROW_HEIGHT = 120;
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
});

function fillRoundRect (ctx, x, y, w, h, r, shadow = false, stroke = false) {
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	if (shadow) {
		ctx.shadowColor = '#222222';
		ctx.shadowBlur = 5;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
	}
	ctx.beginPath();
	ctx.moveTo(x+r, y);
	ctx.arcTo(x+w, y,   x+w, y+h, r);
	ctx.arcTo(x+w, y+h, x,   y+h, r);
	ctx.arcTo(x,   y+h, x,   y,   r);
	ctx.arcTo(x,   y,   x+w, y,   r);
	ctx.closePath();
	if (stroke) {
		ctx.stroke();
	}
	else {
		ctx.fill();
	}

	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
}

function fillCircle (ctx, x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.fill();
}

function draw(ctx, image, x, y, width, height, shadow) {
	if (shadow) {
		ctx.shadowColor = '#222222';
		ctx.shadowBlur = 5;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
	}
	ctx.drawImage(image, x, y, width, height);
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
}

function preDraw(ctx, name, x, y, width, height, shadow = false) {
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
			// card_ctx.fillStyle = 'black';
			// fillRoundRect(card_ctx, LEFT_OFFSET + 130*i - 2, TOP_OFFSET + 65 - 2  - (current_clued ? 20 : 0), CARD_WIDTH + 14, CARD_HEIGHT + 14, 10);
			card_ctx.fillStyle = 'orange';
			fillRoundRect(card_ctx, LEFT_OFFSET + 130*i, TOP_OFFSET + 65 - (current_clued ? 20 : 0), CARD_WIDTH + 10, CARD_HEIGHT + 10, 10, false);
			card_ctx.fillStyle = 'black';
			card_ctx.lineWidth = 2;
			fillRoundRect(card_ctx, LEFT_OFFSET + 130*i + 5, TOP_OFFSET + 70 - (current_clued ? 20 : 0), CARD_WIDTH, CARD_HEIGHT, 10, false, true);
		}

		if (card.colour === 'gray') {
			card_ctx.fillStyle = 'gray';
			fillRoundRect(card_ctx, LEFT_OFFSET + 130*i + 5, TOP_OFFSET + 70, CARD_WIDTH, CARD_HEIGHT, 10, true);
		}
		else {
			preDraw(
				card_ctx,
				`cards/${card.colour + card.number}`,
				LEFT_OFFSET + 130*i + 5, TOP_OFFSET + 70 - (current_clued ? 20 : 0),
				CARD_WIDTH, CARD_HEIGHT,
				!(card.clued || current_clued)
			);
		}

		if (current_clued) {
			preDraw(arrow_ctx, `pieces/arrow`, LEFT_OFFSET + 130*i + 5 + CARD_WIDTH / 2 - ARROW_WIDTH / 2, TOP_OFFSET + 0 - (current_clued ? 20 : 0), 80, 120);
			drawClue(clue_ctx, clue, LEFT_OFFSET + 130*i + 5 + CARD_WIDTH / 2, TOP_OFFSET + 43 - (current_clued ? 20 : 0));
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
