returnToIndexIfNotLogged();

var Bloque = class Bloque{
	constructor(posx,posy){
		this.x = posx;
		this.y = posy;
		this.ocupada = 0;
	}
	getOcupada(){
		return this.ocupada;
	}
	dibujarBloque(){
		// Se pone color blanco y dibuja un rectangulo
		ctx.fillStyle = "white";
		ctx.fillRect(this.x * BLOCK_SIZE + BLOCK_SIZE, this.y * BLOCK_SIZE + BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	    //Dibuja el contorno del rectangulo
	    ctx.beginPath();
	    ctx.lineWidth="1";
	    ctx.strokeStyle="#959595";
	    ctx.rect(this.x * BLOCK_SIZE +BLOCK_SIZE, this.y * BLOCK_SIZE +BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	    ctx.stroke();
	}
	mouseOver(){
		ctx.beginPath();
	    ctx.lineWidth="2";
	    ctx.strokeStyle="#256EDC";
	    ctx.rect(this.x * BLOCK_SIZE +BLOCK_SIZE, this.y * BLOCK_SIZE +BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	    ctx.stroke();
	    console.log("mouseOver");
	}
	shipOver(size){
		if(this.x + size <= 10){
			if(tablero[this.x + size][this.y] != undefined){
				var valido = true;
				//Estoy dentro del tablero
				for(var i=0;i<size;i++){
					if(tablero[this.x + i][this.y].ocupado){
						valido = false;
						break;
					}
				}
				if(valido){
					//Se pintan de color verde las casillas

				}else{
					//Se pintan de color rojo

				}
			}
		}
	}
}
//////////////////////////////////////
var Texto = class Texto{
	constructor(posx,posy,texto,size){
		this.x = posx;
		this.y = posy;
		this.render = true;
		this.texto = texto;
		this.size = size;
	}
	setDibujar(dibujar){
		this.render = dibujar;
	}
	dibujar(){
		ctx.font = this.size + "px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "black";
		ctx.fillText(this.texto,this.x, this.y);
	}
}
/////////////////////////////////////
var Barco = class Barco{
	constructor(size){
		this.x = 0;
		this.y = 0;
		this.size = size;

		var canvas = document.createElement('canvas');
		canvas.width = size*BLOCK_SIZE;
		canvas.height = BLOCK_SIZE;
		canvas.setAttribute('draggable', true);
		canvas.ondragstart = function(){
			barcoMarcado = this;
			for(var i = 0;i<barcosPlayer.length;i++){
				$(barcosPlayer[i].canvas).removeClass();
			}
			canvas.classList.toggle('bordeAzul');
		};
		canvas.onclick = function(){
			barcoMarcado = this;
			for(var i = 0;i<barcosPlayer.length;i++){
				$(barcosPlayer[i].canvas).removeClass();
			}
			canvas.classList.toggle('bordeAzul');
		};
		canvas.setAttribute('style',"margin-right:20px")
		this.canvas = canvas;
		switch(size){
			case 1:
				$("#barcos1").append(this.canvas);
			break;
			case 2:
				$("#barcos2").append(this.canvas);
			break;
			case 3:
				$("#barcos3").append(this.canvas);
			break;
			case 4:
				$("#barcos4").append(this.canvas);
			break;
		}
		
		this.ctx = this.canvas.getContext('2d');
	}
	setBloque(posx,posy){
		this.x = posx;
		this.y = posy;
	}
	dibujarBarco(){
		// Se pone color blanco y dibuja un rectangulo
		ctx.fillStyle = "rgba(255,138,0,0.5)";
		ctx.fillRect(this.x * BLOCK_SIZE + BLOCK_SIZE, this.y * BLOCK_SIZE + BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	    //Dibuja el contorno del rectangulo
	    ctx.beginPath();
	    ctx.lineWidth="1";
	    ctx.strokeStyle="#FF8A00";
	    ctx.rect(this.x * BLOCK_SIZE +BLOCK_SIZE, this.y * BLOCK_SIZE +BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
	    ctx.stroke();
	}
	dibujarBarcoFuera(){
		// Se pone color blanco y dibuja un rectangulo
		this.ctx.fillStyle = "rgba(255,138,0,0.5)";
		this.ctx.fillRect(this.x, this.y, BLOCK_SIZE * this.size, BLOCK_SIZE);
	    //Dibuja el contorno del rectangulo
	    this.ctx.beginPath();
	    this.ctx.lineWidth="1";
	    this.ctx.strokeStyle="#FF8A00";
	    this.ctx.rect(this.x, this.y, BLOCK_SIZE * this.size, BLOCK_SIZE);
	    this.ctx.stroke();
	}

}
//Variables globales del juego
var tableroEnemigo = new Array(10);
var tablero = new Array(10);
var barcosPlayer = new Array(10);
var textos = new Array();

var barcoMarcado;

for(var k=0;k<10;k++){
	tablero[k] = new Array(10);
	tableroEnemigo[k] = new Array(10);
}

for(var k = 0;k<10;k++){
	for(var l=0;l<10;l++){
		tablero[k][l] = new Bloque(k,l);
		tableroEnemigo[k][l] = new Bloque(k,l);
	}
}

function dibujar(){
	canvas = document.getElementById('tablero');
	//Si soporta canvas
	if(canvas.getContext)
	{
		ctx = canvas.getContext('2d');
        // Tamaño del tablero
        BLOCK_SIZE = 40;
        NUM_ROWS = 10;
        NUM_COL = 10;
        //Dibuja los bordes del tablero
        dibujarTablero();
        dibujarBordes();

        crearBarcos();
        //DibujarBarcos
        dibujarBarcos();

        crearTextos();
        dibujarTextos();
    }
}
//Funcion que dibuja el tablero
function dibujarTablero(){
	for(var fila = 0; fila < NUM_ROWS; fila++){
		dibujarFila(fila);
	} 

}
function dibujarBordes(){
	var array = ["A","B","C","D","E","F","G","H","I","J"];
	for(var i = 0; i < NUM_ROWS; i++){
		//Dibujamos las casillas en x
		//dibujarBloque(0,i+1);
		//Dibujamos las cassillas en y
		//dibujarBloque(i+1,0);

		dibujarCaracterEnBloque(0,i+1,i+1,"black");
		dibujarCaracterEnBloque(i+1,0,array[i],"black");
		
	}
}
//Función que dibuja una fila del tablero
function dibujarFila(fila){
	for(var columna = 0; columna < NUM_COL; columna++){
		tablero[fila][columna].dibujarBloque();
	}
}
//Funcion que dibuja un caracter en un bloque
function dibujarCaracterEnBloque(fila,columna,caracter,color){
	ctx.font = "20px Arial";
	ctx.textAlign = "center";
	ctx.fillStyle = "black";
	ctx.fillText(caracter,columna * BLOCK_SIZE + 20, fila * BLOCK_SIZE + 28);
	
}
//Función que dibuja un bloque según fila y columna que recibe
function dibujarBloque(fila,columna){
	// Se pone color blanco y dibuja un rectangulo
	ctx.fillStyle = "white";
	ctx.fillRect(fila * BLOCK_SIZE, columna * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    //Dibuja el contorno del rectangulo
    ctx.beginPath();
    ctx.lineWidth="1";
    ctx.strokeStyle="#959595";
    ctx.rect(fila * BLOCK_SIZE, columna * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.stroke();
}

function crearTextos(){
	//textos.push(new Texto(140,475,"Arrastra tus barcos a la cuadrícula",15));
}
function crearBarcos(){
	//1 Barco de 4
	barcosPlayer[0] = new Barco(4);
	//2 Barcos de 3
	barcosPlayer[1] = new Barco(3);
	barcosPlayer[2] = new Barco(3);
	//3 Barcos de 2
	barcosPlayer[3] = new Barco(2);
	barcosPlayer[4] = new Barco(2);
	barcosPlayer[5] = new Barco(2);
	//4 Barcos de 1
	barcosPlayer[6] = new Barco(1);
	barcosPlayer[7] = new Barco(1);
	barcosPlayer[8] = new Barco(1);
	barcosPlayer[9] = new Barco(1);
}

function dibujarTextos(){
	for(var i = 0;i < textos.length;i++){
		textos[i].dibujar();
	}
}
function dibujarBarcos(){
	for(var i = 0; i < barcosPlayer.length;i++){
		barcosPlayer[i].dibujarBarcoFuera();
	}

}


function dropShip(event){
	//event.preventDefault();
	//alert("Drop!");
}
function dragOverFunc(event){
	event.preventDefault();
    return false;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function mouseOver(evt){
	var mousePos = getMousePos(canvas, evt);
	//console.log(mousePos.x + ", "+mousePos.y);
    var casX = Math.floor(mousePos.x / BLOCK_SIZE);
    var casY = Math.floor(mousePos.y / BLOCK_SIZE);
    if(casX>=1 && casX<=10 && casY>=1 && casY<=10){
    	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	//Limpiamos canvas barcos
		for(var i = 0;i<barcosPlayer.length;i++){
			barcosPlayer[i].ctx.clearRect(0,0,barcosPlayer[i].canvas.width,barcosPlayer[i].canvas.height);
		}
    	renderAll();
    	tablero[casX-1][casY-1].mouseOver();
    }else{
    	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	//Limpiamos canvas barcos
		for(var i = 0;i<barcosPlayer.length;i++){
			barcosPlayer[i].ctx.clearRect(0,0,barcosPlayer[i].canvas.width,barcosPlayer[i].canvas.height);
		}
    	renderAll();
    }
}

//Se llama cuando sacas el raton
function mouseOut(){
	//Limpiamos canvas tablero
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//Limpiamos canvas barcos
	for(var i = 0;i<barcosPlayer.length;i++){
		barcosPlayer[i].ctx.clearRect(0,0,barcosPlayer[i].canvas.width,barcosPlayer[i].canvas.height);
	}
    renderAll();
}

//Se llama cuando arrastras algo por encima
function dragOver(evt){
	var mousePos = getMousePos(canvas, evt);
    var casX = Math.floor(mousePos.x / BLOCK_SIZE);
    var casY = Math.floor(mousePos.y / BLOCK_SIZE);
	if(casX>=1 && casX<=10 && casY>=1 && casY<=10){
		tablero[casX-1][casY-1].shipOver(barcoMarcado.size);
	}else{

	}


}

$( document ).ready(function() {
	dibujar();
	canvas.addEventListener('mousemove', mouseOver, false);
	canvas.addEventListener('mouseout', mouseOut, false);
	canvas.addEventListener('ondragover', dragOver,,false);
});
function renderAll(){
	dibujarTablero();
	dibujarBordes();
	dibujarBarcos();
	dibujarTextos();
}