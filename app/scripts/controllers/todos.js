'use strict';

angular.module('todos').controller('MainCtrl', ['$scope', '$routeParams', 'todoStorage', 'filterFilter',
  /**
   * Controller for editing the tasks lists
   *
   * @param {angular.Scope} $scope
   * @param {angular.$routeParams} $routeParams
   * @param document
   * @constructor
   */
  function ($scope, $routeParams, todoStorage, filterFilter) {
    $scope.fileId = $routeParams.fileId;
    $scope.filter = $routeParams.filter;

    $scope.document = document;
    $scope.todos = todoStorage.get();
    $scope.newTodo = '';
    $scope.remainingCount = filterFilter($scope.todos, {completed: false}).length;


      /**
     * Add a new todo item to the list, resets the new item text.
     */
    $scope.addTodo = function () {
      if ($scope.newTodo.length === 0) return;

      $scope.todos.push({
        title: $scope.newTodo,
        completed: false
      });
      todoStorage.put($scope.todos);

      $scope.newTodo = '';
      $scope.remainingCount++;
    };

    /**
     * Begin editing of an item.
     */
    $scope.editTodo = function (todo) {
      $scope.editedTodo = todo;
    };

    /**
     * Cancel editing.
     */
    $scope.doneEditing = function () {
      $scope.editedTodo = null;
      if ( !todo.title ) $scope.removeTodo(todo);
      todoStorage.put($scope.todos);
    };

    /**
     * Delete an individual todo by removing it from the list.
     *
     * @param todo
     */
    $scope.removeTodo = function (todo) {
      $scope.remainingCount -= todo.completed ? 0 : 1;
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
      todoStorage.put($scope.todos);
    };

    $scope.todoCompleted = function( todo ) {
      todo.completed ? $scope.remainingCount-- : $scope.remainingCount++;
      todoStorage.put($scope.todos);
    };

    /**
     * Remove all completed todos from the list
     */
    $scope.clearDoneTodos = function () {
      $scope.todos = $scope.todos.filter(function( val ) {
        return !val.completed;
      });
      todoStorage.put($scope.todos);
    };

    /**
     * Toggle the completed status of all items.
     *
     * @param done
     */
    $scope.markAll = function (done) {
      $scope.todos.forEach(function( todo ) {
        todo.completed = done;
      });
      $scope.remainingCount = done ? 0 : $scope.todos.length;
      todoStorage.put($scope.todos);
    };

    $scope.$watch('filter', function (filter) {
      $scope.statusFilter = (filter === 'active') ?
      { completed: false } : (filter === 'completed') ?
      { completed: true } : null;
    });
        
    $scope.$watch('remainingCount == 0', function( val ) {
      $scope.allChecked = val;
    });
  }]
);
