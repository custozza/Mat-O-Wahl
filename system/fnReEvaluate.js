import { fnBarImage, fnEvaluation, fnPercentage } from "./general.js";
import { DEBUGGING, arParties, arResults, questionWeight } from "./globals.js";

// 02/2015 BenKob
// Aktualisierung der Ergebnisse in der oberen Ergebnistabelle (short)
// Aufruf heraus in:
// (a) fnEvaluationShort() nach dem Aufbau der oberen Tabelle
// (b) in den Buttons in der detaillierten Auswertung (fnToggleSelfPosition() und fnToggleDouble())
export function fnReEvaluate() {
	//Ergebniss neu auswerten und Anzeige aktualisieren
	fnEvaluation();

	const filteredWeights = [...questionWeight.filter(x => x != null)];
	const maxPositivePoints = filteredWeights.reduce((a, b) => a + b, 0) * 3;
    const maxNegativePoints = maxPositivePoints * -1;
    const maxPoints = maxPositivePoints - maxNegativePoints;

    console.log(maxPoints)
    console.log(arResults)

	for (let i = 0; i < arParties.length; i++) {
        const normalizedPoints = arResults[i]-maxNegativePoints;
        const points = normalizedPoints;
		var percent = fnPercentage(points, maxPoints);
        if(DEBUGGING) console.log(percent, points, maxPoints)

		var barImage = fnBarImage(percent);

		$("#partyBar" + i).width(percent + "%")
		$("#partyBar" + i).text(`${percent}% (${points} / ${maxPoints})`);
		$("#partyBar" + i).removeClass("bg-success bg-warning bg-danger").addClass(barImage);

		$("#partyPoints" + i).html(points + "/" + maxPoints);

	}

}