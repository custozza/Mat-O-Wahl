import { DEBUGGING, arParties, arSortParties } from "./globals.js";
import { createFoldableText } from "./util.js";

// Anzeige der Ergebnisse - zusammengefasst (Prozentwerte) - nur Parteien
// Array arResults kommt von fnEvaluation
export function fnEvaluationShort() {

	if (arSortParties.length != arParties.length) {
		throw Error("no sort information on parties")
	}

	if (DEBUGGING) console.log("sorted", arSortParties);

	for (let i = 0; i < arParties.length; i++) {
		const partyId = arSortParties[i];
		const party = arParties[partyId];
		const partyContainer = createResultCardForParty(party, partyId);
		$("#resultsShort").append(partyContainer);

	}
	createFoldableText('.party-description')

	$("#sectionShowQuestions").empty().hide();
}

function createResultCardForParty(party, partyId) {
	const partyContainer = document.createElement('div');
	partyContainer.classList.add('party-container');

	const graphicInfoContainer = createGraphicInfoContainer(party, partyId);
	partyContainer.append(graphicInfoContainer);

	const partyDescription = createPartyDescription(party);
	partyContainer.append(partyDescription);

	return partyContainer;
}

function createPartyDescription(party) {
	const partyDescription = document.createElement('span');
	partyDescription.classList.add('party-description', 'clamped', 'rounded');

	const name = party.partyLong;
	const nicName = party.partyShort;
	const url = party.partyURL;
	const description = party.partyDescription;
	partyDescription.innerHTML = `
		<strong><a href='${url}' target='_blank' alt='Link: ${name}' title='Link: ${name}'>${name}</a></strong>
		${description}`;
	return partyDescription;
}

function createGraphicInfoContainer(party, partyId) {
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

	var percenPlaceholder = 100;

	const progress = `
		<div class='progress'>
			<div class='progress-bar' role='progressbar' id='partyBar${partyId}' style='width:${percenPlaceholder}%;' aria-valuenow='${percenPlaceholder}' aria-valuemin='0' aria-valuemax='100'>
				JUST_A_PLACEHOLDER_TEXT - SEE FUNCTION fnReEvaluate()
			</div>
			<div id="partyPoints${partyId}" class="party-points-text">
				'%% PUNKTE / MAX '
			</div>
		</div>`;
	partyMatchInPercent.innerHTML = progress;
	return graphicInfoContainer;
}
