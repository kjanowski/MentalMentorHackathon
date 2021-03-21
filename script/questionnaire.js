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
	
	//var text = "GAD score: "+gadScore+", PHQ score: "+phqScore+" -> klinisch: "+klinisch;
	
	var table = getOffers(klinisch, subklinisch);


	var resultElement = document.getElementById("botResult");
	
	if(table.length==0)
		resultElement.innerHTML = "Leider habe ich keine passenden Angebote gefunden. Das kann daran liegen, dass du zu viele Arten von Angeboten ausgeschlossen hast. Du könntest noch einmal zurück gehen und mehr Arten zulassen.";
	else resultElement.innerHTML = "Hier sind die Angebote, die ich für dich gefunden habe.\n"+ table;
}

function isIncluded(angebot){
	if(gatheredInfo.exclude['online'])
	{
		//schließt aus, wenn Online-Kontakt vorliegt
		if(angebot.contact == "online")
			return false;
	}
	
	if(gatheredInfo.exclude['hotline'])
	{
		//schliesst aus, wenn nur Hotline, aber kein Online-Angebot vorliegt
		if((angebot.art_hotline == 1) && (angebot.art_website_pdf == 0))
			return false;
	}
	
	return true;
}


function getOffers(klinisch, subklinisch)
{
	var numOffers = 0;
	
	//Ergebnis-Liste anfangs leer
	var resultText = "<div class=\"ergebnisse\">"
	
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
				numOffers++; //Angebote zählen
				
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
				
				//Ergebnis-Block hinzufügen
				resultText = resultText + "<div class=\"ergebnisBlock\">"
						+"<div class=\"kosten\">"+cost+"</div>"
						+"<div class=\"name\">"+angebot.name+"</div>"
						+"<div class=\"beschreibung\">"+angebot.description+"</div>"
						+"<a class=\"linkgruen\" href=\""+angebot.link+"\" target=\"_blank\">zum Angebot</a>"
					+"</div>";		
			}
		}
	}
	
	//Sonderfall: keine Angebote gefunden
	if(numOffers == 0)
	{
		return "";
	}
	
	
	//ansonsten die Liste abschliessen
	resultText = resultText+"</div>";
	
	return resultText;
}



function initQuestionnaire(){
	//nur den ersten Fragenblock anzeigen
	counter=1;
	document.getElementById("frage_1").style.display="block";
	document.getElementById("frage_2").style.display="none";
	document.getElementById("frage_3").style.display="none";
	document.getElementById("frage_4").style.display="none";
	document.getElementById("frage_5").style.display="none";
	
	//am Anfang der Fragen -> zurück-Button ausblenden
	var zurueckButton = document.getElementById("zurueckButton");		
	zurueckButton.style.display = "none";
}

function moveToNext()
{
	//alten Block ausblenden
	var currBlock = document.getElementById("frage_"+counter);
	if(currBlock != undefined)
		currBlock.style.display="none";
	
	counter++;

	//neuen Block einblenden
	var nextBlock =	document.getElementById("frage_"+counter);
	if(nextBlock != undefined)
		nextBlock.style.display="block";	

	//zurück-Button einblenden
	var zurueckButton = document.getElementById("zurueckButton");		
	zurueckButton.style.display = "block";
}

function moveBack()
{
	//alten Block ausblenden
	var currBlock = document.getElementById("frage_"+counter);
	if(currBlock != undefined)
		currBlock.style.display="none";
	
	counter--;

	//neuen Block einblenden
	var nextBlock =	document.getElementById("frage_"+counter);
	if(nextBlock != undefined)
		nextBlock.style.display="block";
	
	if(counter==1)
	{
		//am Anfang der Fragen angekommen -> zurück-Button ausblenden
		var zurueckButton = document.getElementById("zurueckButton");		
		zurueckButton.style.display = "none";
	}
}
