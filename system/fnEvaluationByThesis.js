import {
	arQuestionsLong,
	arQuestionsShort,
	arPersonalPositions,
	arParties,
} from './globals.js'

import {
	fnTransformPositionToButton,
	fnTransformPositionToIcon,
	fnTransformPositionToText,
} from './fnTransform.js';
import { questionWeight } from './globals.js';

export function fnEvaluationByThesis() {
    buildAnswers();
}

function buildAnswers() {

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
    var coll = document.getElementsByClassName("question-group-header");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var target = this.nextElementSibling;
            const isOpen = $(target).hasClass('section-expanded');
            $('.collapsible-question').removeClass('section-expanded');
            setTimeout(() => {
                $('#resultsByThesis').css('maxHeight', "100%");
                console.log('sometime latter');
            }, 0);
            if (isOpen) {
                return
            }
            $(target).toggleClass('section-expanded');
        });
    }
}
export function createFoldableText(querySelector) {
    $(querySelector).click((e) => {
        console.log(e.target);
        $(e.target).toggleClass('clamped');
    });
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
	<div id="btn-question-group-${i}" class="question-group-header rounded mow-row-striped">
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

function buildChevron(weight) {
    var chevron = `<div class="triangle-container">`
    chevron += weight > 0 ? `<span class="triangle" style="margin-top: 0;">&#8963;</span>` : "";
    chevron += weight > 1 ? `<span class="triangle" sylte="margin-top: -39px; margin-bottom: -17px;">&#8963;</span>` : "";
    chevron += weight > 2 ? `<span class="triangle">&#8963;</span>` : "";
    chevron += `</div>`;
    return chevron;
}

