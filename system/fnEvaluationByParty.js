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


            const questionContainer = createQuestionRow(questionNumber, partyContainer, party);
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

function createQuestionRow(questionNumber, partyContainer, party) {
    const questionContainer = document.createElement('div');
    questionContainer.classList.add('party-question-container', `question-${questionNumber}`, 'rounded');

    const questionText = arQuestionsShort[questionNumber];

    const question = document.createElement('div');
    question.classList.add('party-answer-cell', `question-${questionNumber}`, 'rounded');
    question.innerHTML = `${questionText}`;
    questionContainer.append(question);


    // PERSONAL POSITION
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

    const personalAnswer = document.createElement('div');
    personalAnswer.classList.add('party-answer-cell', `question-${questionNumber}`, 'rounded');
    personalAnswer.innerHTML =  `
	<div id="btn-question-group-${questionNumber}" class="question-group-header rounded">
		${iconButton} 
		${weightButton}
	</div>`;
    questionContainer.append(personalAnswer);

    // END PERSONAL POSITION

    const answer = party.answers[questionNumber];

    const partyAnswer = document.createElement('div');
    partyAnswer.classList.add('party-answer-cell', `question-${questionNumber}`, 'rounded');
    const position = answer.positions;
    partyAnswer.innerHTML = `${position}`;
    questionContainer.append(partyAnswer);

    const partyOpinion = document.createElement('div');
    partyOpinion.classList.add('party-answer-cell', `question-${questionNumber}`, 'rounded');
    const opinion = answer.opinions;
    partyOpinion.innerHTML = `${opinion}`;
    questionContainer.append(partyOpinion);

    return questionContainer;
}
