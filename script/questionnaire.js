var gatheredInfo = {};

gatheredInfo.questions = []
gatheredInfo.questions['gad_01'] = 0;
gatheredInfo.questions['gad_02'] = 0;
gatheredInfo.questions['phq_01'] = 0;
gatheredInfo.questions['phq_02'] = 0;

gatheredInfo.exclude = [];
gatheredInfo.exclude['online'] = false;
gatheredInfo.exclude['hotline'] = false;


//Schwellwerte für Score
gadCutoff = 3;
phqCutoff = 3;

//Fragen-Zähler
var counter=1;

function updateQuestion(questionID, score)
{
	gatheredInfo.questions[questionID] = score;
}

function updateExclusion(){
	gatheredInfo.exclude['online'] = document.getElementById("exclude_online").checked;
	gatheredInfo.exclude['hotline'] = document.getElementById("exclude_hotline").checked;
}

function showResult()
{
	moveToNext(); //letzte Frage ausblenden und Zähler hinter das Ende setzen 

	var gadScore = gatheredInfo.questions['gad_01']+gatheredInfo.questions['gad_02'];
	var phqScore = gatheredInfo.questions['phq_01']+gatheredInfo.questions['phq_02'];
	var klinisch = (gadScore>=gadCutoff) || (phqScore>=phqCutoff);
	var subklinisch = ((gadScore>0)&&(gadScore<gadCutoff)) || ((phqScore>0)&&(phqScore<phqCutoff));
	
	
	var text = "Hier sind die Angebote, die ich für dich gefunden habe.";
	//"GAD score: "+gadScore+", PHQ score: "+phqScore+" -> klinisch: "+klinisch;
	
	var table = getOffers(klinisch, subklinisch);
	
	document.getElementById("botResult").innerHTML = text +"\n"+ table;
}

function isIncluded(angebot){
	if(gatheredInfo.exclude['online'])
	{
		if((angebot.art_website_pdf == 1) || (angebot.contact == "online"))
			return false;
	}
	
	if(gatheredInfo.exclude['hotline'])
	{
		if(angebot.art_hotline == 1)
			return false;
	}
	
	return true;
}


function getOffers(klinisch, subklinisch)
{
	//Tabellen-Header
	var tableText = "<table><tr><th>Name</th><th>Kurzbeschreibung</th><th>Art des Angebots</th><th>Bezahlung</th><th>Link</th></tr>"
	
	for(angebot of angebote)
	{
		//zuerst auf Ausschluss von Kategorien prüfen
		if(isIncluded(angebot))
		{
			//prüfen, ob das Angebot zum Score passt
			var matchKlinisch = klinisch && (angebot.hilfsangeboteKlinisch==1);
			var matchSubklinisch = subklinisch && (angebot.hilfsangeboteSubklinisch==1);
			var matchNichtklinisch = !(klinisch || subklinisch) && ((angebot.hilfsangeboteKlinisch==0)||(angebot.hilfsangeboteSubklinisch==1));
				
			if(matchKlinisch || matchSubklinisch || matchNichtklinisch)
			{
				
				//Angebots-Art(en) ausgeben
				var angebotsArt = "";
				
				if(angebot.art_einzelangebot == 1)
					angebotsArt += "Einzelangebot";
				
				if(angebot.art_website_pdf == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=", ";
					angebotsArt += "Website/PDF";
				}
				
				if(angebot.art_app == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=", ";
					angebotsArt += "App";
				}
				
				if(angebot.art_hotline == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=", ";
					angebotsArt += "Hotline";
				}
				
				if(angebot.art_vermittlung == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=", ";
					angebotsArt += "Vermittlung";
				}

				if(angebot.art_beratung == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=", ";
					angebotsArt += "Beratung";
				}

				if(angebot.art_austausch == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=", ";
					angebotsArt += "Austausch";
				}
				
				//Kostenart (1 abziehen, um Index in der Mapping-Liste zu erhalten)
				var cost = cost_map[angebot.cost-1];
				
				//Tabellen-Zeile hinzufügen
				tableText = tableText + "<tr>"
						+"<td class=\name\">"+angebot.name+"</td>"
						+"<td class=\"beschreibung\">"+angebot.description+"</td>"
						+"<td class=\"art\">"+angebotsArt+"</td>"
						+"<td class=\"kosten\">"+cost+"</td>"
						+"<td class=\"link\"><a class=\"linkgruen\" href=\""+angebot.link+"\">zum Angebot</a></td>"
					+"</tr>";		
			}
		}
	}
	
	//Tabelle abschliessen
	tableText = tableText+"</table>";
	
	return tableText;
}



function initQuestionnaire(){
	counter=1;
	document.getElementById("frage_1").style.display="block";
	document.getElementById("frage_2").style.display="none";
	document.getElementById("frage_3").style.display="none";
	document.getElementById("frage_4").style.display="none";
	document.getElementById("frage_5").style.display="none";
}

function moveToNext()
{
	var currBlock = document.getElementById("frage_"+counter);
	if(currBlock != none)
		currBlock.style.display="none";
	
	counter++;

	var nextBlock =	document.getElementById("frage_"+counter);
	if(currBlock != none)
		currBlock.style.display="block";	
}

function moveBack()
{
	var currBlock = document.getElementById("frage_"+counter);
	if(currBlock != none)
		currBlock.style.display="none";
	
	counter--;

	var nextBlock =	document.getElementById("frage_"+counter);
	if(currBlock != none)
		currBlock.style.display="block";	
}
