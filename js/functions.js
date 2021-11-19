/* Open the sidenav */
function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
  }
  
  /* Close/hide the sidenav */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

/* VALIDADOR DE INGRESO DE NROS */
function validar(e) {
    tecla = (document.all) ? e.keyCode : e.which;

    /* console.log("tecla presionada: " + e); */
    if (tecla==8) return true; //Tecla de retroceso (para poder borrar)
    if (tecla==48) return true;
    if (tecla==49) return true;
    if (tecla==50) return true;
    if (tecla==51) return true;
    if (tecla==52) return true;
    if (tecla==53) return true;
    if (tecla==54) return true;
    if (tecla==55) return true;
    if (tecla==56) return true;
    if (tecla==57) return true;
    patron = /1/; 
    te = String.fromCharCode(tecla);
    return patron.test(te);

}


/* EL RESTO DE LAS FUNCIONES NO SE UTILIZAN ACTUALMENTE */

/*COOKIES MANIPULATION*/
function setCookie(cname, cvalue, exHours) {
    var d = new Date();
    d.setTime(d.getTime() + (exHours*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*COOKIES MANIPULATION*/

function normalizarNumero(precio){
    if (typeof(precio) == 'string') {
        precio = precio.replace("$","");
        precio = precio.replace(".","");
        if (precio.replace(",","") != precio) {
            return  parseFloat(precio.replace(",","."));
        }else{
            return  parseInt(precio);
        }
    }else{
        return precio;
    }
}

function redondearDecimales(nro,cantDecimales){
    var exp = Math.pow(100,cantDecimales);
    return Math.round(nro*exp)/exp;
}

function fadeElement(element,delaySeconds){    
    element.style.transition="opacity 0.5s ease-in-out";
    element.style.display = "initial";
    element.style.opacity = 1;
    setTimeout(next,delaySeconds);
    function next(){
        element.style.opacity = 0;            
    }
}

function limitarCaracteres(){
	
	//Almacenamos los valores
	contratoLinea=$('#contratoLinea').val();
	
   //Comprobamos la longitud de caracteres
	if (contratoLinea.length<10){
		return true;
	}
	else {
		alert('Maximo 10 caracteres');
		return false;
		
	}

}

