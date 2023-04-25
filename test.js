export function evaluate(answers, aParties, weights, wParties) 
{
    // answers: array[nAnswers], values in [-1,0,+1]
    // aParties: array[nParties, nAnswers], values in [-1,0,+1]
    // weights: array[nAnswers], values in [1..9]
    // wParties: array[nParties, nAnswers], values in [1..3]

    var numQuestions = answers.length;
    var numParties = aParties.length;

    function calcAnswerScore(aId, a, aP, g, gP) {
        //return g[aId] * gP[aId] * a[aId] * aP[aId];       //old and bad
        //const returnValue = 1+(Math.min(Math.abs(a[aId]-aP[aId]),-Math.abs(a[aId]-aP[aId])*((g[aId]/9)*(gP[aId]/3)^1.5)))/2;
        const returnValue = 1+(Math.min(Math.abs(a[aId]-aP[aId]),-Math.abs(a[aId]-aP[aId])*((g[aId]/9))))/2;  //old DR
        console.log("calcAnswerScore",returnValue)
        return returnValue;
    }

    var scoresPerParty = [];
    var answerScoresPerParty = [];
	for (let pId = 0; pId < numParties; pId++)
    {
        scoresPerParty.push(0)
        answerScoresPerParty.push([])
        for (let aId = 0; aId < numQuestions; aId++)
        {
            var score = calcAnswerScore(aId, answers, aParties[pId], weights, wParties[pId]);
            scoresPerParty[pId] += score;
            answerScoresPerParty[pId].push(score);
        }
    }

    var maxScore = 0;
    for (let aId = 0; aId < numQuestions; aId++)
    {
        maxScore += Math.abs(answers[aId]) * weights[aId] * 3;
    }

    // transform -max...+max -> 0...2*max
    //scoresPerParty = scoresPerParty.map((s) => s+maxScore);   //old and bad
    scoresPerParty = scoresPerParty.map((s) => Math.round((s/numQuestions)*100));
    maxScore = 100;

	//const scoresPercentPerParty = scoresPerParty.map((score) => (100 * score / maxScore) || 0);
    const scoresPercentPerParty=scoresPerParty;

    return [scoresPerParty, answerScoresPerParty, maxScore, scoresPercentPerParty];
}

export function _unit_test_evaluate()
{
    _unit_test_runs();
    _unit_test_answers();
    _unit_test_weights();
}

function assert(val, expected, message) {
    var cond = false;
    if (Array.isArray(expected))
    {
        cond = arrayEquals(val, expected);
    }
    else
    {
        cond = val === expected
    }

    if (!cond) {
        console.log(message + " failed");
        console.log("Got:");
        console.log(val);
        console.log("Expected");
        console.log(expected);
    }
}

// how is this not in the standard library? https://flexiple.com/javascript/javascript-array-equality/
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function _unit_test_runs()
{
    let answers = [-1, 1, 0, 0, -1, 1, 1, 1, -1, 0, 1, -1, 0, -1, 1, -1, 1, 1, 0, 1, 1, 1, 1, 1, -1];
    let aPartyA = [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1];
    let aPartyB = [-1, 1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1, -1];
    let aPartyC = [-1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1];
    let aPartyD = [-1, 1, -1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1, -1];
    let aParties = [aPartyA, aPartyB, aPartyC, aPartyD];
    let weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 2, 2, 2, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 8, 9, 1];
    let wPartyA = [1, 1, 1, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1];
    let wPartyB = [1, 2, 1, 3, 3, 3, 3, 1, 1, 2, 2, 2, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1];
    let wPartyC = [1, 2, 2, 2, 3, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 2, 1];
    let wPartyD = [1, 1, 3, 1, 1, 2, 2, 2, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 1];
    let wParties = [wPartyA, wPartyB, wPartyC, wPartyD];

    var [scoresPerParty, answerScoresPerParty] = evaluate(answers, aParties, weights, wParties)

    // console.log(answerScoresPerParty);  // array[4, 25]
    // console.log(scoresPerParty);  // array[4]

    assert(scoresPerParty.length, 4, "scoresPerParty.length")
    assert(answerScoresPerParty.length, 4, "answerScoresPerParty.length")
    for (var i=0; i < aParties.length; ++i)
    {
        assert(answerScoresPerParty[i].length, 25, "answerScoresPerParty[i].length")
    }
}

function _unit_test_answers()
{
    let answers = [-1, 0, +1, +1];
    let aSame = [-1, 0, +1, +1];
    let aOpposite = [+1, 0, -1, -1];
    let aDontCare = [0, 0, 0, 0];
    let aParties = [aSame, aOpposite, aDontCare];

    let weights = [1, 1, 1, 1];  // 1..9
    let wPartyA = [1, 1, 1, 1];  // 1..3
    let wParties = [wPartyA, wPartyA, wPartyA];

    var [scoresPerParty, answerScoresPerParty] = evaluate(answers, aParties, weights, wParties)

    assert(scoresPerParty, [3, -3, 0], "scoresPerParty")
    assert(answerScoresPerParty[0], [1, 0, 1, 1], "answerScoresPerParty[0]")
    assert(answerScoresPerParty[1], [-1, 0, -1, -1], "answerScoresPerParty[0]")
    assert(answerScoresPerParty[2], [0, 0, 0, 0], "answerScoresPerParty[0]")
}


function _unit_test_weights()
{
    let answers = [-1, 0, +1, +1];
    let aSame = [-1, 0, +1, +1];
    let aOpposite = [+1, 0, -1, -1];
    let aDontCare = [0, 0, 0, 0];
    let aParties = [aSame, aOpposite, aDontCare];

    let weights = [5, 3, 1, 9];  // 1..9
    let wSame = [2, 1, 1, 3];  // 1..3
    let wOpposite = [3, 1, 2, 1];  // 1..3
    let wDontCare = [1, 2, 3, 1];  // 1..3
    let wParties = [wSame, wOpposite, wDontCare];

    var [scoresPerParty, answerScoresPerParty] = evaluate(answers, aParties, weights, wParties)

    assert(scoresPerParty, [38, -26, 0], "scoresPerParty")
    assert(answerScoresPerParty[0], [10, 0, 1, 27], "answerScoresPerParty[0]")
    assert(answerScoresPerParty[1], [-15, 0, -2, -9], "answerScoresPerParty[0]")
    assert(answerScoresPerParty[2], [0, 0, 0, 0], "answerScoresPerParty[0]")
}
