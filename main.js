async function run() {
	const mainResponse = await fetch('main.json');
	if (!mainResponse.ok) {
		throw new Error(`Error fetching main.json: ${mainResponse.staus}`);
		document.getElementById('output').innerHTML = `Error fetching main.json: ${mainResponse.status}`;
		return;
	}
	const main = await mainResponse.json();
	console.log(main);

	const playerResponse = await fetch(main.player);
	if (!playerResponse.ok) {
		throw new Error(`Error fetching main.player json file: ${playerResponse.status}`);
		document.getElementById('output').innerHTML = `Error fetching main.player json file: ${playerResponse.status}`;
		return;
	}
	const player = await playerResponse.json();
	player.dragons.sort(sortDragons);
	console.log(player);

	const breedsResponse = await fetch(main.breeds);
	if (!breedsResponse.ok) {
		throw new Error(`Error fetching main.breeds json file: ${breedsResponse.status}`);
		document.getElementById('output').innerHTML = `Error fetching main.breeds json file: ${breedsResponse.status}`;
		return;
	}
	const breeds = await breedsResponse.json();
	console.log(breeds);

	let output = `<table>`;

	//  ========== HEADER ==========
	output += `<tr><th>Egg</th><th>Dragons</th></tr>`;

	// ========== DRAGONS ==========
	let hidden = [];
	let dragonsDisplayed = 0;

	for (const breed of player.dragons) {
		// console.log(breed);
		if (breed.view.length >= 3 &&
			breed.view.length === breed.adults &&
			dragonsDisplayed >= 50) {
			hidden.push(breed.id);
			continue;
		}

		output += `<tr>`;

		// Show egg
		output += `<td>`;
		for (const egg in breeds[breed.id].name) {
			output += `<a href="${breeds[breed.id].encyclopedia}" target="_blank">`;
			output += `<img src="${breeds[breed.id].img[egg]}"`;
			output += `title="${breeds[breed.id].name[egg]}"`;
			output += `\n${breeds[breed.id].description}">`;
			output += `</a> `;
		}
		output += `</td>`;

		// View ttps://dragcave.net/image/r5HjG.gif
		output += `<td>`;
		for (const dragon of breed.view) {
			output += `<a href="https://dragcave.net/view/${dragon}" target="_blank">`;
			output += `<img src="https://dragcave.net/image/${dragon}.gif" alt="${dragon}">`;
			output += `</a> `;
			++dragonsDisplayed;
		}

		// End
		output += `</td></tr>`;
	}
	output += `</table>`;

	// console.log('==========')
	console.log('Dragons displayed', dragonsDisplayed);

	if (hidden.length > 0) output += `\n<h4 title="Breed group has >= 3 adults & displayed dragons is >= 50">Hidden</h4>`;
	// console.log(hidden);
	for (const id of hidden) {
		output += `<a href="${breeds[id].encyclopedia}" target="_blank">`
		// console.log(id, breeds[id]);
		for (const egg in breeds[id].name) {
			output += `<img src="${breeds[id].img[egg]}"`;
			output += `title="${breeds[id].name[egg]}`;
			output += `\n${breeds[id].description}">`;
		}
		output += `</a> `;
	}

	document.getElementById('output').innerHTML = output;
}

function sortDragons(a, b) {
	if (a.view.length !== b.view.length) return a.view.length - b.view.length;
	if (a.adults !== b.adults) return a.adults - b.adults;
	if (a.date !== b.date) return b.date - a.date;

	return a.id.localeCompare(b.id);
}
