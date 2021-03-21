var gatheredInfo = {};

gatheredInfo.questions = []
gatheredInfo.questions['gad_01'] = 0;
gatheredInfo.questions['gad_02'] = 0;
gatheredInfo.questions['phq_01'] = 0;
gatheredInfo.questions['phq_02'] = 0;
gatheredInfo.exclude = [];

questionIDs = ['gad_01', 'gad_02', 'phq_01', 'phq_02']


function updateQuestion(questionID, score)
{
	gatheredInfo.questions[questionID] = score;
}

function showResult()
{
	var text = "score:";
	for(id of questionIDs){
		text = text+"\n"+id+": "+gatheredInfo.questions[id];
	}
	
	document.getElementById("botResult").innerHTML = text;
}