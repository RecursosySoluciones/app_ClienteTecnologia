var app = angular.module("app", []);

app.controller("controlador", function($scope, $http){
    var vm = this;

    /* INICIALIZA LAS VARIABLES DEL PROYECTO */
    vm.inicializarVariables = ()  => {
        
        vm.MAXIMO_INGRESOS_BUSCADOR = 20
        vm.MINIMO_INGRESOS_BUSCADOR = 5

        vm.MSJ_NO_RESULT = "Colocar texto indicando como proceder en caso de no tener un status de busqueda."

        vm.msjError = ""

        vm.search = {
            criterio_busqueda:  "DNI",
            buscar:             "",
            status:             "no_iniciada",
            resultado:          ""
        }
        
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

                            vm.search.resultado = $aux_result.data
                            vm.search.status    = "registro_encontrado"

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
                $msj_title= 'Sin resultados',
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