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
        case 1: modusOne(csvData, intParties); break;
        case 0: modusZero(csvData, intParties); break;
        default: debugger; throw Error('unkown modous');
    }
}


function modusOne(csvData) {
    let lines = $.csv.toArrays(csvData, { separator: "" + separator + "" });
    lines.forEach((question) => {
        let [questionShort, questionLong] = question;
        arQuestionsShort.push(questionShort);
        arQuestionsLong.push(questionLong);
    });
}

function modusZero(csvData, intParties) {
    var modus = 0;
    let arZeilen = $.csv.toArrays(csvData, { separator: "" + separator + "" });

    var numberOfLines = 6 + intQuestions
    var lastLine;


    lastLine = (5 + intQuestions + 1) * intParties - 1 // Partien und Antworten / Parties and answers


    //	for(i = 0; i <= arZeilen.length-1; i++)
    for (let i = 0; i <= lastLine - 1; i++) {
        // console.log("i: "+i+" m: "+modus+" val0: "+arZeilen[i][0]+" val1: "+arZeilen[i][1] )	
        var valueOne = arZeilen[i][0];
        var valueTwo = arZeilen[i][1];

        // ANTWORTEN und Meinungen in globales Array schreiben (z.B. aus PARTEIEN.CSV)

        // v.0.5 NEU
        // ALLE Partei-Informationen in einer CSV-Datei
        var modulo = i % numberOfLines;

        if ((modulo == 0) && (valueTwo != "undefined")) {
            // Parteinamen - kurz
            arPartyNamesShort.push(valueTwo)
        }
        else if ((modulo == 1) && (valueTwo != "undefined")) {
            // Parteinamen - lang
            arPartyNamesLong.push(valueTwo)
        }
        else if ((modulo == 2) && (valueTwo != "undefined")) {
            // Beschreibung der Partei (optional)
            arPartyDescription.push(valueTwo)
            //				console.log("i: "+i+ " value: "+valueTwo)
        }
        else if ((modulo == 3) && (valueTwo != "undefined")) {
            // Webseite der Partei
            arPartyInternet.push(valueTwo)
        }
        else if ((modulo == 4) && (valueTwo != "undefined")) {
            // Logo der Partei
            arPartyLogosImg.push(valueTwo)
        }
        else if ((modulo > 4) && (modulo <= (intQuestions + 4))) {
            // Positionen und Erklärungen
            arPartyPositions.push(valueOne); // -1,0,1
            arPartyOpinions.push(valueTwo); // Erklärung zur Zahl
        }
        else {
            // nothing to do. Just empty lines in the CSV-file
        }

    }  // end: for
}