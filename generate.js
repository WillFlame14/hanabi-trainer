const colours = ['', 'red', 'green', 'yellow', 'blue', 'purple'];
const clues = ['1', '2', '3', '4', '5', 'red', 'green', 'yellow', 'blue', 'purple'];

export function focus(difficulty = 0) {
	let question = 'Determine which card is the focus.';
	const cards = [];
	let clue;
	let answer = -1;
	let explanationFunc;

	let total_clued = 0;

	if (difficulty == 0) {
		question = 'No cards were clued previously. ' + question;

		if (Math.random() < 0.5) {
			// Colour clue
			const fixed_colour = colours[Math.floor(Math.random() * 5) + 1];

			for (let i = 0; i < 5; i++) {
				const match = Math.random() < 0.6;
				cards.push({
					clued: match,
					colour: match ? fixed_colour : 'gray',
					number: ''
				});
				if (match) {
					total_clued++;
				}
			}
			clue = fixed_colour;
		}
		else {
			// Number clue
			const fixed_number = Math.floor(Math.random() * 5) + 1;

			for (let i = 0; i < 5; i++) {
				const match = Math.random() < 0.6;
				cards.push({
					clued: match,
					colour: match ? '': 'gray',
					number: match ? fixed_number : ''
				});
				if (match) {
					total_clued++;
				}
			}
			clue = fixed_number;
		}

		// Determine answer
		if (cards[4].clued) {
			// Since no cards were clued previously, slot 4 is chop.
			answer = 4;
		}
		else {
			// Find leftmost clued card.
			for (let i = 0; i < 5; i++) {
				if (cards[i].clued) {
					answer = i;
					break;
				}
			}
		}

		// Explanation
		explanationFunc = function(slot) {
			if (total_clued === 1) {
				return "If only one card is newly clued, focus is on that card.";
			}
			if (answer === 4) {
				return "If a multi-card clue touches the chop, the focus is on the chop.";
			}
			else {
				return "If a multi-card clue doesn't touch the chop, the focus is on the leftmost card.";
			}
		}
	}
	return {question, cards, clue, answer, explanationFunc};
}
