/*window.addEventListener("load", function() {
	// body... 
	var boton = document.getElementById("color-barra");
	boton.addEventListener("click",function(){
		var barra=document.querySelector("nav");
		var bg=barra.style.background
		if(bg==""){
			barra.style.background="rgba(51,51,51,0.7)";
			barra.style.textAlign = 'left';
		}else{
		     barra.style.background="";}
	});
});*/
$(document).ready(function () {
	$("#color-barra").click(function () { 
		if ($("nav").css("background-color") == "rgba(112, 112, 112, 0.5)") {
			$("nav").css("background-color", "rgba(30, 36, 36, 0.8)");
		}else{
			$("nav").css("background-color", "rgba(112, 112, 112, 0.5)");
		}		
	});
});

