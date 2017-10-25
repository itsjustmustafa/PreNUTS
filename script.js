let subjectQueryArr;
let currSubject;
let currQuery;


submitText = function(event, run=false){
	if(run || event.key == 'Enter'){
		currQuery = document.getElementById('prenutsInput').value;
		subjectQueryArr = querySubject(currQuery);
		// console.log(event.srcElement.value);
		document.location.href = 'www.itsjustmustafa.github.io/PreNuts?currQuery='+currQuery;
		
	}
	
}


selectSpan = function(event){
	if(event.srcElement.tagName=='SPAN'){
		document.getElementById('prenutsInput').value= event.srcElement.getAttribute('subjectcode')+" "+event.srcElement.getAttribute('subjectname');
		submitText(0,true);
	}
}


createTable = function(){
	let table = document.getElementById('prenutsTable');
	let tableContent = '';

	let headRow = 'class=\'headRow\'';
	if(subjectQueryArr.length==0){
		
		tableContent = '<tr><td></td><td><span class=\'currentSubject\'>No Result</span></td><td></td></tr>'
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

	if(subjectQueryArr.length>1){
		
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
	// console.log(tableContent);
	table.innerHTML = tableContent;

	let prereqSpans = document.getElementsByClassName('prereqSubject');
	let tooperSpans = document.getElementsByClassName('tooperSubject');



}

querySubject = function(query){
	let results = [];
	for(let i = 0; i< subjectArr.length; i++){
		if( (subjectArr[i].code+" "+subjectArr[i].name).toLowerCase().includes( query.toLowerCase() ) ){
			results.push(subjectArr[i]);
		} 
	}
	return(results);
}

if(currQuery){
	submitText(0,true);
	createTable();
}
