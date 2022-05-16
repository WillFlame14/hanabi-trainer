<script>
import { onMount } from 'svelte';
import Cards from './cards.svelte';

let cards = [
	{colour: '', number: 1, clued: true},
	{colour: '', number: 2},
	{colour: '', number: 3},
	{colour: '', number: 4},
	{colour: '', number: 5}
];
let clue = '3';

let question = 'Determine which card is the focus.';

const colours = ['', 'red', 'green', 'yellow', 'blue', 'purple'];
const clues = ['1', '2', '3', '4', '5', 'red', 'green', 'yellow', 'blue', 'purple'];

function refresh() {
	const new_cards = [];
	for (let i = 0; i < 5; i++) {
		new_cards.push({
			clued: Math.random() < 0.4,
			colour: colours[Math.floor(Math.random() * 6)],
			number: Math.floor(Math.random() * 5) + 1
		});
	}
	clue = clues[Math.floor(Math.random() * clues.length)];
	cards = new_cards;
}

</script>

<div id="f">
	<div id="question">{question}</div>
	<Cards cards={cards} clue={clue}></Cards>
	<div>
		<button on:click="{refresh}">Refresh</button>
	</div>
</div>

<style>
	:global(html) {
		background-color: #222222;
	}
	#f {
		margin: 0 auto;
		text-align: center;
	}
	#question {
		color: white;
		margin-bottom: 1vw;
		font-size: 14pt;
		font-family: "Roboto";
	}
</style>