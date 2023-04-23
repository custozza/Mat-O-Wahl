import { DEBUGGING, arParties, arSortParties, questionWeight } from "./globals.js";
import { createFoldableText } from "./fnEvaluationByThesis.js";

// Anzeige der Ergebnisse - zusammengefasst (Prozentwerte) - nur Parteien
// Array arResults kommt von fnEvaluation
export function fnEvaluationShort() {

	if (arSortParties.length != arParties.length) {
		throw Error("no sort information on parties")
	}

	const filtredOwnWeights = [...questionWeight.filter(x => x != null)];
	const maxPoints = filtredOwnWeights.reduce((a, b) => a + b, 0) * 3;

	for (let i = 0; i < arParties.length; i++) {
		const partyId = arSortParties[i];
		const party = arParties[partyId];
		// # Container
		const partyContainer = createResultCardForParty(party, partyId);
		$("#resultsShort").append(partyContainer);

	}
	createFoldableText('.party-description')

	$("#sectionShowQuestions").empty().hide();
}


function createResultCardForParty(party, partyId) {
	const partyContainer = document.createElement('div');
	partyContainer.classList.add('party-container');
	
	const graphicInfoContainer = createGraphicInfoContainer();
	partyContainer.append(graphicInfoContainer);

	const partyDescription = createPartyDescription();
	partyContainer.append(partyDescription);

	return partyContainer;

	function createPartyDescription() {
		const partyDescription = document.createElement('span');
		partyDescription.classList.add('party-description', 'clamped', 'rounded');

		const name = party.partyLong;
		const nicName = party.partyShort;
		const url = party.partyURL;
		const description = party.partyDescription;
		partyDescription.innerHTML = `
		<strong>${name}</strong>
		(&#8663;<a href='${url}' target='_blank' alt='Link: ${name}' title='Link: ${name}'> ${nicName}</a>)
		${description}`;
		return partyDescription;
	}

	function createGraphicInfoContainer() {
		const graphicInfoContainer = document.createElement('div');

		graphicInfoContainer.classList.add('graphic-info-container');


		// # Image
		const partyImage = document.createElement('div');
		partyImage.classList.add('party-image');
		const logo = party.partyImage;
		const logoText = party.partyLong;
		partyImage.innerHTML = `<img src='${logo}' class='rounded img-fluid' alt='Logo ${logoText}' />`;
		graphicInfoContainer.append(partyImage);

		// # Percent
		const partyMatchInPercent = document.createElement('div');
		graphicInfoContainer.append(partyMatchInPercent);
		partyMatchInPercent.classList.add('party-percent');

		// # Percent Text

		// const percentText = document.createElement('div');
		// percentText.setAttribute('id', `partyPoints`);
		// percentText.html = ('%% PUNKTE / MAX ');
		// partyMatchInPercent.append(percent);
		// partyMatchInPercent.setAttribute('role', 'progressbar')
		//var percent = fnPercentage(arResults[partyNum], maxPoints)
		var percent = 100;

		if(DEBUGGING) console.log('progressbar', partyId);
		const progress = `
		<div class='progress'>
			<div class='progress-bar' role='progressbar' id='partyBar${partyId}' style='width:${percent}%;' aria-valuenow='${percent}' aria-valuemin='0' aria-valuemax='100'>
				JUST_A_PLACEHOLDER_TEXT - SEE FUNCTION fnReEvaluate()
			</div>
			<div id="partyPoints${partyId}" class="party-points-text">
				'%% PUNKTE / MAX '
			</div>
		</div>`;
		partyMatchInPercent.innerHTML = progress;
		return graphicInfoContainer;
	}
}