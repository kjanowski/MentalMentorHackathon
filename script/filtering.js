filters_type = [];
filters_type[0]= { displayName:"Telefonisches Angebot", internalName:"art_hotline", active:false };
filters_type[1]= { displayName:"Psychotherapievermittlung", internalName:"art_vermittlung", active:false };


function isFiltered(){
	var i=0;
	while(i<filters_type.length)
	{
		if(filters_type[i].active)
			return true;
	}
	return false;
}


function isIncludedInFilter(angebot){
	if(!isFiltered)
		return true;	//wenn kein Filter aktiv ist, ist Angebot automatisch verfügbar
	
	var i=0;
	var included = false;
	while((i<filters_type.length) || (!included))
	{
		var internalName = filters_type[i].internalName; //Anzeigename auf Feld in der Datenstruktur abbilden
		
		//sobald ein aktiver Filter mit dem Angebot übereinstimmt, ist es eingeschlossen
		included = included || (filters_type[i].active && (angebot[internalName] == 1))
		
		i++;
	}
	//included ist true, falls eines der "Art des Angebots"-Tags zutrifft
		
	return included;
}
