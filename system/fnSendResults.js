import '../data/definition.js'

// Senden der persoenlichen Ergebnisse an den Server (nach Einwilligung)
// Aufruf aus fnEvaluation()
export function fnSendResults(arResults, arPersonalPositions)
{
	// $.get(statsServer, { mowpersonal: strPersonalPositions, mowparties: strResults } );
	$.get(statsServer, { votes: arPersonalPositions } );
	console.info("direkt schicken", statsServer, arResults, arPersonalPositions )
	return;
}

