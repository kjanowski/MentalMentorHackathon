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


function isIncludedInFilter(angebot){
	var i;

	//prüfe Art des Angebots ----------------------------------------------------------
	var typeIncluded = true;
	if(isTypeFiltered())
	{
		//falls irgendein Tag im "Art des Angebots"-Block ausgewählt ist, wird Filterung überprüft
		i=0;
		while((i<filters_type.length) || (!included))
		{
			var internalName = filters_type[i].internalName; //Anzeigename auf Feld in der Datenstruktur abbilden

			//sobald ein aktiver Filter mit dem Angebot übereinstimmt, ist es eingeschlossen
			included = included || (filters_type[i].active && (angebot[internalName] == 1))

			i++;
		}
		//included ist true, falls eines der "Art des Angebots"-Tags zutrifft
	}

	//prüfe Kosten --------------------------------------------------------------------
	var costIncluded = true;

	if(isCostFiltered())
	{
		costIncluded = filters_cost[angebot.cost].active;
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
			filters_type[i].active = !filters_type[i].active;
		}
	}

}
