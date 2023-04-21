// Einlesen der Parteipositionen und Partei-Informationen (aus fnStart())
import { fnSetIntParties } from './fnSetIntParties.js'
import { fnTransformCsvToArray } from './fnTransformCsvToArray.js'
import { setParties, getParties} from './globals.js'; 

export function fnReadPositions(csvData) {
	// Einlesen der Parteipositionen und Vergleichen
	// fnSplitLines(csvData,0);
	setParties(fnSetIntParties(csvData)); // TODO replace either directly set or ...
	fnTransformCsvToArray(csvData, 0, getParties())
}
