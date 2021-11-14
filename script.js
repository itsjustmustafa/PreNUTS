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


getSubjectSpanHTML = function(subjectObjCode,subjectObjName, subjectType){
	let clickEvent = "onclick = \'selectSpan(event)\'";
	if(subjectObjName == ""){
		clickEvent = "";
	}
	return "<tr><td></td><td><span class=\'" + subjectType + "\' "+
				clickEvent +
				"subjectCode=\'"+subjectObjCode+"\' "+
				"subjectName=\'"+subjectObjName+"\'>"+
				subjectObjCode+
				" : "+
				subjectObjName+
				" <a href=\'http://handbook.uts.edu.au/subjects/"+subjectObjCode+".html\' target=\'_blank\'>(Handbook)</a>"+
				"</span></td><td></td></tr>";
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
			tableContent+= getSubjectSpanHTML(subjectQueryArr[i].code,subjectQueryArr[i].name, "currentSubject");	
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
				let preReqName = null;
				if(querySubject(currSubject.preReq[i]).length == 0){
					preReqName = "";
				}else{
					preReqName = querySubject(currSubject.preReq[i])[0].name;
				}
				tableContent+= getSubjectSpanHTML(currSubject.preReq[i], preReqName, "prereqSubject");
			}else{
				tableContent+= "<p> - No preReq - </p>"
			}

			tableContent+='</td><td>';

			if(i == 0){
				tableContent+= '<span class=\'currentSubject\'>'+currSubject.code+
					" : "+
					currSubject.name+
					' <a href=\'http://handbook.uts.edu.au/subjects/'+currSubject.code+'.html\' target=\'_blank\'>(Handbook)</a>'+
					'</span>';
			}else{
				tableContent+= "<p> - No currSubj - </p>"
			}
			tableContent+= '</td><td>';

			if(i<currSubject.tooPer.length){
				let tooPerName = null;
				if(querySubject(currSubject.tooPer[i]).length == 0){
					tooPerName = "";
				}else{
					tooPerName = querySubject(currSubject.tooPer[i])[0].name;
				}
				tableContent+= getSubjectSpanHTML(currSubject.tooPer[i], tooPerName, "tooperSubject");
			}else{
				tableContent+= "<p> - No tooPer - </p>"
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
