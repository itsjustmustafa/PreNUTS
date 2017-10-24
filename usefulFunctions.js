function constrain(num, min, max){
	if(num<min){
		num = min;
	}
	if(num>max){
		num = max;
	}
	return(num);
}

function max(num1, num2){
	if(num1>num2){
		return(num1);
	}
	return(num2);
}