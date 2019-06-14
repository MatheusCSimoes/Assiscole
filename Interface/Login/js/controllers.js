angular.module('starter.controllers',[])

.controller('AppCtrl', function($scope) {
	
})

.controller('LoginCtrl', function($scope,$state,AjaxService,LoginService,$timeout) {
	$scope.carregando = false;
	$scope.formLogin = {
		User:"",
		Pass:"",
	}

	$timeout(function() {
		for (var i = 0; i < $('.login-form').find('input').length; i++) {
			if($('.login-form').find('input')[i].value != ""){
				$($('.login-form').find('label')[i]).addClass("active");
				$($('.login-form').find('i')[i]).addClass("active");
				$($('.login-form').find('input')[i]).addClass("valid");
			}
		}

		$(".login-form").validate({
			errorElement : 'div',
			errorPlacement: function(error, element) {
				var placement = $(element).data('error');
				if (placement) {
					$(placement).append(error)
				} else {
					error.insertAfter(element);
				}
			}
		});

		$(".login-form").submit(function(e){
			e.preventDefault();
		})  

	}, 1000);

	$scope.login = function() {		
		if(!$(".login-form").valid())
			console.log('invalid');
		else{
			$scope.carregando = true;
			LoginService.loginUser($scope.formLogin,AjaxService.miAjax).then(function(data1){
				if(typeof data1 == 'number' && data1 == 0){
					$scope.toast('Usuario errado');
					$scope.carregando = false;
				}
				else{
					LoginService.loginPass($scope.formLogin,AjaxService.miAjax).then(function(data2){
						if(typeof data2 == 'number' && data2 == 0){
							$scope.toast('Senha errada');
							$scope.carregando = false;
						}
						else if(data2[0].Ativo == 0){
							$scope.toast('Usuario inativo', 4000);
							$scope.carregando = false;
						}
						else{
							sessionStorage.setItem('DatosPrincipales', JSON.stringify(data2));										
							window.location.href = "../App";
						}
					}, function(a){
						$scope.toast(a);
						$scope.carregando = false;
					});	
				}
			}, function(a){
				$scope.toast(a);
				$scope.carregando = false;
			});	
		}
	}

	$('input').on('keydown', function(e) {
	    if (e.which == 13) {
	        $scope.login();
	    }
	});

	$scope.toast = function(string){
		Materialize.toast(string, 4000);	
		$timeout(function() {
			$scope.carregando = false;
		}, 1000);
	}
})