import {
    arQuestionsShort,
    arQuestionsLong,
    arPartyNamesShort,
    arPartyNamesLong,
    arPartyDescription,
    arPartyInternet,
    arPartyLogosImg,
    arPartyPositions,
    arPartyOpinions,
} from './globals.js'

// v.0.3 NEU
// CSV-Daten in Array einlesen (aus fnShowQuestions() und fnReadPositions())
export function fnTransformCsvToArray(csvData, modus, intParties) {
    switch (modus) {
        case 1: readQuestionsCSV(csvData); break;
        case 0: readPartiesCSV(csvData, intParties); break;
        default: debugger; throw Error('unkown modous');
    }
}


function readQuestionsCSV(csvData) {
    let lines = $.csv.toArrays(csvData, { separator: "" + separator + "" });
    lines.forEach((question) => {
        let [questionShort, questionLong] = question;
        arQuestionsShort.push(questionShort);
        arQuestionsLong.push(questionLong);
        // TODO replace questionLong and Question short with a question Object that has long and short
    });
}

function splitIntoGroups(csvData) {
    let lines = $.csv.toArrays(csvData.trim(), { separator: "" + separator + "" });
    // love chatGpt: i have an array of lines. some of the lines contain a #. these lines mark the beginning of a new group. how do i splite those lines into groups
    const groups =  lines.reduce((acc, line) => {
        if (line[0] === '#') {
            // If the line starts with '#' character, add a new group to the accumulator
            acc.push(new Array());
        } else {
            // Otherwise, add the line to the last group in the accumulator
            acc[acc.length - 1].push(line);
        }
        return acc;
    }, [new Array()]);

	const allSameLength = groups.every( list => list.length === groups[0].length);
	if(!allSameLength) {
		throw Error("Positions per party do not have the same length");
	}

    return groups;

}

function readPartiesCSV(csvData) {
    var parties = splitIntoGroups(csvData);

    parties.forEach((party) => {
        let [partyShort, partyLong, partyDescription, partyURL, partyImage, ...partyAnswers] = party;
        arPartyNamesShort.push(partyShort[1])
        arPartyNamesLong.push(partyLong[1])
        arPartyDescription.push(partyDescription[1])
        arPartyInternet.push(partyURL[1])
        arPartyLogosImg.push(partyImage[1])
        partyAnswers.forEach((answer) => {  
            arPartyPositions.push(answer[0]); // -1,0,1 // TODO it is hardcoded where answers of a party start and where they end
            arPartyOpinions.push(answer[1]); // Erklärung zur Zahl
        })
    });
}