// Einlesen der Parteipositionen und Partei-Informationen (aus fnStart())
import { fnTransformCsvToArray } from './fnTransformCsvToArray.js'
import { arSortParties, arPartyDescription} from './globals.js'; 

export function fnReadPositions(csvData) {
	// Einlesen der Parteipositionen und Vergleichen
	// fnSplitLines(csvData,0);
	fnTransformCsvToArray(csvData, 0)
	arSortParties.push(...Array.from({length: arPartyDescription.length}, (_, i) => i));
}
