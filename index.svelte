<script>
import { onMount } from 'svelte';
import Cards from './cards.svelte';
import { focus } from './generate.js';

let cards = [
	{colour: '', number: 1, clued: true},
	{colour: '', number: 2},
	{colour: '', number: 3},
	{colour: '', number: 4},
	{colour: '', number: 5}
];
let clue = '3';

let question, answer;
let correct = null;
let explanation, explanationFunc;

onMount(() => {
	// Temporary hack
	setTimeout(refresh, 20);
});

function refresh() {
	correct = null;
	({question, cards, clue, answer, explanationFunc} = focus());
}

function submit(slot) {
	correct = (slot === answer);
	explanation = explanationFunc(slot);
}

</script>

<div id="f">
	<div id="question">{question}</div>
	<Cards cards={cards} clue={clue}></Cards>
	<div>
		{#each {length: 5} as _, i}
			<button on:click={() => submit(i)}>Slot {i + 1}</button>
		{/each}
	</div>
	{#if correct != null}
		<div>
			<div>{correct ? 'Correct!' : 'Incorrect.'}</div>
			{#if !correct}
				<div>{explanation}</div>
			{/if}
		</div>
		<button on:click="{refresh}">Next question</button>
	{/if}
</div>

<style>
	:global(html) {
		background-color: #444444;
		color: white;
		font-size: 14pt;
		font-family: "Roboto";
	}
	#f {
		margin: 0 auto;
		text-align: center;
	}
	#question {
		margin-bottom: 1vw;
	}
</style>
