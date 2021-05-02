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
var numQuestions=5;

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

	var result = getOffers(klinisch, subklinisch);


	var resultElement = document.getElementById("botResult");

	if(result.length==0)
		resultElement.innerHTML = "<div class=\"botText\">Leider haben wir keine passenden Angebote gefunden. Das kann daran liegen, dass du zu viele Arten von Angeboten ausgeschlossen hast. Du könntest noch einmal zurück gehen und mehr Arten zulassen.</div>";
	else resultElement.innerHTML = "<div class=\"botText\">Hier sind die Angebote, die wir für dich gefunden haben.</div>"+ result;
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
					angebotsArt += "<span class=\"AngebortsArtCat\">Kursangebot (Online & Offline)</span>";

				if(angebot.art_website_pdf == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=" ";
					angebotsArt += "<span class=\"AngebortsArtCat\">Informationsangebot</span>";
				}

				if(angebot.art_app == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=" ";
					angebotsArt += "<span class=\"AngebortsArtCat\">App</span>";
				}

				if(angebot.art_hotline == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=" ";
					angebotsArt += "<span class=\"AngebortsArtCat\">Telefonisches Angebot</span>";
				}

				if(angebot.art_vermittlung == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=" ";
					angebotsArt += "<span class=\"AngebortsArtCat\">Psychothereapievermittlung</span>";
				}

				if(angebot.art_beratung == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=" ";
					angebotsArt += "<span class=\"AngebortsArtCat\">Beratungsangebot</span>";
				}

				if(angebot.art_austausch == 1)
				{
					if(angebotsArt.length>0) angebotsArt +=" ";
					angebotsArt += "<span class=\"AngebortsArtCat\">Selbsthilfegruppen und Chatforen</span>";
				}

				//Kostenart (1 abziehen, um Index in der Mapping-Liste zu erhalten)
				var cost = cost_map[angebot.cost-1];

				//Ergebnis-Block hinzufügen
				resultText = resultText + "<div class=\"ergebnisBlock\">"
						+"<div class=\"costLine\"><span class=\"cost\"><span class=\"costSymb\">i</span>"+cost+"</span></div>"
						+"<div class=\"name\">"+angebot.name+"</div>"
						+"<div ><hr class=\"LineAngbebote\"></div>"
						+"<div class=\"description\">"+angebot.description+"</div>"
						+"<div ><hr class=\"LineAngbebote\"></div>"
						+"<div class=\"AngebotsArt\"><span class=\"AngebotsArtHead\">Art des Angebots: <br></span>"+angebotsArt+"</div>"
						+"<div style=\"text-align:right\"> <a class=\"linkgruen\" href=\""+angebot.link+"\" target=\"_blank\">Zum Angebot</a></div>"
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

function updateProgress(){
	var progress = counter/(numQuestions*1.0);

	var bar = document.getElementById("fortschritt-vg");
	bar.style.width=100*progress+"%";
	bar.innerHTML = "&ensp; Frage "+counter+" von "+numQuestions;

	//Fortschrittsbalken nur anzeigen, wenn das Ergebnis noch nicht erreicht ist
	if(progress > 1.0)
		document.getElementById("fortschritt-hg").style.display="none";
	else document.getElementById("fortschritt-hg").style.display="block";

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

	updateProgress();
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
	zurueckButton.style.display = "inline-block";
	updateProgress();

	//Link zur Alterabfrage ausblenden
	var zurueckLink = document.getElementById("zurueckZuAlter");
	zurueckLink.style.display = "none";
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
		//am Anfang der Fragen angekommen -> zurück-Button ausblenden, stattdessen Link zur Altersabfrage einblenden
		var zurueckButton = document.getElementById("zurueckButton");
		zurueckButton.style.display = "none";
		var zurueckLink = document.getElementById("zurueckZuAlter");
		zurueckLink.style.display = "inline-block";
	}

	updateProgress();
}
