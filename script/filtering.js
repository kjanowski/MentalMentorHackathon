filters_type = [];
filters_type[0]= { displayName:"Telefonisches Angebot", internalName:"art_hotline", button_id:"type_0" , active:false };
filters_type[1]= { displayName:"Psychotherapievermittlung", internalName:"art_vermittlung", button_id:"type_1" , active:false };
filters_type[2]= { displayName:"Beratungsangebot", internalName:"art_beratung", button_id:"type_2" , active:false };
filters_type[3]= { displayName:"Informationsangebot", internalName:"art_website_pdf", button_id:"type_3" , active:false };
filters_type[4]= { displayName:"App", internalName:"art_app", button_id:"type_4" , active:false };
filters_type[5]= { displayName:"Selbsthilfegruppe und -forum", internalName:"art_austausch", button_id:"type_5" , active:false };
filters_type[6]= { displayName:"Kursangebot (Online & Offline)", internalName:"art_einzelangebot", button_id:"type_6" , active:false };

filters_cost = [];
filters_cost[0] = { displayName:"Kostenlos", cost_value:0, button_id:"cost_0" , active:false};
filters_cost[1] = { displayName:"Kostenübernahme durch Krankenkasse", cost_value:1, button_id:"cost_1" , active:false};
filters_cost[2] = { displayName:"Kostenpflichtig", cost_value:2, button_id:"cost_2" , active:false};
filters_cost[3] = { displayName:"Teilweise Kostenpflichtig", cost_value:3, button_id:"cost_3" , active:false};

filters_access = [];
filters_access[0] = {displayName:"Online", contact_value:"online", button_id:"access_0", active: false};
filters_access[1] = {displayName:"Offline", contact_value:"offline", button_id:"access_1", active: false};

function isTypeFiltered(){
	var i=0;
	while(i<filters_type.length)
	{
		if(filters_type[i].active)
			return true;
		i++;
	}

	return false;
}

function isCostFiltered(){
	var i=0;
	while(i<filters_cost.length)
	{
		if(filters_cost[i].active)
			return true;
		i++;
	}

	return false;
}

function isAccessFiltered(){
	var i=0;
	while(i<filters_access.length)
	{
		if(filters_access[i].active)
			return true;
		i++;
	}

	return false;
}

function resetFilters(){
	var i=0;
	while(i<filters_type.length)
	{
		filters_type[i].active = false;
		updateButton(filters_type[i].button_id, filters_type[i].active);
		
		i++;
	}
	
	i=0;
	while(i<filters_cost.length)
	{
		filters_cost[i].active = false;
		updateButton(filters_cost[i].button_id, filters_cost[i].active);

		i++;
	}
	
	i=0;
	while(i<filters_access.length)
	{
		filters_access[i].active = false;
		updateButton(filters_access[i].button_id, filters_access[i].active);

		i++;
	}
	
	showOffers();
}

function isIncludedInFilter(angebot){
	var i;

	//prüfe Art des Angebots ----------------------------------------------------------
	var typeIncluded = true;
	if(isTypeFiltered())
	{
		//falls irgendein Tag im "Art des Angebots"-Block ausgewählt ist, wird Filterung überprüft
		i=0;
		typeIncluded = false;
		while(i<filters_type.length)
		{
			var internalName = filters_type[i].internalName; //Anzeigename auf Feld in der Datenstruktur abbilden
			console.log(angebot.name+": angebot["+internalName+"] = "+angebot[internalName]);

			//sobald ein aktiver Filter mit dem Angebot übereinstimmt, ist es eingeschlossen
			var tagMatch = (filters_type[i].active && (angebot[internalName] == 1));
			console.log(angebot.name+": tagMatch = "+tagMatch);

			//included wird true, sobald eines der "Art des Angebots"-Tags zutrifft
			typeIncluded = typeIncluded || tagMatch;

			i++;
		}
	}

	//prüfe Kosten --------------------------------------------------------------------
	var costIncluded = true;

	if(isCostFiltered())
	{
		costIncluded = filters_cost[(angebot.cost-1)].active;
		//included ist true, falls die Kostenart des Angebots ausgewählt ist
	}

	//prüfe Zugang --------------------------------------------------------------------
	var accessIncluded = true;

	if(isAccessFiltered()){
		switch(angebot.contact){
			case "online":
			{
				accessIncluded = filters_access[0].active;
				break;
			}
			case "offline":
			{
				accessIncluded = filters_access[1].active;
				break;
			}
			case "beides":
			{
				accessIncluded = (filters_access[0].active || filters_access[1].active);
				break;
			}
			default:
			{
				console.log("unbekannte Zugangsart: "+angebot.contact);
				break;
			}
		}
	}

	//Endergebnis ------------------------------------------------------------------------
	return (typeIncluded && costIncluded && accessIncluded);
}


function toggleTypeFilter(tagName){
	var i=0;
	var found = false;

	while(!found && (i<filters_type.length))
	{
		if(filters_type[i].displayName == tagName)
		{
			//Filter umschalten 
			filters_type[i].active = !filters_type[i].active;

			console.log("Typ-Filter gefunden: "+i+", auf "+filters_type[i].active+" gesetzt");
			updateButton(filters_type[i].button_id, filters_type[i].active);

			
			found = true;	//benötigtes Tag wurde gefunden
		}
		
		i++;
	}

	showOffers();
}

function toggleCostFilter(tagName){
	var i=0;
	var found = false;

	while(!found && (i<filters_cost.length))
	{
		if(filters_cost[i].displayName == tagName)
		{
			//Filter umschalten 
			filters_cost[i].active = !filters_cost[i].active;

			console.log("Kosten-Filter gefunden: "+i+", auf "+filters_cost[i].active+" gesetzt");			
			updateButton(filters_cost[i].button_id, filters_cost[i].active);
			
			found = true;	//benötigtes Tag wurde gefunden
		}
		
		i++;
	}

	showOffers();
}

function toggleAccessFilter(tagName){
	var i=0;
	var found = false;

	while(!found && (i<filters_access.length))
	{
		if(filters_access[i].displayName == tagName)
		{
			//Filter umschalten 
			filters_access[i].active = !filters_access[i].active;

			console.log("Zugangs-Filter gefunden: "+i+", auf "+filters_access[i].active+" gesetzt");
			updateButton(filters_access[i].button_id, filters_access[i].active);
			
			found = true;	//benötigtes Tag wurde gefunden
		}
		
		i++;
	}

	showOffers();
}

function updateButton(buttonID, isActive)
{
	//den Button mit der geeigneten Klasse versehen
	var button = document.getElementById(buttonID);
	if(isActive)
		button.style.background = "var(--filter-active)";
	else button.style.background = "var(--filter-inactive)";
}

function getOffers()
{
	var numOffers = 0;

	//Ergebnis-Liste anfangs leer
	var resultText = "<div class=\"ergebnisse\">"

	for(angebot of angebote)
	{
		//zuerst auf Ausschluss von Kategorien prüfen
		if(isIncludedInFilter(angebot))
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

	//Sonderfall: keine Angebote gefunden
	if(numOffers == 0)
	{
		return "";
	}


	//ansonsten die Liste abschliessen
	resultText = resultText+"</div>";

	return resultText;
}

function showOffers(){
	var result = getOffers();
	var resultElement = document.getElementById("botResult");

	if(result.length==0)
		resultElement.innerHTML = "<div class=\"botText\">Leider haben wir keine passenden Angebote gefunden. Das kann daran liegen, dass du zu viele Arten von Angeboten ausgeschlossen hast. Du könntest versuchen, mehr Arten zulassen.</div>";
	else resultElement.innerHTML = "<div class=\"botText\">Hier sind die Angebote, die wir für dich gefunden haben.</div>"+ result;
}

