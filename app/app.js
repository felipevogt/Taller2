'use strict';

(function(){

	//Se agregan las dependencias a la app
	var app= angular.module('app',['app-controller','ngRoute', 'ngStorage']);

	//Enrutamiento a las diferentes vistas
	app.config(function($routeProvider) {
		$routeProvider
		.when("/", {
			templateUrl  : "app/views/inicio.html",
			controller : "defaultController"
		})
		.when("/clientes", {
			templateUrl  : "app/views/clientes.html",
			controller : "clienteController"
		})
		.when("/prestamos", {
			templateUrl  : "app/views/prestamos.html",
			controller : "prestamoController"
		})
		.when("/deudas", {
			templateUrl  : "app/views/deudas.html",
			controller : "deudaController"
		})
		.otherwise({
			redirectTo: "/"
		});

	});


})();