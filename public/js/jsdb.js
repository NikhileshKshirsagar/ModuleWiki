$(document).ready(function(){
	$('#submit').click(function(){
		var form = ('#form1');
		var vc = $('input[type=radio]:checked').attr('id');
		console.log('submit button pressed');
		console.log(vc);
		//var vb = $("#form1 input[type='radio']:checked").value();
		//console.log(vb);
		console.log('calling ajax now');
		$.ajax({
			url : '/',
			type : 'POST',
			data : {'module' : vc, 'operation' : 'display'},
			success : function(result){
				console.log('successful operation');
				console.log(result);
				$('#div2').html(result);
			},
			error : function(){
				console.log('Error in creation');
			}
		});
	});
});