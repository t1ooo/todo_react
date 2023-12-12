describe('When page is initially opened', () => () {
    todo('should focus on the todo input field');
});
describe('No Todos', () => () {
    todo('should hide #main and #footer');
});
describe('New Todo', () => () {
    todo('should allow me to add todo items');
    todo('should clear text input field when an item is added');
    todo('should append new items to the bottom of the list');
    todo('should trim text input');
    todo('should show #main and #footer when items added');
});
describe('Mark all as completed', () => () {
    todo('should allow me to mark all items as completed');
    todo('should correctly update the complete all checked state');
    todo('should allow me to clear the completion state of all items');
    todo('complete all checkbox should update state when items are completed / cleared');
});
describe('Item', () => () {
    todo('should allow me to mark items as complete');
    todo('should allow me to un-mark items as complete');
});
describe('Editing', () => () {
    todo('should focus the input');
    todo('should hide other controls when editing');
    todo('should save edits on enter');
    todo('should save edits on blur');
    todo('should trim entered text');
    todo('should remove the item if an empty text string was entered');
    todo('should cancel edits on escape');
});
describe('Counter', () => () {
    todo('should display the current number of todo items');
});
describe('Clear completed button', () => () {
    todo('should display the correct text');
    todo('should remove completed items when clicked');
    todo('should be hidden when there are no items that are completed');
});
describe('Persistence', () => () {
    todo('should persist its data');
});
describe('Routing', () => () {
    todo('should allow me to display active items');
    todo('should respect the back button');
    todo('should allow me to display completed items');
    todo('should allow me to display all items');
    todo('should highlight the currently applied filter');
});