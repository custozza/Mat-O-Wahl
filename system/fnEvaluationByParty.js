import { DEBUGGING, arParties, arSortParties} from "./globals.js";



export function fnEvaluationByParty() {


    if (arSortParties.length != arParties.length) {
        throw Error("no sort information on parties")
    }

    if (DEBUGGING) console.log("sorted", arSortParties);

    for (let i = 0; i < arParties.length; i++) {
        const partyId = arSortParties[i];
        const party = arParties[partyId];


        const partyContainerHeader = document.createElement('div');
        partyContainerHeader.classList.add('party-answers-header','group-header', 'rounded');
        partyContainerHeader.setAttribute('id', `party-header${partyId}`);

        partyContainerHeader.innerHTML = `<div class="btn-title">${party.partyLong}</div>`

        $("#resultsByParty").append(partyContainerHeader);

        const partyContainer = document.createElement('div');
        partyContainer.classList.add('rounded','party-answers-container');
        $("#resultsByParty").append(partyContainer);

    }

    createCollabsible();

    return;

    function createCollabsible() {
        const headers = document.getElementsByClassName("group-header");
    
        for(let i = 0; i < headers.length; i++) {
            const header = headers[i];
            header.addEventListener("click", () => {
                console.log(header);
                const sibling = header.nextElementSibling;
                $(sibling).toggleClass('expanded'); // rename to question
                if(DEBUGGING) console.log(sibling);
            });
        }
    }




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
