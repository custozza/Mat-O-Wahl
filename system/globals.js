// Globale Variablen
export const arQuestionsShort = new Array();	// Kurzform der Fragen: Atomkraft, Flughafenausbau, ...
export const arQuestionsLong = new Array();		// Langform der Frage: Soll der Flughafen ausgebaut werden?

export const arPartyPositions = new Array();	// Position der Partei als Zahl aus den CSV-Dateien (1/0/-1)
export const arPartyOpinions = new Array();		// Begründung der Parteien aus den CSV-Dateien
export const arPersonalPositions = new Array();	// eigene Position als Zahl (1/0/-1) // why not have the weight also already store in this? -> becuase we can modify it in the output serperately 
export const arVotingDouble = new Array();	// eigene Position als Zahl (2/1/0/-1/-2) // können wir das ausbauen zu 3/2/1 0 skip -1/-2/-3
export const questionWeight = new Array();	// weight from 1 - 9 per questions // TODO initialize with question size

// let arPartyFiles = new Array();		// Liste mit den Dateinamen der Parteipositionen
export const arPartyNamesShort = new Array();	// Namen der Parteien - kurz
export const arPartyNamesLong = new Array();	// Namen der Parteien - lang
export const arPartyDescription = new Array();	// Beschreibung der Datei
export const arPartyInternet = new Array();		// Internetseiten der Parteien
export const arPartyLogosImg = new Array();		// Logos der Parteien
export const arParties = new Array();

export const arSortParties = new Array();		// Nummern der Listen, nach Punkten sortiert

export const arResults = new Array();
export const arMaxScore = new Array();

export const evaluationShiftFactor = 0; // PartyPositions are store as -1/0/1 we need them for the evalutation 1/2/3

var activeQuestion = 0;

export const DEBUGGING = false;
export const UNDER_CONSTRUCTION = true;

export function setActiveQuestion(value) {
  activeQuestion = value;
}

export function getActiveQuestion() {
  return activeQuestion;
}
