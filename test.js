export function test() 
{

    let intQuestions = 25;
    let intParties = 4;

    let answers = [-1, 1, 0, 0, -1, 1, 1, 1, -1, 0, 1, -1, 0, -1, 1, -1, 1, 1, 0, 1, 1, 1, 1, 1, -1];
    let aPartyA = [1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1];
    let aPartyB = [-1, 1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1, -1];
    let aPartyC = [-1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1];
    let aPartyD = [-1, 1, -1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1, -1];
    let aParties = [aPartyA, aPartyB, aPartyC, aPartyD];
    let weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 2, 2, 2, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 8, 9, 1];
    let gPartyA = [1, 1, 1, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1];
    let gPartyB = [1, 2, 1, 3, 3, 3, 3, 1, 1, 2, 2, 2, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1];
    let gPartyC = [1, 2, 2, 2, 3, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 2, 1];
    let gPartyD = [1, 1, 3, 1, 1, 2, 2, 2, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 1];
    let gParties = [gPartyA, gPartyB, gPartyC, gPartyD];

    function calcAnswerScore(aId, a, aP, g, gP) {
        return g[aId] * gP[aId] * a[aId] * aP[aId];
    }

    var scoresPerParty = [];
    var answerScoresPerParty = [];
	for (let pId = 0; pId < intParties; pId++)
    {
        scoresPerParty.push(0)
        answerScoresPerParty.push([])
        for (let aId = 0; aId < intQuestions; aId++)
        {
            var score = calcAnswerScore(aId, answers, aParties[pId], weights, gParties[pId]);
            scoresPerParty[pId] += score;
            answerScoresPerParty[pId].push([score]);
        }
    }

    console.log(answerScoresPerParty);
    console.log(scoresPerParty);
}
