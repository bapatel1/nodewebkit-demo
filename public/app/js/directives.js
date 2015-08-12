angular.module('application.directives',[])
.directive('newCard',function(){
    return{
        transclude:true,
        scope:{
            cardcolor:'@',
            cardtitle:'@',
            cardcontent:'@',
            cardaction:'@',
            // cardactionclick:'&'
        },
        restrict:'E',
        templateUrl:'app/directive_tmpl/general/newcard.tmpl.html'
    }
})
.directive('wellCard',function(){
    return{
        transclude:true,
        scope:{
            label:'@',
            labelclass:'@',
            iconclass:'@',
            // isIncludelabel:'@',
            wellheader:'@',
            wellcontent:'@'
        },
        restrict:'E',
        templateUrl:'app/directive_tmpl/general/smallwell.tmpl.html'
    }
})
.directive('uppercased', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(input) {
                return input ? input.toUpperCase() : "";
            });
            element.css("text-transform","uppercase");
        }
    }
})
.directive('textboxWithLabel', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label:'@',
            id:'@',
            placeholder:'@',
            ngMinlength:'=',
            ngMaxlength:'=',
            required:'@',
            ngModel:'='
        },
        templateUrl:'app/directive_tmpl/form_controls/textboxwithlabel.tmpl.html',
        link: function(scope, element, attrs) {
            if(attrs.required == '') {
                attrs.required = true;
            } else {
                attrs.required = false;
            }
        }
    }
})
.directive('dropdownWithLabel',function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label:'@',
            id:'@',
            items:'=',
            ngModel:'=',
            required:'@'
        },
        templateUrl: 'app/directive_tmpl/form_controls/dropdownwithlabel.tmpl.html'
    }
})
.directive('switchWithLabel', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label:'@',
            id:'@',
            on:'@',
            off:'@',
            required:'@',
            ngModel:'='
        },
        templateUrl: 'app/directive_tmpl/form_controls/switchwithlabel.tmpl.html'
    }
})
.directive('sortableTab', function($timeout, $document) {
    return {
        link: function(scope, element, attrs, controller) {
            // Attempt to integrate with ngRepeat
            // https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211
            var match = attrs.ngRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            var tabs;
            scope.$watch(match[2], function(newTabs) {
                tabs = newTabs;
            });

            var index = scope.$index;
            scope.$watch('$index', function(newIndex) {
                index = newIndex;
            });

            attrs.$set('draggable', true);

            // Wrapped in $apply so Angular reacts to changes
            var wrappedListeners = {
                // On item being dragged
                dragstart: function(e) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.dropEffect = 'move';
                    e.dataTransfer.setData('application/json', index);
                    element.addClass('dragging');
                },
                dragend: function(e) {
                    //e.stopPropagation();
                    element.removeClass('dragging');
                },

                // On item being dragged over / dropped onto
                dragenter: function(e) {
                },
                dragleave: function(e) {
                    element.removeClass('hover');
                },
                drop: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var sourceIndex = e.dataTransfer.getData('application/json');
                    move(sourceIndex, index);
                    element.removeClass('hover');
                }
            };

            // For performance purposes, do not
            // call $apply for these
            var unwrappedListeners = {
                dragover: function(e) {
                    e.preventDefault();
                    element.addClass('hover');
                },
                /* Use .hover instead of :hover. :hover doesn't play well with
                moving DOM from under mouse when hovered */
                mouseenter: function() {
                    element.addClass('hover');
                },
                mouseleave: function() {
                    element.removeClass('hover');
                }
            };

            angular.forEach(wrappedListeners, function(listener, event) {
                element.on(event, wrap(listener));
            });

            angular.forEach(unwrappedListeners, function(listener, event) {
                element.on(event, listener);
            });

            function wrap(fn) {
                return function(e) {
                    scope.$apply(function() {
                        fn(e);
                    });
                };
            }

            function move(fromIndex, toIndex) {
                // http://stackoverflow.com/a/7180095/1319998
                tabs.splice(toIndex, 0, tabs.splice(fromIndex, 1)[0]);
            };

        }
    }
})
// .directive('waveButton', function () {
//     return {
//         restrict: 'C',
//         link: function (scope, element) {
//             Waves.attach(element, ['waves-block','waves-button', 'waves-float']);
//             Waves.init();
//         }
//     }
// })
// .directive('waveIconButton', function () {
//     return {
//         restrict: 'C',
//         link: function (scope, element) {
//             Waves.attach(element, ['waves-circle','waves-block']);
//             Waves.init();
//         }
//     }
// });
