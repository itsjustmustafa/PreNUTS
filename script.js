let subjectQueryArr;
let currSubject;
let currQuery;

submitText = function(event, run=false){
	console.log(event);
	if(run || event.key == 'Enter'){
		console.log(document.getElementById('prenutsInput'));
		location.href = location.href.split('?')[0]+'?currQuery='+document.getElementById('prenutsInput').value;		
	}else{
		currQuery = document.getElementById('prenutsInput').value;
		if(currQuery.length>0){
			subjectQueryArr = querySubject(currQuery);
			subjectQueryArr = subjectQueryArr.sort((a, b)=>(a.name < b.name ? -1 : 1))
			console.log(currQuery);
			createTable(true);
		}else{
			subjectQueryArr=[]
			createTable(true);
		}

	}
	
}

selectSpan = function(event){
	if(event.srcElement.tagName=='SPAN'){
		document.getElementById('prenutsInput').value= event.srcElement.getAttribute('subjectname')+" "+event.srcElement.getAttribute('subjectcode');
		submitText(0,true);
	}
}


createTable = function(suggest = false){

	let table = document.getElementById('prenutsTable');
	let tableContent = '';

	let headRow = 'class=\'headRow\'';

	if(subjectQueryArr.length>1 || (suggest && currQuery.length>0)){

		if(subjectQueryArr.length > 50){
			subjectQueryArr = subjectQueryArr.splice(0,50);	
		}

		tableContent += '<tr><td></td><td><span '+headRow+'>Choose One Of The Following</span></td><td></td></tr>';
		for(i=0;i<subjectQueryArr.length;i++){	
			tableContent+= '<tr><td></td><td><span class=\'currentSubject\' '+
				'onclick = \'selectSpan(event)\' '+
				'subjectCode=\''+subjectQueryArr[i].code+'\' '+
				'subjectName=\''+subjectQueryArr[i].name+'\'>'+
				subjectQueryArr[i].code+
				" : "+
				subjectQueryArr[i].name+
				' <a href=\'http://handbook.uts.edu.au/subjects/'+subjectQueryArr[i].code+'.html\' target=\'_blank\'>(Handbook)</a>'+
				'</span></td><td></td></tr>';		
		}
	}	

	if(subjectQueryArr.length==0){
		if(currQuery.length>0){
				tableContent = '<tr><td></td><td><span class=\'currentSubject\'>No Result</span></td><td></td></tr>'
		}
	}
	if(subjectQueryArr.length==1){
		currSubject = subjectQueryArr[0];


		console.log(constrain(max(currSubject.preReq.length, currSubject.tooPer.length), 1, Infinity));
		
		tableContent = '<tr>';
		tableContent += '<td><span '+headRow+'>Prerequisite Subjects</span></td>'
		tableContent += '<td><span '+headRow+'>Current Subject</span></td>'
		tableContent += '<td><span '+headRow+'>TooPr Subjects</span></td></tr>';

		for(let i = 0; i<constrain(max(currSubject.preReq.length, currSubject.tooPer.length), 1, Infinity); i++){

			tableContent += "<tr><td>";
			
			if(i<currSubject.preReq.length){
				tableContent+= '<span class=\'prereqSubject\' '+
					'onclick = \'selectSpan(event)\' '+
					'subjectCode=\''+currSubject.preReq[i]+'\' '+
					'subjectName=\''+querySubject(currSubject.preReq[i])[0].name+'\'>'+
					(currSubject.preReq[i]+
					" : "+
					querySubject(currSubject.preReq[i])[0].name)+
					' <a href=\'http://handbook.uts.edu.au/subjects/'+currSubject.preReq[i]+'.html\' target=\'_blank\'>(Handbook)</a>'+
					'</span>';
			}

			tableContent+='</td><td>';

			if(i == 0){
				tableContent+= '<span class=\'currentSubject\'>'+currSubject.code+
					" : "+
					currSubject.name+
					' <a href=\'http://handbook.uts.edu.au/subjects/'+currSubject.code+'.html\' target=\'_blank\'>(Handbook)</a>'+
					'</span>';
			}
			tableContent+= '</td><td>';

			if(i<currSubject.tooPer.length){
				// console.log("still sall");
				tableContent+= '<span class=\'tooperSubject\' '+
					'onclick = \'selectSpan(event)\' '+
					'subjectCode=\''+currSubject.tooPer[i]+'\' '+
					'subjectName=\''+querySubject(currSubject.tooPer[i])[0].name+'\'>'+
					currSubject.tooPer[i]+
					" : "+
					querySubject(currSubject.tooPer[i])[0].name+
					' <a href=\'http://handbook.uts.edu.au/subjects/'+currSubject.tooPer[i]+'.html\' target=\'_blank\'>(Handbook)</a>'+
					'</span>';
			}

			tableContent+= '</td></tr>';

		}
		// tableContent = '<tr><td><span class=\"subject\">No Result</span></td></tr>'
	}


	// console.log(tableContent);
	table.innerHTML = tableContent;

	let prereqSpans = document.getElementsByClassName('prereqSubject');
	let tooperSpans = document.getElementsByClassName('tooperSubject');



}

querySubject = function(query){
	let results = [];
	for(let i = 0; i< subjectArr.length; i++){
		if( (subjectArr[i].name+" "+subjectArr[i].code).toLowerCase().includes( query.toLowerCase() ) ){
			results.push(subjectArr[i]);
		} 
	}
	results.sort((sub1, sub2)=>(sub1.name>sub1.name ? 1 : -1));
	return(results);
}


window.onload = function(){
	if(location.href.split('?').length>1){
		// console.log('yeeee');
		currQuery=location.href.split('?')[1].split('=')[1];
		document.getElementById('prenutsInput').value = currQuery;
		currQuery = currQuery.replace(/%20/g, ' ');
		//submitText(0,true);

		document.getElementById('prenutsInput').value = currQuery;
		subjectQueryArr = querySubject(currQuery);
		subjectQueryArr = subjectQueryArr.sort((a, b)=>(a.name < b.name ? -1 : 1))
		createTable();
		document.title = 'PreNUTS - '+currQuery;
	}
}
