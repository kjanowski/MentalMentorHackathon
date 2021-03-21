var gatheredInfo = {};

gatheredInfo.questions = []
gatheredInfo.questions['gad_01'] = 0;
gatheredInfo.questions['gad_02'] = 0;
gatheredInfo.questions['phq_01'] = 0;
gatheredInfo.questions['phq_02'] = 0;
gatheredInfo.exclude = [];

questionIDs = ['gad_01', 'gad_02', 'phq_01', 'phq_02']

var counter=1;

function updateQuestion(questionID, score)
{
	gatheredInfo.questions[questionID] = score;
}

function showResult()
{
	document.getElementById("frage_"+counter).style.display="none";
	
	var text = "score:";
	for(id of questionIDs){
		text = text+"\n"+id+": "+gatheredInfo.questions[id];
	}
	
	document.getElementById("botResult").innerHTML = text;
}

function initQuestionnaire(){
	
	document.getElementById("frage_1").style.display="block";
	document.getElementById("frage_2").style.display="none";
	document.getElementById("frage_3").style.display="none";
	document.getElementById("frage_4").style.display="none";

}

function moveToNext()
{
	document.getElementById("frage_"+counter).style.display="none";
	
	counter++;

	document.getElementById("frage_"+counter).style.display="block";	
}

function moveBack()
{
	document.getElementById("frage_"+counter).style.display="none";
	
	counter--;

	document.getElementById("frage_"+counter).style.display="block";	
}
