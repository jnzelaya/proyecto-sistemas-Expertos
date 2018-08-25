$("#slc-lenguaje").change(function () { 
    lenguaje();
});

$(document).ready(function () {
    $("#edit").hide();
    $("#reciclaje").hide();
    leerArchivo();
    leerReciclados();
    
}); 


$("#Ainicio").click(function () { 
    $("#inicio").show('slow');
    $("#edit").hide();
    $("#reciclaje").hide();
    $("#config").hide();
    $("#archivos").html("");
    leerArchivo();
      
});

$("#Aeditor").click(function () {         
    $("#edit").show('slow');
    $("#inicio").hide();
    $("#reciclaje").hide();
    $("#config").hide();
});

$("#Areciclados").click(function () { 
    $("#reciclaje").show('fast');
    $("#edit").hide();
    $("#inicio").hide();
    $("#config").hide();
    $("#archivosReciclados").html("");
    leerReciclados();
});

$("#Aconfig").click(function () { 
    $("#config").show('slow');
    $("#reciclaje").hide();
    $("#edit").hide();
    $("#inicio").hide();
    
});

function leerArchivo(){
    $.ajax({
        url: "/archivos",
        dataType: "json",
        success: function (archivos) {
            for(let i= 0; i < archivos.length; i++){
            $("#archivos").append(
                `<div class="col-10 col-sm-8 col-md-6 col-lg-3 col-xl-3 m-1">
                    <div class="card">
                        <div class="card-title text-center pt-1"><strong> Documento ${archivos[i].nombre_archivo.split(".")[1]}</strong></div>
                            <div class="card-img text-center">
                                <img width="100" height="100" src="/${archivos[i].icono}.svg" alt="Card image cap">  
                            </div>    
                            <div class="card-body">
                                <h5 class="card-title">ARCHIVO:</h5>
                                <a href="#"><strong>${archivos[i].nombre_archivo}</strong></a>
                                
                                <p>${new Date(archivos[i].fecha_creacion).toDateString()}</p> 
                            </div>
                            <div class="card-footer">
                               <a href="#archivos" id="eliminar" idborrar = ${archivos[i].codigo_archivo} class="btn borrarArchivo">Eliminar</a>             
                            </div>
                        </div>               
                    </div>
                </div>`            
            );
        }         

       }
    });
}

function leerReciclados(){    
    $.ajax({
        url: "/archivosReciclaje",
        dataType: "json",
        success: function (archivos) {
            for(let i = 0; i < archivos.length; i++){
                $("#archivosReciclados").append(
                    `<div class="col-10 col-sm-8 col-md-6 col-lg-3 col-xl-3 m-1">
                        <div class="card">
                            <div class="card-title text-center pt-1 ">Documento ${archivos[i].nombre_archivo.split(".")[1]}</div>
                                <div class="card-img text-center">
                                    <img width="100" height="100" src="/${archivos[i].icono}.svg" alt="Card image cap">  
                                </div>    
                                <div class="card-body">
                                    <h5 class="card-title">ARCHIVO:</h5>
                                    <a href="#"><strong>${archivos[i].nombre_archivo}</strong></a>
                                    
                                    <p>${new Date(archivos[i].fecha_creacion).toDateString()}</p> 
                                </div>
                                <div class="card-footer">
                                    <a href="#reciclaje" idborrarE = ${archivos[i].codigo_archivo} class="btn borrarE">Eliminar</a>
                                    <a href="#reciclaje" idresta=${archivos[i].codigo_archivo} class="btn resArchivo">Restaurar</a>                          
                                </div>
                            </div>               
                        </div>
                    </div>`            
                );
            }
        }
    }); 
}

function lenguaje(){//funcion para cambiar el lenguaje del editor
    editor.session.setMode("ace/mode/"+$("#slc-lenguaje").val());
}
//creamos es editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");        

//post para crear y guardar el archivo de codigo....
$("#guardar").click(function(){    
    var nombre = $("#nombreArchivo").val();
    if(!nombre == ""){
        $.ajax({
            type: "POST",
            url: "/guardar",
            data:"nombre="+nombre+"&"+"texto="+editor.getValue() ,
            dataType: "json",
            success: function (response) {
                console.log(response);
                alert("archivo guardado!");            
            }
        });
        leerArchivo();       
    }
    else{alert("el documento debe tener un nombre")}
    $("#nombreArchivo").val("");
    editor.setValue("");   
});

//enviar a la papalera de reciclaje
$(document).on("click", ".borrarArchivo" , function () {
    var ancla = $(this)[0];
    var id = $(ancla).attr("idborrar");

    var atributo={id}
    $.ajax({
        type: "POST",
        url: "/eliminarArchivo",
        data: atributo,
        dataType: "json",
        success: function (response) {
            
        }
    });
    $("#archivos").html("");
            leerArchivo();
});
//restauramos el archivo
$(document).on("click", ".resArchivo" , function () {
    var ancla = $(this)[0];
    var id = $(ancla).attr("idresta");

    var atributo={id }
    $.ajax({
        type: "POST",
        url: "/restaurarArchivo",
        data: atributo,
        dataType: "json",
        success: function (response) {            
        }
    });
    $("#archivosReciclados").html("");
    leerReciclados();
});

$(document).on("click", ".borrarE" , function () {
    var ancla = $(this)[0];
    var id = $(ancla).attr("idborrarE");

    var atributo={id}
    $.ajax({
        type: "POST",
        url: "/eliminarReciclaje",
        data: atributo,
        dataType: "json",
        success: function (response) {            
        }
    });
    $("#archivosReciclados").html("");
    console.log(leerReciclados());
    leerReciclados();
});




