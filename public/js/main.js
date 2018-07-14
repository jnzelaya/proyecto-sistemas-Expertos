window.addEventListener("load", function() {
	// body... 
	var boton=document.getElementById("color-barra");
	boton.addEventListener("click",function(){
		var barra=document.querySelector("nav");
		var bg=barra.style.background
		if(bg==""){
			barra.style.background="gray";
		}else{
		     barra.style.background="";}
	});
});
