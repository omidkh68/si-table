/**
 * SiTable (main) Directive
 *
 * Transforms boring tables to a bit cooler ones.
 */
angular.module('siTable.directives').directive('siTable', function($compile) {
    return {
        restrict: 'A',
        scope: true,
        terminal: true,
        transclude: true,
        priority: 1500, // higher than ng-repeat
        controller: function($scope, $element, $attrs, $transclude) {
            $scope.paginationParams = {
                offset: 0,
                maxShowPages: 10,
                limit: Infinity,
            };

            $scope.sortingParams = {};

            $attrs.$observe('pagination', function(pagination) {
                if (angular.isUndefined(pagination)) {
                    return;
                }
                $scope.paginationParams.limit = pagination ?
                        parseInt(pagination, 10) : 10;
            });

            $attrs.$observe('paginationLength', function(paginationLength) {
                if (paginationLength) {
                    $scope.paginationParams.maxShowPages = paginationLength;
                }
            });

            $scope.$watch('paginationParams.total', function() {
                $scope.paginationParams.offset = 0;
            });

            $scope.$watch('sortingParams', function(sortingParams) {
                var sortArray = [];
                for (var key in sortingParams) {
                    if (sortingParams[key] === 'desc') {
                        sortArray.push('-' + key);
                    } else {
                        sortArray.push(key);
                    }
                }
                $scope.sortArray = sortArray;
                $scope.paginationParams.offset = 0; // Reset pagination
            }, true);
        },
        link: function(scope, element, attrs, controller, transclude) {
            transclude(scope, function(clones) {
                element.append(clones);

                if (angular.isDefined(attrs.pagination)) {
                    element.after($compile('<si-table-pagination params="paginationParams"/>')(scope));
                }
            });
        }
    };
});
