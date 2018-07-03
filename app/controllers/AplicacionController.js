'use strict';

(function () {
	var controlador = angular.module('app-controller',[]);

	//Contolador que se encarga de generar datos por defectos, para llenar el localStorage.
	controlador.controller("defaultController", function ($scope, $localStorage) {
		$scope.datosPredeterminados = function(){
			$localStorage.clientes = [
			{
				'nombre_completo': "Felipe Vogt",
				'email': "felipevogt.f@gmail.com",
				'telefono': "97798654"
			},
			{
				'nombre_completo': "Javiera Jara",
				'email': "javierajara@gmail.com",
				'telefono': "984059140"
			},
			{
				'nombre_completo': "Leslie Fetis",
				'email': "lesliefetis@gmail.com",
				'telefono': "982887761"
			},
			{
				'nombre_completo': "Homero Simpson",
				'email': "homerosimpson@fox.com",
				'telefono': "123123123"
			},
			{
				'nombre_completo': "Arima Kousei",
				'email': "shigatsunowakiminouso@anime.net",
				'telefono': "123456789"
			},
			{
				'nombre_completo': "Bob Marley",
				'email': "bobmarley@gmail.com",
				'telefono': "494949494"
			},
			{
				'nombre_completo': "Harrison Ford",
				'email': "harrison4@hansolo.star",
				'telefono': "444444444"
			}
			];
			

			$localStorage.cuotas = [
			{
				'id': 1,
				'n_cuotas': 1,
				'interes': 0
			},{
				'id': 2,
				'n_cuotas': 3,
				'interes': 6
			},{
				'id': 3,
				'n_cuotas': 6,
				'interes': 15
			},{
				'id': 4,
				'n_cuotas': 9,
				'interes': 25
			}
			];

			$scope.capital.capital_actual = 15000000; 
			$localStorage.deudas = [];

		}
	});

	//Verificador de rutas
	controlador.controller('rutaController', function($scope, $location) {
		$scope.isActive = function(route) {
			return route === $location.path();
		}
	});

	//Controlador del capital
	controlador.controller("capitalController", function ($scope, $localStorage) {
		if ($localStorage.capital){
			$scope.capital = $localStorage.capital;
		}else{
			$localStorage.capital = {'capital_actual' : 0};
			$scope.capital = $localStorage.capital;
		}

	});

	//Controlador de cuotas
	controlador.controller("prestamoController", function ($scope, $localStorage) {
		$scope.clientes = $localStorage.clientes;
		$scope.cuotas = $localStorage.cuotas;
		$scope.deudas = $localStorage.deudas;

		$scope.agregarPrestamo = function(cliente, monto, cuota){

			//Se valida que el monto sea mayor a 0 y que no supere el capitar disponible
			if (monto <= $scope.capital.capital_actual && monto > 0) {
				$scope.success = true;
				$scope.alerta = "Prestamo ingresado correctamente";
			}else{
				$scope.success = false;
				$scope.alerta = "Monto solicitado excede el capital actual";
			}

			//En caso de que la validacion sea efectiva
			if ($scope.success) {

				//La variable totalMensual corresponde a la cuota mensual que se debera pagar, se utilizo la formula de interes simple para calcular este monto.
				var totalMensual = (monto/$scope.cuotas[cuota-1].n_cuotas) + (monto*($scope.cuotas[cuota-1].interes/100));
				//Arreglo de cuotas
				var mensual = [];
				//Se agregan las diferentes cuotas al arreglo mensual[]
				for (var i = 0; i < $scope.cuotas[cuota-1].n_cuotas; i++) {
					mensual.push({
						'valor' : parseInt(totalMensual),
						'pagado' : false
					});
				}
				//Se agregan las deudas a un arreglo
				$scope.deudas.push({
					'cliente' : $scope.clientes[cliente],
					'cuota_id' : cuota,
					'cuotas' : mensual,
					'prestamo' : monto,
					'total' : parseInt(monto + monto*($scope.cuotas[cuota-1].interes/100))
				});

				//Se suben los datos al localStorage
				$localStorage.deudas = $scope.deudas;
				$scope.capital.capital_actual -= monto;

			}
			
		}
	});
	//Controlador de clientes, operaciones CRUD.
	controlador.controller("clienteController", function($scope, $localStorage) {

		$scope.clientes = $localStorage.clientes || [];

		//Funcion para agregar clientes
		$scope.agregar = function(nombre, email, telefono) {
			$scope.clientes.push({
				'nombre_completo': nombre,
				'email': email,
				'telefono': telefono
			});
			$localStorage.clientes = $scope.clientes;
			$scope.nombre = ""
			$scope.email = ""
			$scope.telefono = ""
		}

		//Funcion para eliminar clientes.
		$scope.eliminar = function(index){
			$scope.clientes.splice(index, 1);
		}

		//Funcion para cargar clientes.
		$scope.cargarCliente = function(index){
			$scope.cliente = $scope.clientes[index];
			$scope.nombreMod = $scope.clientes[index].nombre_completo;
			$scope.emailMod = $scope.clientes[index].email;
			$scope.telefonoMod = $scope.clientes[index].telefono;
			$scope.clienteIndex = index;
		}

		//Funcion para actualizar clientes.
		$scope.actualizar = function(clienteIndex, nombre, email, telefono) {
			$scope.clientes[clienteIndex] = {
				'nombre_completo' : nombre,
				'email' : email,
				'telefono' : telefono
			};
		}
	});

	//Controlador de las deudas
	controlador.controller("deudaController", function ($scope, $localStorage) {
		$scope.deudas = $localStorage.deudas || [];

		//Se valida si existen deudas o no.
		if ($scope.deudas.length > 0){
			$scope.deudasExist = true;
		} else {
			$scope.deudasExist = false;
		}

		//Funcion para pagar una cuota, le suma al capital.
		$scope.pagar = function (indiceDeuda, indiceCuota){
			$scope.deudas[indiceDeuda].cuotas[indiceCuota].pagado = true;
			$scope.capital.capital_actual += $scope.deudas[indiceDeuda].cuotas[indiceCuota].valor;
		};
	});



})();