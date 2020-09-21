var myModule = angular.module('app', ['ngMaterial', 'ngSanitize'])
myModule.controller('DemoCtrl', function($sce) {
    var vm = this;
    vm.title = 'Test Title';
  vm.editorOptions = '';
  vm.concontent4=""
    vm.trusted = $sce.trustAsHtml(vm.content);

  })
  
  .directive('ckEditor', function () {
  return {
    require: '?ngModel',
    link: function (scope, elm, attr, ngModel) {
      var ck = CKEDITOR.replace(elm[0]);
      
      if (!ngModel) return;
      ck.on('instanceReady', function () {
        ck.setData(ngModel.$viewValue);
      });
      function updateModel() {
        scope.$apply(function () {
          ngModel.$setViewValue(ck.getData());
        });
      }
      ck.on('change', updateModel);
      ck.on('key', updateModel);
      ck.on('dataReady', updateModel);

      ngModel.$render = function (value) {
        ck.setData(ngModel.$viewValue);
      };
    }
  };

});


