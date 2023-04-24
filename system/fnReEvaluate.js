import { fnBarImage, fnEvaluation, fnPercentage } from "./general.js";
import { DEBUGGING, arParties, arResults, arMaxScore, questionWeight } from "./globals.js";

// 02/2015 BenKob
// Aktualisierung der Ergebnisse in der oberen Ergebnistabelle (short)
// Aufruf heraus in:
// (a) fnEvaluationShort() nach dem Aufbau der oberen Tabelle
// (b) in den Buttons in der detaillierten Auswertung (fnToggleSelfPosition() und fnToggleDouble())
export function fnReEvaluate() {
	//Ergebniss neu auswerten und Anzeige aktualisieren
	fnEvaluation();
	for (let i = 0; i < arParties.length; i++) {
		var percent = Math.round(arParties[i].scorePercent);
		var barImage = fnBarImage(percent);

		$("#partyBar" + i).width(percent + "%")
		//$("#partyBar" + i).text(`${percent}% (${points} / ${maxPoints})`);
		$("#partyBar" + i).text(``);
		$("#partyBar" + i).removeClass("bg-success bg-warning bg-danger").addClass(barImage);

		//$("#partyPoints" + i).text(points + "/" + maxPoints);
		//$("#partyPoints" + i).text(`${arResults[i]} von max ${arMaxScore[0]}`);
		$("#partyPoints" + i).text(`${arResults[i]}%`);
	}

}