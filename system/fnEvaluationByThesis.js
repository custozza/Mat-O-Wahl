import {
    arQuestionsLong,
    arQuestionsShort,
    arPersonalPositions,
    arParties,
    DEBUGGING,
} from './globals.js'

import {
    fnTransformPositionToButton,
    fnTransformPositionToIcon,
    fnTransformPositionToText,
} from './fnTransform.js';
import { questionWeight } from './globals.js';
import { buildChevron, createFoldableText } from './util.js';

export function fnEvaluationByThesis() {

    for (let i = 0; i < arQuestionsLong.length; i++) {
        const temp = createQuestionGroupCard(i);
        $("#resultsByThesis").append(temp);
        const content = document.createElement('div');
        content.setAttribute('class', 'collapsible-question');
        content.innerHTML = createPartyAnswers(i);
        $("#resultsByThesis").append(content);

    }
    createCollabsible();
    createFoldableText('.opinion');
}

function createCollabsible() {
    const headers = document.getElementsByClassName("question-group-header");

    for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        header.addEventListener("click", () => {
            console.log(header);
            const sibling = header.nextElementSibling;
            $(sibling).toggleClass('section-expanded'); // rename to question
            if (DEBUGGING) console.log(sibling);
        });
    }
}

function createQuestionGroupCard(i) {

    const weightedAnswer = questionWeight[i] || 0;
    const answerWeight = Math.abs(weightedAnswer);
    const personalPosition = arPersonalPositions[i];
    var positionButton = fnTransformPositionToButton(personalPosition);
    var positionIcon = fnTransformPositionToIcon(personalPosition);
    var positionText = fnTransformPositionToText(personalPosition);

    const iconButton = `
    <button type='button' id='' class='btn ${positionButton} btn-sm selfPosition${i}' 
	alt=' ${TEXT_ANSWER_USER} : ${positionText}' title='${TEXT_ANSWER_USER}  : ${positionText}'>
     ${positionIcon} 
     </button>`;

    const weightButton = `
     <button type='button' id='' class='btn btn-primary btn-sm selfPosition${i}' 
     alt=' ${TEXT_ANSWER_USER} : ${answerWeight}' title='${TEXT_ANSWER_USER}  : ${answerWeight}'>
      ${answerWeight} 
      </button>`;

    return `
	<div id="btn-question-group-${i}" class="question-group-header rounded">
		${iconButton} 
		${weightButton} 
		<div class="btn-question-title">${arQuestionsShort[i]}</div>
	</div>`
}

function createPartyAnswers(questionId) {
    var result = '';

    for (let i = 0; i < arParties.length; i++) {
        let party = arParties[i];
        let weightedPosition = party.answers[questionId].position;
        let position = Math.sign(weightedPosition);
        var positionButton = fnTransformPositionToButton(position);
        var positionIcon = fnTransformPositionToIcon(position);
        var positionText = fnTransformPositionToText(position);

        let weight = Math.abs(weightedPosition)

        var button = `<button type='button' id='' class='btn ${positionButton} btn-sm alt='${positionText}' title='${positionText}'> ${positionIcon} </button>`;

        var chevronUp = buildChevron(weight);

        result += `
		<div class="party-answer"> 
			<div class="party-answer-group ">
				${button} 
				${chevronUp}
			</div>
			<span class="opinion clamped"><strong>${party.partyShort}</strong>: ${party.answers[questionId].opinions}</span>
		 </div>`
    }
    return `<div class="parties-group questionGroup collapsible-container">${result}</div>`
}



