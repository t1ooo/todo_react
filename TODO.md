+ show todo
    + when there is at least one task:
        header
        body
        footer
    + when there is no tasks:
        header

+ add new task
    + show task_add_input_field
        + show placeholder "What needs to be done?"
        + focus on todo input field
    + add task by type text to task_add_input_field and click to [enter]
    + not add task, when input field empty
    + clear task_add_input_field after task added
    + show task at the end of task_list
    + trim text input

+ mark task as done/undone
    + show task_done_checkbox the left of a task
        + when check:
            + mark task as done
            + add strikethrough to task_text
        + when uncheck:
            + mark task as undone
            + remove strikethrough from task_text

+ mark all tasks as done/undone
    + show all_tasks_done_button
        + when check:
            + mark all tasks as done
            + cross out tasks text
        + when uncheck:
            + mark all tasks as undone
            + remove cross out from tasks text

+ delete task
    + show task_delete_button the right of a task
        + show only when hover
    + delete task, when click on task_delete_button

+ delete completed tasks
    + show completed_tasks_clear_button
        + show only when at least one task is completed
    + delete done tasks, when click completed_tasks_clear_button button

+ edit task
    + make task_text editable, when double click to task
        + replace task_text and task_delete_button with input field with task_text
        + set cursor to input field to end of task_text
        + when press [enter] or click outside task: delete task, if task_text is empty, else save
        + when press [esc]: cancel all changes
        + replace input field with task_text and task_delete_button
        + trim text input

+ show tasks_left_count
    + use plural form, when items > 1
    + increment/decrement, when mark task as done/undone

+ show task by type
    + show all tasks
        + show all_task_button
        + show all tasks, when click to all_task_button
    + show active tasks
        + show active_tasks_button
        + show active tasks, when click to active_tasks_button
    + show completed tasks
        + show completed_tasks_button
        + show completed tasks, when click to completed_tasks_button

+ auto save tasks state between sessions
    + save all_tasks_done_button state

--------------------------------------------------------------------------------
+ replace Task.onChange to onCheck
+ TaskAddInputField: handle submit event with input onKeyDown instead form onSubmit
+ replace ' to "
+ move logic from App to Todo
+ show tasks with <div> instead <li>
+ refactor strikethrough css
+ replace task types with constant
- refactor _newState: add props validation
- ? replace localStorage to IndexedDB
+ refactor App._newState
+ replace storage key string to variable
+ TasksShowByType replace to loop
+ rename class name: "not-complete" -> "active", "complete" -> "completed"
+ rename method _getNotCompleteTaskCount -> _getActiveTaskCount, _getCompleteTaskCount -> _getCompletedTaskCount
+ rename Task prop complete -> completed
+ rename buttons
+ rename completionAllChecked -> completedAll
+ add titles to html elements
+ static analyzer
+ fmt tool
+ add flow types
+ remove constructors
- ? add style name
+ refactor components: header, body, footer
- write tests
+ replace component class with function, if state is not used
+ add propTypes
+ remove Todo._filter
x add private props and methods
    <!-- not testable -->
- add style
- ? save App state before unload
+ ? test with testid https://testing-library.com/docs/guide-which-query
- ? routing
- ? jest-puppeteer
- ? framework agnostic tests
- test: toMatchSnapshot
+ eslint-plugin-flowtype
- ? hover inline style
+ add app.parseState; rewrite tests
+ write new Task test
x move types to separate declaration file
    <!-- does not work as expected -->
+ remove class toggle-label, toggle-all-label