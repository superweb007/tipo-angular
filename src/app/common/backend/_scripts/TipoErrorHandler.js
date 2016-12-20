(function() {

  'use strict';

  function translateToUiException(backendException){
    var exception = {};
    exception.headerCode = backendException.status;
    exception.headerMessage = backendException.statusText;
    
    if(backendException.data.status_code){
      exception.detailCode = backendException.data.status_code;
    }else{
      exception.detailCode = exception.headerCode;
    }

    if(backendException.data.message){
      exception.detailMessage = backendException.data.message;
    }else{
      exception.detailMessage = backendException.data.errorMessage;
    }

    if(backendException.data.stack_trace){
      exception.detailStackTrace = backendException.data.stack_trace;
    }else{
      if(_.isArray(backendException.data.stackTrace)){
        var stackTrace = '';
        _.each(backendException.data.stackTrace, function(line){
          stackTrace += line + '\n';
        });
        exception.detailStackTrace = stackTrace;
      }
    }
    return exception;
  }

  function ErrorController(
    exception,
    $mdDialog) {

    var _instance = this;

    _instance.exception = translateToUiException(exception);

    _instance.maximize = function(){
      _instance.fullscreen = true;
    };

    _instance.restore = function(){
      _instance.fullscreen = false;
    };

    _instance.finish = function() {
      $mdDialog.hide();
    };

    _instance.cancel = function() {
      $mdDialog.cancel();
    };
  }

  function TipoErrorHandler(
    tipoRouter,
    $mdDialog) {

    var _instance = this;

    this.handleError = function(exception, deferred) {
      tipoRouter.startStateChange();
      var promise = $mdDialog.show({
        templateUrl: 'common/backend/_views/error.tpl.html',
        controller: ErrorController,
        controllerAs: 'controller',
        locals:{
          exception: exception
        },
        skipHide: true,
        clickOutsideToClose: true,
        fullscreen: true
      });
      return false;
    };

  }

  angular.module('tipo.common')
    .service('tipoErrorHandler', TipoErrorHandler);

})();