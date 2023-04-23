// OUTPUT.JS http://www.mat-o-wahl.de
// Output of information / Ausgabe der Informationen
// License: GPL 3
// Mathias Steudtner http://www.medienvilla.com

import { fnReadCsv } from './readCsv.js';
import { fnShowQuestions } from './fnShowQuestions.js';
import { fnReadPositions } from './fnReadPositions.js';
import { fnSendResults } from './fnSendResults.js';
import {
	fnEvaluation,
	fnPercentage,
	fnToggleDouble,
	fnBarImage,
} from './general.js';

import {
	fnTransformPositionToButton,
	fnTransformPositionToIcon,
	fnTransformPositionToText,
	fnTransformPositionToColor,
} from './fnTransform.js';

import {
	arQuestionsLong,
	arVotingDouble,
	getActiveQuestion,
	setActiveQuestion,
	questionWeight,
	arQuestionsShort,
	arPersonalPositions,
	arSortParties,
	arPartyNamesLong,
	arPartyInternet,
	arPartyNamesShort,
	arPartyDescription,
	arPartyLogosImg,
	arPartyPositions,
	arPartyOpinions,
	arResults,
} from './globals.js';
import { fnEvaluationByThesis } from './fnEvaluationByThesis.js';
import { fnEvaluationShort } from './fnEvaluationShort.js';



export function fnStart() {
	// alte Inhalte loeschen bzw. ausblenden

	// 1. Bereich -  Überschriften, Erklärung zur Wahl
	// sectionDescription
	$("#descriptionHeading1").empty().append("<h1>" + descriptionHeading1 + "</h1>")
	$("#descriptionHeading2").empty().append("<h2>" + descriptionHeading2 + "</h2>");
	$("#descriptionExplanation").empty().append(descriptionExplanation);
	$("#descriptionButtonStart").html(TEXT_START)
	$("#descriptionAddonTop").empty();
	$("#descriptionAddonBottom").empty();

	// 2. Bereich - Anzeige der Fragen - am Anfang ausblenden
	$("#sectionShowQuestions").hide()
	$("#showQuestionsHeader").empty();
	$("#showQuestionsQuestion").empty();

	// 3. Voting Buttons
	$("#sectionVotingButtons").hide();
	$("#votingPro").html(TEXT_VOTING_PRO)
	$("#votingNeutral").html(TEXT_VOTING_NEUTRAL)
	$("#votingContra").html(TEXT_VOTING_CONTRA)
	$("#votingSkip").html(TEXT_VOTING_SKIP)
	// $("#votingImportant1").html(TEXT_VOTING_IMPORTANT_1)
	// $("#votingImportant2").html(TEXT_VOTING_IMPORTANT_2)
	// $("#votingImportant3").html(TEXT_VOTING_IMPORTANT_3)

	// 4. Navigation
	$("#sectionNavigation").hide();

	// Bereich - Ergebnisse
	$("#sectionResults").hide()
	$("#resultsHeading").empty();
	$("#resultsShort").empty();
	$("#resultsByThesis").empty();
	$("#resultsByParty").empty();
	$("#resultsAddonTop").empty();
	$("#resultsAddonBottom").empty();

	$("#resultsButtons").hide()
	$("#resultsButtonTheses").html(TEXT_RESULTS_BUTTON_THESES)
	$("#resultsButtonParties").html(TEXT_RESULTS_BUTTON_PARTIES)

	// Bereich - Footer
	//	$("#keepStatsQuestion").empty();
	// $("#statisticsModalLabel").html(TEXT_ALLOW_STATISTIC_TITLE)
	$("#statisticsModalBody").html(TEXT_ALLOW_STATISTIC_TEXT)
	$("#statisticsModalButtonNo").html(TEXT_ALLOW_STATISTIC_NO)
	$("#statisticsModalButtonYes").html(TEXT_ALLOW_STATISTIC_YES)

	//////////////////////////////////////////////////////////////////
	// FOOTER



	// Wenn Datenschutzerklärung vorhanden UND Auswertung gewünscht ...
	$("#keepStats").hide()
	$("#keepStatsQuestion").append(TEXT_ALLOW_STATISTIC);	// WACG: <label> sollte immer befüllt sein
	if ((imprintPrivacyUrl.length > 0) && (statsRecord)) {
		$("#keepStatsCheckbox").attr("checked", true); // Zeile auskommentieren/aktivieren und OptIn erzwingen - bitte mit Bedacht benutzen.
		$("#keepStats").fadeIn(1000);
	}
	else {
		$("#keepStatsCheckbox").attr("checked", false);	// Falls jmd. bauernschlau in der INDEX.HTML checked="checked" eingetragen hat -> OptOut
	}


	// Impressum auf Startseite ersetzen
	// Text aus i18n einfügen
	$("#imprint").html(TEXT_IMPRINT);
	// Link aus definition.js einfügen
	$("#imprint").attr("href", imprintLink)

	// Neustart / Wiederholung
	var jetzt = new Date();
	var sekunden = jetzt.getTime();
	$("#restart").attr("href", "index.html?" + sekunden);
	$("#restart").html(TEXT_RESTART);

	// Fokus nach jedem Klick entfernen
	document.addEventListener("click", () => {
		document.activeElement.blur()
	})

	//////////////////////////////////////////////////////////////////
	// Anzahl der Parteien berechnen
	//	fnReadCsv("data/"+fileAnswers, fnSetIntParties)
	//	const intParties = window.intParties

	// FRAGEN UND ANTWORTEN in Arrays einlesen und Folgefunktionen aufrufen
	// (a) Fragen
	fnReadCsv("data/" + fileQuestions, fnShowQuestions)

	// (b) Antworten der Parteien und Partei-Informationen
	fnReadCsv("data/" + fileAnswers, fnReadPositions)

	$("#votingDouble").attr('checked', false);

	// Wenn "descriptionShowOnStart = 0" in DEFINITION.JS, dann gleich die Fragen anzeigen
	if (descriptionShowOnStart) {
		// nix
	} else {
		// Das System ist am Anfang noch nicht fertig geladen. Deshalb müssen wir einen Moment warten. :(
		$("#descriptionHeading1").empty().append("<h1>Loading / Lädt</h1>")
		$("#descriptionHeading2").empty().append("<h2>Please wait a moment / Bitte einen Moment warten</h2>");

		var descriptionExplanationContent = ""
		descriptionExplanationContent += '<div class="progress">'
		descriptionExplanationContent += '	<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width:50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>'
		descriptionExplanationContent += '</div>'
		descriptionExplanationContent += "This message disappears in less than 5 seconds. If not something went wrong. / <br /> Diese Nachricht verschwindet in weniger als 5 Sekunden. Andernfalls ist etwas schief gelaufen."

		$("#descriptionExplanation").empty().append(descriptionExplanationContent);

		window.setTimeout(fnHideWelcomeMessage, FADE_TIME);
	}

}

// Ausblenden der Willkommensmeldung (#sectionDescription)
// und direkt in die Fragen gehen
// neu ab v.0.6
// Aufruf aus fnStart() wenn "descriptionShowOnStart = 0" ODER beim Klick auf Start-Button
export function startQuestionaire() {

	// runEvaluation(); // temp for development
	// return
	$('#sectionDescription').hide().empty();
	$('#sectionFooter').css('display', 'none');
	fnShowQuestionNumber(-1);
}


function showWarningAWeightNeedsToBeSelected() {
	// TODO dont show alert but add some nice html stuff or hide something
	alert("Es muss ein gewicht ausgewählt werden");
	// TODO acctually this shouldnt be possible anymore as the buttons are disabled
}

// (a) Anzeige von Frage Nummer XY
// (b) Weiterleitung zur Auswertung
// Aufruf aus fnStart() -> fnShowQuestions(csvData)
export function fnShowQuestionNumber(questionNumber) {
	// Nummer der Frage im Array um eins erhöhen
	questionNumber++;

	$("#votingPro").unbind("click");
	$("#votingNeutral").unbind("click");
	$("#votingContra").unbind("click");
	$("#votingSkip").unbind("click");

	// solange Fragen gestellt werden -> Anzeigen (sonst Auswertung)
	if (questionNumber < arQuestionsLong.length) {
		setActiveQuestion(questionNumber);
		// activeQuestion = questionNumber; // globale Variable

		// Aufbau der Liste zum Vor/Zurückgehen bei den Fragen
		fnJumpToQuestionNumber(questionNumber);

		// bodyTextSize = $("#headingContent").css("font-size");
		// bodyTextSize = parseInt(bodyTextSize)

		// Fragen ausblenden und neue Frage einblenden - nur zur besseren Visualisierung
		$("#sectionShowQuestions").fadeOut(FADE_TIME).hide();
		$("#showQuestionsHeader").empty().append("<h2>" + arQuestionsShort[questionNumber] + "</h2>");
		$("#showQuestionsQuestion").empty().append(arQuestionsLong[questionNumber]);
		$("#sectionShowQuestions").fadeIn(FADE_TIME);


		// Buttons ausblenden, damit Nutzer nicht zufällig drauf klickt
		$("#sectionVotingButtons").fadeOut(FADE_TIME).hide();
		$("#sectionVotingButtons").fadeIn(FADE_TIME);

		// Navigation (Nummer der Frage) ein-/ausblenden
		$("#sectionNavigation").fadeOut(FADE_TIME).hide();
		// Bootstrap-Progressbar
		var percent = fnPercentage((questionNumber + 1), arQuestionsLong.length);
		$("#progress-bar").width(percent + "%")
		$("#progress-bar").attr("aria-valuenow", percent)

		// Klick-Funktion auf Bilder/Buttons legen.
		$("#votingPro").click(function () {
			// weight = 1
			if (questionWeight[questionNumber] == null) {
				return showWarningAWeightNeedsToBeSelected();
			}
			arPersonalPositions[questionNumber] = 1;
			fnShowQuestionNumber(questionNumber);
		});

		$("#votingContra").click(function () {

			if (questionWeight[questionNumber] == null) {
				return showWarningAWeightNeedsToBeSelected();
			}

			arPersonalPositions[questionNumber] = -1;
			fnShowQuestionNumber(questionNumber);
		});

		$("#votingSkip").click(function () {
			arPersonalPositions[questionNumber] = 0;
			questionWeight[questionNumber] = 0; // shouldnt make a difference as they are multiplied in the end
			fnShowQuestionNumber(questionNumber);
		});

		// Reset Weight buttons
		document.querySelector('#votingPro').disabled = true;
		document.querySelector('#votingContra').disabled = true;
		$('[id*="votingImportant"]').removeClass("btn-dark").addClass("btn-outline-dark");

		$("#sectionNavigation").fadeIn(FADE_TIME);

	} else {
		runEvaluation();
	}

	// Alle Fragen durchgelaufen -> Auswertung

}
function runEvaluation() {

	// but hiding fading here for the moment

	$('main').css('display', 'none');
	$('#sectionFooter').css('display', 'flex');
	$("#sectionResults").fadeIn(FADE_TIME);


	fnEvaluation();

	arSortParties.sort(function (a, b) { return arResults[b] - arResults[a]; });

	// Übergabe an Tabellen zur Darstellung/Ausgabe
	fnEvaluationShort(arResults);	// Kurzüberblick mit Progress-bar
	fnEvaluationByThesis(arResults);	// Thesen + Partei-Antworten
	fnEvaluationByParty(arResults) 	// Liste der Parteien mit ihren Antworten (ab v.0.6)


	// Buttons einblenden für detaillierte Ergebnisse
	//$("#resultsButtons").fadeIn(FADE_TIME);


	// Abfrage zur Statistik einblenden (v.0.6.)
	if ((imprintPrivacyUrl.length > 0) && (statsRecord)) {
		$('#statisticsModal').modal('show')

		// Klick-Funktion mit den Ergebnissen zum Senden auf "Ja" legen
		document.getElementById("statisticsModalButtonYes").addEventListener("click", function () {
			fnSendResults(questionWeight, arPersonalPositions)
			$('#statisticsModal').modal('toggle')
		});
	}
}

// 02/2015 BenKob
export function fnChangeVotingDouble(weight) {

	questionWeight[getActiveQuestion()] = weight; // defined in global.js

	$('[id*="votingImportant"]').removeClass("btn-dark").addClass("btn-outline-dark");
	$("#votingImportant" + weight).removeClass("btn-outline-dark").addClass("btn-dark");

	document.querySelector('#votingPro').disabled = false;
	document.querySelector('#votingContra').disabled = false;
}

// Springe zu Frage Nummer XY (wird in fnShowQuestionNumber() aufgerufen)
function fnJumpToQuestionNumber(questionNumber) {
	// alten Inhalt ausblenden und loeschen
	$("#navigationJumpToQuestion").fadeOut(FADE_TIME).empty().hide();

	// Durchlauf des Arrays bis zur ausgewählten Frage und Setzen der 99, falls NaN
	for (var i = 0; i < questionNumber; i++) {
		if (isNaN(arPersonalPositions[i])) {
			arPersonalPositions[i] = 0;
		}
	}

	var maxQuestionsPerLine = 12;  // z.B. 16

	// Wenn mehr als XY Fragen vorhanden, dann erstelle eine zweite/dritte/... Zeile
	if (arQuestionsShort.length >= maxQuestionsPerLine) {

		var tableRows = arQuestionsLong.length / maxQuestionsPerLine;		/* z.B. nicht mehr als 16 Fragen pro Zeile */
		tableRows = Math.ceil(tableRows);				/* 17 Fragen / 16 = 1,06 ### 31 Fragen / 16 = 1,9 -> 2 Zeilen */
		var questionsPerLine = arQuestionsLong.length / tableRows;		/* 23 Fragen / 2 Zeilen = 12 & 11 Fragen/Zeile */
		questionsPerLine = Math.ceil(questionsPerLine);

	}
	else {
		questionsPerLine = maxQuestionsPerLine;
	}

	// Tabelle aufbauen
	var tableContent = "<table width='100%' class='table-bordered table-striped table-hover' aria-role='presentation'>";
	for (var i = 1; i <= arQuestionsLong.length; i++) {
		var modulo = i % questionsPerLine;
		// neue Zeile
		if (modulo == 1) { tableContent += "<tr>"; }
		tableContent += "<td align='center' id='jumpToQuestionNr" + i + "' title='" + arQuestionsShort[(i - 1)] + " - " + arQuestionsLong[(i - 1)] + "'>";
		// tableContent += "<a id=question" +i+ " href='javascript:fnShowQuestionNumber(" + (i - 2) + ")' style='display:block;'>" + i + " </a>";
		tableContent += "<a id=question" + i + " style='display:block;'>" + i + " </a>";
		tableContent += "</td>";
		if (modulo == 0) { tableContent += "</tr>"; }
	}
	tableContent += "</table>";
	$("#navigationJumpToQuestion").append(tableContent).fadeIn(FADE_TIME);
	setTimeout(() => {
		//console.log(tableContent);
		for (let i = 1; i <= arQuestionsLong.length; i++) {
			document.getElementById('question' + i).addEventListener('click', (event) => {
				event.preventDefault();
				fnShowQuestionNumber(i - 2)
			});
		}

	}, 0);

	// alte Meinungen farblich hervorheben und aktuelle Frage markieren
	for (var i = 1; i <= arQuestionsLong.length; i++) {
		// beantwortete Fragen farblich markieren
		var positionColor = fnTransformPositionToColor(arPersonalPositions[(i - 1)]);
		$("#jumpToQuestionNr" + i + "").css("border-color", positionColor);

		// aktuelle Frage markieren
		if ((i - 1) <= questionNumber) {
			//	   	$("#jumpToQuestionNr"+i+"").css("background-color", middleColor);	// alt: graue "Mittelfarbe" als Hintergrund
			$("#jumpToQuestionNr" + i + "").css("background-color", positionColor);	// neu (0.2.3.2) Farbe der Auswahl (rot/gruen/...)
		}

		if (arVotingDouble[(i - 1)]) {
			$("#jumpToQuestionNr" + i + "").css("font-weight", "bold");
		}

	}

}



// Anzeige der Ergebnisse - detailliert, Fragen und Antworten der Parteien
// Array arResults kommt von fnEvaluation



// Anzeige der Ergebnisse - detailliert, Sortiert nach Parteien inkl. deren Antworten
// Array arResults kommt von fnEvaluation
function fnEvaluationByParty(arResults) {

	var tableContent = "";

	tableContent += " <p>" + TEXT_RESULTS_INFO_PARTIES + "</p>";


	tableContent += "<div class='row' id='resultsByPartyTable' role='table'>"
	tableContent += "<div class='col'>"


	tableContent += "<div class='row border ' role='row'>"; // row header
	tableContent += "<div class='col col-10 order-2 col-md-5 order-md-1' role='columnheader'>";
	tableContent += "<strong>";
	tableContent += TEXT_QUESTION
	tableContent += "</strong>";
	tableContent += "</div>";

	tableContent += "<div class='col col-2 order-1 col-md-1 order-md-2' role='columnheader'>";
	tableContent += "<strong>";
	tableContent += TEXT_ANSWER_USER
	tableContent += "</strong>";
	tableContent += "</div>";

	tableContent += "<div class='col col-2 order-3 col-md-1 order-md-3' role='columnheader'>";
	tableContent += "<strong>";
	tableContent += TEXT_POSITION_PARTY
	tableContent += "</strong>";
	tableContent += "</div>";


	tableContent += "<div class='col col-10 order-4 col-md-5 order-md-4' role='columnheader'>";
	tableContent += "<strong>";
	tableContent += TEXT_ANSWER_PARTY
	tableContent += "</strong>";
	tableContent += "</div>";
	tableContent += "</div>"; // row header

	for (var i = 0; i < arPartyDescription.length; i++) {

		var partyNum = arSortParties[i];	// partyNum = sortierte Position im Endergebnis, z.B. "Neutrale Partei = 4. Partei in CSV" aber erste im Ergebnis = Nullter Wert im Array[0] = 4


		tableContent += "<span id='resultsByPartyHeading" + i + "' >";	// Hilfs-SPAN für Textfilter
		tableContent += "<div class='row border'  role='row'>";
		tableContent += "<div class='col col-2' role='cell'>";

		tableContent += "<img src='" + arPartyLogosImg[partyNum] + "' class='img-fluid rounded float-left' alt='Logo " + arPartyNamesLong[partyNum] + "' style='margin: 10px;' />"

		tableContent += "</div>";
		tableContent += "<div class='col col-10' role='cell'>";
		tableContent += "<strong>"
		tableContent += arPartyNamesLong[partyNum];
		tableContent += "</strong>"

		tableContent += " (&#8663; <a href='" + arPartyInternet[partyNum] + "' target='_blank' title='" + arPartyNamesLong[partyNum] + "'>";
		tableContent += arPartyNamesShort[partyNum];
		tableContent += "</a>)";

		tableContent += "<p>" + arPartyDescription[partyNum] + "</p>"

		tableContent += "<button style='display:inline; float:right;' id='resultsByPartyAnswers" + i + "collapse' class='nonexpanded btn btn-sm btn-outline-secondary' type='button'>&#x2795;</button>";

		tableContent += "</div>"; // end: col-12 - Überschrift Partei
		tableContent += "</div>"; // end: row - Überschrift Partei
		tableContent += "</span>"; // end: SPAN - Überschrift Partei



		var jStart = partyNum * arQuestionsShort.length // z.B. Citronen Partei = 3. Partei im Array[2] = 2 * 5 Fragen = 10
		var jEnd = jStart + arQuestionsShort.length - 1	// 10 + 5 Fragen -1 = 14

		//		tableContent += "<tbody id='resultsByPartyAnswersToQuestion"+i+"'>";
		tableContent += "<span id='resultsByPartyAnswersToQuestion" + i + "'> ";	// Hilfs-SPAN für Textfilter
		tableContent += "<div class='row border rounded'> ";
		tableContent += "<div class='col'>"


		// Anzeige der Partei-Antworten
		for (let j = jStart; j <= jEnd; j++) {

			// 1./4 Zellen - Frage
			var modulo = j % arQuestionsShort.length // z.B. arPartyPositions[11] % 5 Fragen = 1 -> arQuestionsShort[1] = 2. Frage
			// tableContent += " <tr>"
			// tableContent += "  <td class='align-text-top'>"
			tableContent += " <div class='row mow-row-striped' role='row'> ";
			tableContent += " <div class='col col-10 order-2 col-md-5 order-md-1' role='cell'> ";
			tableContent += " " + (modulo + 1) + ". <strong>" + arQuestionsShort[modulo] + "</strong> - " + arQuestionsLong[modulo] + " "
			// tableContent += "  </td>"
			tableContent += "  </div>" // end col-5 Frage


			// 2./4 Zellen - Icon für eigene Meinung [+] [0] [-]
			var positionButton = fnTransformPositionToButton(arPersonalPositions[modulo]);
			var positionIcon = fnTransformPositionToIcon(arPersonalPositions[modulo]);
			var positionText = fnTransformPositionToText(arPersonalPositions[modulo]);

			// tableContent += "<td style='text-align:center; width:10%;'>";
			tableContent += " <div class='col col-2 order-1 col-md-1 order-md-2' role='cell'> ";

			// tableContent += "<button type='button' "+
			tableContent += "<button type='button' id='' " +
				" class='btn " + positionButton + " btn-sm selfPosition" + modulo + " '  " +
				" onclick='fnToggleSelfPosition(" + modulo + ")' " +
				" alt='" + TEXT_ANSWER_USER + " : " + positionText + "' title='" + TEXT_ANSWER_USER + " : " + positionText + "'>" +
				" " + positionIcon + "</button>";

			// tableContent += "</td>";
			tableContent += " </div> ";


			// 3./4 Zellen - Icons für Postion der Parteien [+] [0] [-]
			var positionIcon = fnTransformPositionToIcon(arPartyPositions[j]);
			var positionButton = fnTransformPositionToButton(arPartyPositions[j]);
			var positionText = fnTransformPositionToText(arPartyPositions[j]);

			// tableContent += "  <td style='text-align:center; width:10%;'>"
			tableContent += " <div class='col col-2 order-3 col-md-1 order-md-3' role='cell'> ";
			tableContent += "<button type='button' class='btn " + positionButton + " btn-sm' disabled " +
				" alt='" + TEXT_ANSWER_PARTY + " : " + positionText + "' title='" + TEXT_ANSWER_PARTY + " : " + positionText + "'>" +
				" " + positionIcon + "</button>";
			// tableContent += "  </td>"
			tableContent += " </div> ";


			// 4./4 Zellen - Antwort der Partei
			tableContent += " <div class='col col-10 order-4 col-md-5 order-md-4' role='cell' headers='resultsByPartyHeading" + i + "' tabindex='0'> ";
			// tableContent += "  <td class='align-text-top' headers='resultsByPartyHeading"+i+"' tabindex='0'>"
			tableContent += " " + arPartyOpinions[j]

			// die Beschreibung der Partei in einem VERSTECKTEN DIV -> ein Workaround für das Addon "Textfilter" (siehe /EXTRAS) :(
			tableContent += "<span style='visibility:hidden; display:none;' aria-hidden='true'>" + arPartyDescription[partyNum] + "</span>"

			// tableContent += "  </td>"
			tableContent += " </div> ";

			// tableContent += " </tr>"
			tableContent += " </div> "; // end: row Anzeige der Partei-Antworten

		} // end: for-j
		// tableContent += "</tbody>";
		tableContent += " </div> "; // end col
		tableContent += " </div> "; // end row resultsByPartyAnswersToQuestion
		tableContent += " </span> "; // end span resultsByPartyAnswersToQuestion

		//		tableContent += " </div> "; // end col
		//	tableContent += " </div> "; // end row resultsByPartyRow


	}

	// tableContent += "</table>";
	tableContent += " </div> "; // end col
	tableContent += " </div> "; // end row resultsByPartyTable


	// Daten in Browser schreiben
	$("#resultsByParty").append(tableContent);

	// und am Anfang Tabelle ausblenden
	// $("#resultsByParty").hide();

	for (let i = 0; i < arQuestionsShort.length; i++) {
		console.log('clicking on ' + i)
		$("#doubleIcon" + i).click(function () { fnToggleDouble(i) })
	}

	for (let i = 0; i < arPartyDescription.length; i++) {

		$("#resultsByPartyHeading" + i + " .nonexpanded").click(function () {
			var $this = $(this);
			$("#resultsByPartyAnswersToQuestion" + i + "").toggle(FADE_TIME)

			$this.toggleClass("expanded");

			if ($this.hasClass("expanded")) {
				$this.html("&#x2796;"); // MINUS
			} else {
				$this.html("&#x2795;"); // PLUS
			}
		});

		// am Anfang die Antworten ausblenden
		//		$("#resultsByPartyAnswersToQuestion"+i).fadeOut(FADE_TIME);	// irgendwie verrutschen die Zeilen bei fadeOut() -> deshalb die css()-Lösung
		// $("#resultsByPartyAnswersToQuestion" + i + "").css("display", "none")

	}

} // end function



// 02/2015 BenKob
// Aktualisierung der Ergebnisse in der oberen Ergebnistabelle (short)
// Aufruf heraus in:
// (a) fnEvaluationShort() nach dem Aufbau der oberen Tabelle
// (b) in den Buttons in der detaillierten Auswertung (fnToggleSelfPosition() und fnToggleDouble())
export function fnReEvaluate() {
	//Ergebniss neu auswerten und Anzeige aktualisieren
	fnEvaluation();

	const arr = [...questionWeight.filter(x => x != null)];
	const maxPoints = arr.reduce((a, b) => a + b, 0) * 3;

	//	for (i = 0; i <= (arPartyFiles.length-1); i++)
	for (let i = 0; i < arPartyDescription.length; i++) {
		var percent = fnPercentage(arResults[i], maxPoints)

		// bis v.0.3 mit PNG-Bildern, danach mit farblicher Bootstrap-Progressbar
		var barImage = fnBarImage(percent);

		// neu ab v.0.3 - Bootstrap-Progressbar
		$("#partyBar" + i).width(percent + "%")
		$("#partyBar" + i).text(percent + "% (" + arResults[i] + " / " + maxPoints + ")");
		$("#partyBar" + i).removeClass("bg-success bg-warning bg-danger").addClass(barImage);

		$("#partyPoints" + i).html(arResults[i] + "/" + maxPoints);

	}

}

