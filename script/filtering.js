filters = [];
filters[0]= { name:"Telefonisches Angebot", active:false };
filters[1]= { name:"Psychotherapievermittlung", active:false };


function isFiltered(){
	var i=0;
	while(i<filters.length)
	{
		if(filters[i].active)
			return true;
	}
	return false;
}


function isIncludedInFilter(angebot){
	if(!isFiltered)
		return true;	//wenn kein Filter aktiv ist, ist Angebot automatisch verfügbar
	
	
}
