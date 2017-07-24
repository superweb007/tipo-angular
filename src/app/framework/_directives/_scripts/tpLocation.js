(function () {

  'use strict';

  var module = angular.module('tipo.framework');


  return module.directive('tpLocation', function () {
      return {
        scope: {
          locationAddress: "=",
          context: "=",
          fieldvalue:"="
        },
        restrict: 'EA',
        replace: true,
        templateUrl: 'framework/_directives/_views/tp-location.tpl.html',
        link: function(scope, element, attrs, ctrl){
          scope.locationAddress = scope.locationAddress || {};
          scope.fieldvalue = scope.fieldvalue || {};
          var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            neighborhood: 'long_name',
            sublocality_level_1: 'long_name',
            sublocality_level_2: 'long_name',
            locality: 'long_name',
            administrative_area_level_2: 'long_name',
            administrative_area_level_1: 'long_name',
            country: 'long_name',
            postal_code: 'short_name'
          };
          scope.loadPlaceData = function(){ 
            if (scope.fieldvalue.geometry) {
              scope.address = {};
              scope.locationAddress = {lat: scope.fieldvalue.geometry.location.lat(), lon: scope.fieldvalue.geometry.location.lng()};
              scope.context.format_address = scope.fieldvalue.formatted_address;
              scope.context.place_name = scope.fieldvalue.name;
              _.each(scope.fieldvalue.address_components,function(component){
                var addressType = component.types[0]
                if (componentForm[addressType]) {
                  var val = component[componentForm[addressType]];
                  scope.address[addressType] = val;
                };
              });
              scope.context.street_address = _.trim((scope.address.street_number || "") + " " + (scope.address.route || "") + " " +  (scope.address.neighborhood || "") + " " + (scope.address.sublocality_level_1 || "") + " " + (scope.address.sublocality_level_2 || ""));
              scope.context.suburb = scope.address.locality;
              scope.context.province_region_district = scope.address.administrative_area_level_2;
              scope.context.state_ = scope.address.administrative_area_level_1;
              scope.context.country = scope.address.country;
              scope.context.postalcode = _.toNumber(scope.address.postal_code);
            };
          }
        }
      };
    }
  );

})();