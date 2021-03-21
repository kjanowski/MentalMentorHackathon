var gatheredInfo = {};

gatheredInfo.questions = []
gatheredInfo.questions['gad_01'] = 0;
gatheredInfo.questions['gad_02'] = 0;
gatheredInfo.questions['phq_01'] = 0;
gatheredInfo.questions['phq_02'] = 0;
gatheredInfo.exclude = [];

questionIDs = ['gad_01', 'gad_02', 'phq_01', 'phq_02']
gadCutoff = 3;
phqCutoff = 3;

var counter=1;

function updateQuestion(questionID, score)
{
	gatheredInfo.questions[questionID] = score;
}

function showResult()
{
	document.getElementById("frage_"+counter).style.display="none";

	var gadScore = gatheredInfo.questions['gad_01']+gatheredInfo.questions['gad_02'];
	var phqScore = gatheredInfo.questions['phq_01']+gatheredInfo.questions['phq_02'];
	var klinisch = (gadScore>=gadCutoff) || (phqScore>=phqCutoff);
	
	var text = "GAD score: "+gadScore+", PHQ score: "+phqScore+" -> klinisch: "+klinisch;
	
	var table = getOffers(klinisch);
	
	document.getElementById("botResult").innerHTML = text +"\n"+ table;
}

function getOffers(klinisch)
{
	var tableText = "<table><tr><th>Name</th><th>Kurzbeschreibung</th><th>Kontaktform</th><th>Bezahlung</th><th>Link</th></tr>"
	
	for(angebot of angebote)
	{
		if((klinisch && (angebot.hilfsangeboteKlinisch)==1)
			|| (!klinisch && (angebot.hilfsangeboteKlinisch)==0))
			tableText = tableText + "<tr>"
					+"<td>"+angebot.name+"</td>"
					+"<td>"+angebot.description+"</td>"
					+"<td>"+angebot.contact+"</td>"
					+"<td>"+angebot.cost+"</td>"
					+"<td><a class=\"linkgruen\" href=\""+angebot.link+"\">zum Angebot</a></td>"
				+"</tr>";			
	}
	
	tableText = tableText+"</table>";
	
	return tableText;
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
