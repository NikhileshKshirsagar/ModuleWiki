$(document).ready(function(){
//	$.ajax({
//		url : '/',
//		type : 'GET',
//		success : function(){
//			console.log('successful operation');
//		},
//		error : function(){
//			console.log('Error in creation');
//		}
//	});
	
	var obj = null;
	
	$('#search').click(function(){
		console.log('Search operation');
		$.ajax({
			url : '/',
			type : 'POST',
			data : {'input' : $('#input').val(), 'operation' : 'search'},
			success : function(result){
				//console.log(result);
				obj = result;
				$('#div2').html(obj);
			}
		});
	});
	
	$('#save').click(function(){
		console.log('Save operation');
		$.ajax({
			url : '/',
			type : 'POST',
			data : {'input' : $('#input').val(), 'operation' : 'save'},
			success : function(result){
				//console.log(result);
				obj = result;
		
				$('#db').html(obj.variable1);
				$('#div2').html(obj.variable2);
			}
		});
	});
	
	$('#database').click(function(){
		$.ajax({
			url : '/',
			type : 'POST',
			data : {'operation' : 'database'},
			success : function(result){
				//console.log(result);
				obj = result;
				$('#db').html(obj);
			}
		});
	});
});