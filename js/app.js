var app = angular.module("app", []);

app.controller("controlador", function($scope, $http){
    var vm = this;

    /* INICIALIZA LAS VARIABLES DEL PROYECTO */
    vm.inicializarVariables = ()  => {

        /* VARIABLES ESTATICAS
           ------------------- */
        vm.MAXIMO_INGRESOS_BUSCADOR = 20
        vm.MINIMO_INGRESOS_BUSCADOR = 5
        vm.MSJ_NO_RESULT = "Recordá que podes buscarlo con el DNI o con el TELEFONO."
        
        vm.search_placeholder = "Ingresá el nro de DNI" // PLACE HOLDER DEL CAMPO INPUT, VARIA EL TEXTO SEGUN EL FILTRO SELECCIONADO DNI/LINEA
        vm.msjError = "" // SIRVE PARA MANEJAR LOS MSJ DE ERROR CON SWEET ALERT

        // GUARDA TODA LA INFO DE LA BUSQUEDA REALIZADA
        vm.search = {
            criterio_busqueda:  "DNI",
            buscar:             "",
            status:             "no_iniciada",
            titulo_resultado:    "",
            resultado:          ""  
        }

        vm.visible_screen       = "Initial" // INDICA QUE PANTALLA SE ENCUENTRA VISIBLE "INITIAL" (PANTALLA INICIAL DE LA APP) O "HOME" (PANTALLA QUE MUESTRA LOS RESULTADOS DE BUSQUEDA)
        vm.class_search         = "search-initial_container" // ESTILO QUE UTILIZARA EL CAMPO DE BUSQUEDA
        vm.class_home_container = "home-ftth_container-color" // FONDO DE LA PANTALLA HOME.PAGE CAMBIA EL COLOR SEGUN LA TECNOLOGIA CONSULTADA FTTH/ HFC
        vm.last_update_db       = "" // SE GUARDA LA INFO DE CUANDO FUE LA ULTIMA VEZ QUE SE ACTUALIZO LA BASE

        vm.get_last_update_db()
        
    }

    // EN CASO DE ESTAR EN EL INPUT DEL FORMULARIO DE BUSQUEDA Y PRESIONAR ENTER SE EJECUTA LA FUNCION
    vm.press_enter = (keyEvent) => {

        if (keyEvent.which === 13) {
            vm.get_cliente_tecnologia()
        }
    }

    // SETEA EL TEXTO DEL PLACE HOLDER DEL CAMPO DE BUSQUEDA
    vm.set_search_placeholder = () => {

        vm.search_placeholder = vm.search.criterio_busqueda == 'DNI' ? "Ingresá el nro de DNI" : "Ingresá el nro de Línea"

    }

    // OBTIENE LA FECHA DE LA ULTIMA ACTUALIZACION DE LA BDD
    vm.get_last_update_db = () => {
        $http.get('../dataProcess/db/json/db.json')
        .then(function (response) {
            let $aux_date = response.data['CLIENTE_TECNOLOGIA']['LAST_UPDATE_HUMAN']
            vm.last_update_db = $aux_date.substr(0,10)
        })
    }

    /* LEE EL JSON DE MENSAJES RECIBIDOS Y LO GUARDA EN UN ARRAY*/
    vm.get_cliente_tecnologia = ($status) => {

        if(vm.search.buscar != "" && vm.search.buscar != null) {

            let $req = `../dataProcess/webservice/request/request_cliente_tecnologia.php`

            $http.get($req, {
                params: {
                    CRITERIO_BUSQUEDA:  vm.search.criterio_busqueda,
                    BUSCAR:             vm.search.buscar
                },
                headers: {}
            })
            .then(function (response) {
                
                let $aux_result = response.data

                switch ($aux_result.status) {
                    case 'SUCESS':

                        if($aux_result.data == 'SIN_RESULTADOS'){

                            vm.search.status    = "sin_resultado"
                            vm.msjError         = "sin_resultado"
                            vm.mostrar_msjError()

                        } else {

                            vm.search.resultado         = $aux_result.data
                            vm.search.titulo_resultado  = vm.search.criterio_busqueda + " " + vm.search.buscar
                            vm.visible_screen           = 'Home'
                            vm.class_search             = 'search-home_container'
                            vm.class_home_container     = vm.search.resultado.CLASE_SERVICIO == 'Ont Ftth'? "home-ftth_container-color" : "home-hfc_container-color"
                            vm.search.status            = "registro_encontrado"

                        }
                        break;

                    case 'ERROR':
                        
                        vm.search.resultado = $aux_result.data
                        vm.search.status    = "error"
                        vm.msjError         = "error"
                        vm.mostrar_msjError()
                        break;
                
                    default:
                        break;
                }

                
                
            }, function (x) {
                // Request error
            });   
        } else {
            vm.search.status = "campo_vacio"
            vm.msjError = "campo_vacio"
            vm.mostrar_msjError()
        }
        
        
    }

    /* MOSTRAR MSJ DE SWEET ALERT 2 */
    vm.mostrar_msjError = () => {


        switch (vm.msjError) {

            case "sin_resultado":
                $msj_icon = 'info'
                $msj_title= 'No encontramos el cliente',
                $msj_text = vm.MSJ_NO_RESULT
                break;
            
            case "error":
                $msj_icon = 'error'
                $msj_title= 'Error',
                $msj_text = vm.search.resultado
                break;
            
            case "campo_vacio":
                $msj_icon = 'warning'
                $msj_title= 'Oops...',
                $msj_text = "Por favor complete el campo de busqueda."
                break;
        }

        if (vm.msjError == "sin_resultado" || vm.msjError == "error") {

            if (vm.msjError == "help") {
                $aux_allowOutsideClick = false;
            }
            else{
                $aux_allowOutsideClick = true;
            }

            Swal.fire({
                icon: $msj_icon,
                title:$msj_title,
                text: $msj_text,
                showCloseButton: true,
                allowOutsideClick: $aux_allowOutsideClick,
                /* footer: '<a href>Why do I have this issue?</a>' */
            })
        }
        else{
            let timerInterval
            Swal.fire({
                icon: $msj_icon,
                /* title: 'Faltan datos...', */
                html: $msj_text,
                timer: 3000,
                timerProgressBar: true,
                /* allowOutsideClick: false, */
                showCloseButton: true,
                didOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                        const b = content.querySelector('b')
                        if (b) {
                        b.textContent = Swal.getTimerLeft()
                        }
                    }


                    }, 100)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                /* console.log('I was closed by the timer') */
            }
            })
        }
        

        
    }


    vm.inicializarVariables()
})