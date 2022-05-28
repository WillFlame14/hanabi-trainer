const colours = ['', 'red', 'green', 'yellow', 'blue', 'purple'];
const clues = ['1', '2', '3', '4', '5', 'red', 'green', 'yellow', 'blue', 'purple'];

export function focus(difficulty = 0) {
	let question = 'Determine which card is the focus.';
	let cards, clue, answer, explanationFunc;

	let total_clued = 0;

	if (difficulty == 0) {
		question = 'No cards were clued previously. ' + question;
		let clue_type;

		// Determine if number or colour clue
		if (Math.random() < 0.5) {
			clue = colours[Math.floor(Math.random() * 5) + 1];
			clue_type = 'colour';
		}
		else {
			clue = Math.floor(Math.random() * 5) + 1;
			clue_type = 'number';
		}

		// Randomly generate the cards (making sure at least one card is clued)
		while(total_clued === 0) {
			cards = [];
			for (let i = 0; i < 5; i++) {
				let match = Math.random() < 0.6;

				if (clue_type === 'colour') {
					cards.push({
						clued: match,
						colour: match ? clue : 'gray',
						number: ''
					});
				}
				else if (clue_type === 'number') {
					cards.push({
						clued: match,
						colour: match ? '': 'gray',
						number: match ? clue : ''
					});
				}

				if (match) {
					total_clued++;
				}
			}
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
				return "If only one card is newly clued, the focus is on that card.";
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
