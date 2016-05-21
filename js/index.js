var errorPerfil=false;
var logDisponible=false;
var pw2error=false;

if(checkLogedIn()){
	//Llamamos a la funcion setNavBar
	IndexLogueado();
}
function getTable(){
	var tabla = $("#jsBodyTable");
	var jqGet = $.get("rest/clasificacion/");
	jqGet.done(function(respuesta){
		//Petición correcta
		//Respuesta es un JSON con los resultados
		var html = "";
		var i=0;
		for(i=0;i<respuesta.FILAS.length;i++){
			html = html + "<tr><td> "+ respuesta.FILAS[i].LOGIN +" </td><td>"+ respuesta.FILAS[i].JUGADAS +"</td><td>"+ respuesta.FILAS[i].GANADAS +"</td></tr>" ;
		}
		
		tabla.append(html);
	});
	jqGet.fail(function(respuesta){
		//Error al hacer la peticion
	});
}
//Cambia el html del index si estas loggueado
function IndexLogueado(){
	var login = localStorage.getItem("login");
	var mensaje = $(".jumbotron .container").children().first().next().empty();
	$(mensaje).append("<p>Hola "+login +"!, pulsa el boton jugar para comenzar un nuevo juego.</p>");
	$(mensaje).next().children().first().html("Jugar   <i class='fa fa-play-circle'></i>");
	$("#jsRegistroButton").attr('href', "juego.html");
}
function showRegistro(){
	$("#modalRegistro").modal("toggle");
}

function postRegistro(form){
	var xhttp = new XMLHttpRequest();
	var fd = new FormData(form);
	if(!errorPerfil && logDisponible && !pw2error){
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				var nombre = $("#nombreUsuario").val();
				var pass = $("#password").val();
				
				$("#nombreusu").val(nombre);
				$("#passusu").val(pass);
				showRegistro();
				loginRequest();
			}
		};
		xhttp.open("POST", "rest/usuario/", true);
		//xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(fd);
	}

	return false;
}

function compruebaUsuarioDisponible(){
	var xhttp = new XMLHttpRequest();
	var myInput = document.getElementById('nombreUsuario');
	if(myInput.value!=''){
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				var json = JSON.parse(xhttp.responseText);
				var disponible = json.DISPONIBLE;
				if(disponible === "true"){
					$("#nombreNo").css("display","none");
					$("#nombreSi").css("display","block");
					logDisponible=true;
				}else{
					$("#nombreSi").css("display","none");
					$("#nombreNo").css("display","block");
					logDisponible=false;
				}
			}
		};
		xhttp.open("GET", "rest/login/"+myInput.value, true);
		xhttp.send();
	}else{
		$("#nombreSi").css("display","none");
		$("#nombreNo").css("display","block");
		logDisponible=false;
	}
}

function compruebaPasswords(){
	var pass1 = document.getElementById('password');
	var pass2 = document.getElementById('password2');
	if(pass1.value !== pass2.value){
		$("#passNo").css("display","block");
		pw2error=true;
	}else{
		$("#passNo").css("display","none");
		pw2error=false;
	}
}


getTable();

$("#jsRegistroButton").on("click",showRegistro);
$("#nombreUsuario").on("change",compruebaUsuarioDisponible);
$("#password2").on("change",compruebaPasswords);