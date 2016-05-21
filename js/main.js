
if(checkLogedIn()){
	//Llamamos a la funcion setNavBar
	NavBarLogueado();
}else{
	NavBarSinLogueado();
}
function returnToIndexIfNotLogged(){
	var logueado = checkLogedIn();
	if(!logueado){
		window.location = "index.html";
	}
}
function checkLogedIn(){
	var ret = false;

	if(window.localStorage){
		if(localStorage.getItem("login")){
			//Logueado
			ret = true;
		}else{
			//No logueado
			ret = false;
		}
	}

	return ret;
}
function redirectToIndex(){
	window.location = "index.html";
}
//Funcion para coger el nombre de usuario LOCAL
function getLocalUserName(){
	if(checkLogedIn()){
		return localStorage.getItem("login");
	}
}
function loginRequest(){
	var xhttp = new XMLHttpRequest();
	var nombre = document.getElementById("nombreusu").value;
	var pass = document.getElementById("passusu").value;
	var args = "login=" + nombre + "&pwd=" + pass;
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var json = JSON.parse(xhttp.responseText);
			console.log(json);
			if(window.localStorage){
				localStorage.setItem("clave",json.CLAVE);
				localStorage.setItem("login",json.LOGIN);
				localStorage.setItem("nombre",json.NOMBRE);
				localStorage.setItem("ultimo_acceso",json.ULTIMO_ACCESO);
				localStorage.setItem("email",json.EMAIL);
				//Cambiamos la página para usuario logueado
				NavBarLogueado();
				$('#myModal').modal('toggle');
				setTimeout(function(){
					$('#myModal').modal('toggle');
					location.reload();
				}, 1200);
				
			}
		}else if(xhttp.readyState == 4 && xhttp.status == 401){
			//Login incorrecto
			ErrorLoginIncorrecto();

		}
	};
	xhttp.open("POST", "rest/login/", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(args);

	return false;
}
function logout(){
	if(window.localStorage){
		if(localStorage.getItem("clave")){
			localStorage.removeItem("clave");
		}
		if(localStorage.getItem("login")){
			localStorage.removeItem("login");
		}
		if(localStorage.getItem("nombre")){
			localStorage.removeItem("nombre");
		}
		if(localStorage.getItem("ultimo_acceso")){
			localStorage.removeItem("ultimo_acceso");
		}
		if(localStorage.getItem("email")){
			localStorage.removeItem("email");
		}
		redirectToIndex();
	}
}
//Función que muestra un mensaje de error cuando falla el login
//Se incluirá delante del elemento pass
function ErrorLoginIncorrecto(){
	$("#err-ini").empty();
	$("#err-ini").append("<div class='error-index'>Error al iniciar sesión.</div>");
}
//Función que cambia la barra de login al aspecto de usuario logueado
function NavBarLogueado(){
	var login = localStorage.getItem("login");
	var form = $("#navbar").children().first();
	$(form).empty();
	$(form).append("<div class='form-group' style='color:white; margin-right:10px;'>Hola "+login+"!</div><button type='button' onClick='logout()' class='btn btn-danger'>Cerrar sesión</button>");
	
}

//Funcion para cargar el menu de login
function NavBarSinLogueado(){
	var string = "<div id='err-ini' class='form-group'></div><div class='form-group padding-right'><input type='text' id='nombreusu' placeholder='Email' class='form-control'></div><div class='form-group padding-right'><input type='password' id='passusu' placeholder='Contraseña' class='form-control'></div><button type='submit' class='btn btn-success'>Iniciar Sesión</button>";
	var form = $("#navbar").children().first().append(string);
}

