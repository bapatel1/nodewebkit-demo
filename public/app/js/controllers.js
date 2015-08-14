var server = require('../server/server');
var uuid = require('node-uuid');

angular.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null
}

app.controller('cssBundleCtrl',['$scope','$css',function($scope,$css){
    // set the default bootswatch name
    $scope.css = angular.isUndefinedOrNull(localStorage['theme'])? localStorage['theme'] :'darkly';
    // create the list of bootswatches
    $scope.bootstraps = [
        { name: 'Light (cosmo)', url: 'cosmo' },
        { name: 'Dark (darkly)', url: 'darkly' },
        { name: 'Material (paper)', url: 'paper' }
    ];

    $scope.CssCollection = [
        'css/material-design-color-palette.min.css',
        'css/animate.css',
        'lib/font-awesome/css/font-awesome.min.css',
        'lib/waves/waves.css',
        'css/booleanswitch.css',
        'lib/angular-ui-switch/switch.css',
        'css/app.css'
    ];

    $scope.$watch('css',function(newval, oldval){
        console.log('new css = ' + newval);
        if(newval == null) newval = 'darkly'; // default is darkly
        localStorage['theme'] = newval;

        //remove old css collections
        $css.remove($scope.CssCollection);
        $css.remove([
            'css/bootstrap.darkly.min.css',
            'css/bootstrap.cosmo.min.css',
            'css/bootstrap.paper.min.css'
        ]);

        //prepare for new  css collections
        var newCssCollection = [];
        newCssCollection.push('css/bootstrap.' + newval + '.min.css');
        angular.forEach($scope.CssCollection,function(val){
            newCssCollection.push(val);
        });
        //add new css collections
        $css.add(newCssCollection);
    })
}]);

app.controller('indexCtrl',['$scope','windowFactory',function($scope,windowFactory){
    $scope.welcome = "eForms-nw.js";
}]);

app.controller('mainCtrl',['$scope','$state',function($scope,$state){
    $scope.today = new Date();
    $scope.format = 'M/d/yy h:mm:ss a';
    //server.usersdb.getAll();
    $scope.createNewVIN = function(){
        console.log('navigating to default page now.');
        $state.go('default',{type:'VIN',docid:uuid.v4()});
    };
}]);

app.controller('defaultCtrl',['$scope','$stateParams', '$state' ,function($scope,$stateParams,$state){
    $scope.hello = "Hello Default..!!";
    $scope.doctype = $stateParams.type;
    $scope.docid = $stateParams.docid;
    $scope.tabs = [];

    $scope.$watch('tabs', function(nVal, oVal) {
        var active = $scope.tabs.filter(function(tab) {
            return tab.active;
        })[0];

        server.vindb.saveLocalActive(active);
    },true);

    $scope.init = function() {
        var storedForms = server.vindb.loadLocalForms();
        angular.forEach(storedForms, function(form) {
            $scope.addTab(form.type, form.id, form.title, form.form);
        });
        $scope.addTab($scope.doctype, uuid.v4(), null);
    }

    $scope.addTab = function(type, id, title, form) {
        if(!title) {
            var d = new Date();
            title = '' + type + ' - ' + d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear() + ' - ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        }
        $scope.tabs.push({title:title, active:true, type:type, id:id, form:form});
    }
    $scope.removeTab = function(index) {
        //TODO: Remove form from the local db
        var formId = $scope.tabs[index].id;
        server.vindb.deleteLocalForm(formId);
        $scope.tabs.splice(index, 1);
    }

    $scope.init();
}]);

app.controller('applicationSettingsCtrl',['$scope',function($scope){
    //TODO: application settings related code.
}]);

app.controller('userSettingsCtrl',['$scope',function($scope){
    //TODO: user settings related code.
}]);
app.controller('toolbarCtrl', ['$scope', function($scope) {
    $scope.saveForm = server.vindb.saveForm;
}]);
