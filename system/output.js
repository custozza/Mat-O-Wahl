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
	DEBUGGING,
} from './globals.js';
import { fnEvaluationByThesis } from './fnEvaluationByThesis.js';
import { fnEvaluationShort } from './fnEvaluationShort.js';
import { fnReEvaluate } from './fnReEvaluate.js';



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

	if (false) {
		runEvaluation(); // temp for development
		return
	}
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

	// put hiding fading here for the moment
	$('main').css('display', 'none');
	$('#sectionFooter').css('display', 'flex');
	$("#sectionResults").fadeIn(FADE_TIME);

	fnEvaluation();

	// Übergabe an Tabellen zur Darstellung/Ausgabe
	fnEvaluationShort();	// Kurzüberblick mit Progress-bar
	fnEvaluationByThesis();	// Thesen + Partei-Antworten
	fnEvaluationByParty(); 	// Liste der Parteien mit ihren Antworten (ab v.0.6)
	showModalShareStatisticalData();
	// for the progressbar
	fnReEvaluate();

}

function showModalShareStatisticalData() {
	const debugging = false;
	if (debugging || (imprintPrivacyUrl.length <= 0) || (statsRecord != 1)) {
		console.log('showmodal', debugging, imprintPrivacyUrl.length, statsRecord)
		return;
	}
	$('#statisticsModal').modal('show');
	$("#statisticsModalButtonYes").click(() => {
		fnSendResults(questionWeight, arPersonalPositions);
		$('#statisticsModal').modal('toggle');
	});
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