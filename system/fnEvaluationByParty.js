import { fnTransformPositionToButton, fnTransformPositionToIcon, fnTransformPositionToText } from "./fnTransform.js";
import { DEBUGGING, arParties, arPersonalPositions, arQuestionsShort, arSortParties, questionWeight} from "./globals.js";

export function fnEvaluationByParty() {


    if (arSortParties.length != arParties.length) {
        throw Error("no sort information on parties")
    }

    if (DEBUGGING) console.log("sorted", arSortParties);

    for (let i = 0; i < arParties.length; i++) {
        const partyId = arSortParties[i];
        const party = arParties[partyId];


        const partyContainerHeader = document.createElement('div');
        partyContainerHeader.classList.add('party-answers-header','group-header', 'rounded');
        partyContainerHeader.setAttribute('id', `party-header${partyId}`);

        partyContainerHeader.innerHTML = `<div class="btn-title">${party.partyLong}</div>`

        $("#resultsByParty").append(partyContainerHeader);

        const partyContainer = document.createElement('div');
        partyContainer.classList.add('rounded','party-answers-container');
    
        for(let questionNumber = 0; questionNumber < arQuestionsShort.length; questionNumber++){
            const questionContainer = createQuestionRow(questionNumber, party);
            partyContainer.append(questionContainer);
        }

        $("#resultsByParty").append(partyContainer);

    }

    createCollabsible();

    return;

    function createCollabsible() {
        const headers = document.getElementsByClassName("group-header");
    
        for(let i = 0; i < headers.length; i++) {
            const header = headers[i];
            header.addEventListener("click", () => {
                const sibling = header.nextElementSibling;
                $(sibling).toggleClass('expanded'); // rename to question
                if(DEBUGGING) console.log(sibling);
            });
        }
    }
} 

function createQuestionRow(questionNumber, party) {
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('party-question-container', `question-${questionNumber}`, 'rounded');

    const questionText = arQuestionsShort[questionNumber];

    const question = document.createElement('div');
    question.classList.add('party-answer-cell', `question-${questionNumber}`, 'rounded');
    question.innerHTML = `${questionText}`;
    questionContainer.append(question);


    const personalAnswer = generatePersonalPositionIconCell(party, questionNumber);
    questionContainer.append(personalAnswer);

    const answer = party.answers[questionNumber];

    const partyOpinion = document.createElement('div');
    partyOpinion.classList.add('party-answer-cell', `question-${questionNumber}`, 'rounded');
    const opinion = answer.opinions;
    partyOpinion.innerHTML = `${opinion}`;
    questionContainer.append(partyOpinion);

    return questionContainer;
}
function generatePersonalPositionIconCell(party, questionNumber) {
    const personalPosition = arPersonalPositions[questionNumber];
    const positionButton = fnTransformPositionToButton(personalPosition);
    const positionIcon = fnTransformPositionToIcon(personalPosition);
    const positionText = fnTransformPositionToText(personalPosition);

    const iconButton = `
    <button type='button' id='' class='btn ${positionButton} btn-sm selfPosition${questionNumber}' 
	alt=' ${TEXT_ANSWER_USER} : ${positionText}' title='${TEXT_ANSWER_USER}  : ${positionText}'>
     ${positionIcon} 
     </button>`;


    const weightedAnswer = questionWeight[questionNumber] || 0;
    const answerWeight = Math.abs(weightedAnswer);

    const weightButton = `
     <button type='button' id='' class='btn btn-primary btn-sm selfPosition${questionNumber}' 
     alt=' ${TEXT_ANSWER_USER} : ${answerWeight}' title='${TEXT_ANSWER_USER}  : ${answerWeight}'>
      ${answerWeight} 
      </button>`;

    const [partyPosition, partyWeight] = partyPositionElementsAsText(party.answers[questionNumber].position);


    const personalAnswer = document.createElement('div');
    personalAnswer.classList.add('party-answer-cell', `question-${questionNumber}`, 'rounded');
    personalAnswer.innerHTML = `
	<div id="btn-question-group-${questionNumber}" class="question-group-small">
		${iconButton} 
        ${partyPosition}
		${weightButton}
        ${partyWeight}
	</div>`;
    return personalAnswer;
}

function partyPositionElementsAsText(weightedPosition) {
    let position = Math.sign(weightedPosition);
    var positionButton = fnTransformPositionToButton(position);
    var positionIcon = fnTransformPositionToIcon(position);
    var positionText = fnTransformPositionToText(position);

    let weight = Math.abs(weightedPosition);

    var button = `<button type='button' id='' class='btn ${positionButton} btn-sm alt='${positionText}' title='${positionText}'> ${positionIcon} </button>`;

    var chevronUp = buildChevron(weight);

    return [button, chevronUp];
}

function buildChevron(weight) {
    switch(weight) {
        case 3: return `<button class="triangle-container btn-primary btn-sm btn" style="transform: rotate(270deg)"> ⟫ </button>`;
        case 2:return `<button class="triangle-container btn-info btn-sm btn" style="transform: rotate(270deg)"> ⟩ </button>`;
        case 1: return `<button class="triangle-container btn-secondary btn-sm btn" style="transform: rotate(270deg)"> | </button>`;
        case 0: return `<button class="triangle-container btn-warning btn-sm btn" style=""> ∅ </button>`;
        default: throw Error('unknown weight');
    };
}

