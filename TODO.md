- show todo
    - when there is at least one task:
        task_add_input_field
        task_list
        tasks_left_count
        tasks_show_by_type buttons
        completed_tasks_clear_button
    - when there is no tasks:
        task_add_input_field

+ add new task
    + show task_add_input_field
        + show placeholder "What needs to be done?"
    + add task by type text to task_add_input_field and click to [enter]
    + not add task, when input field empty
    + clear task_add_input_field after task added
    + show task at the end of task_list

- mark task as done/undone
    + show task_done_checkbox the left of a task
        - when check:
            + mark task as done
            - add strikethrough to task_text
        - when uncheck:
            + mark task as undone
            - remove strikethrough from task_text
            
- mark all tasks as done/undone
    - show all_tasks_done_button
        - when check:
            - mark all tasks as done
            - cross out tasks text
        - when uncheck:
            - mark all tasks as undone
            - remove cross out from tasks text

- delete task
    + show task_delete_button the right of a task
        - show only when when hover
    + delete task, when click on task_delete_button
   
- delete completed tasks
    + show completed_tasks_clear_button 
        - show only when at least one task is marked
    - delete done tasks, when click completed_tasks_clear_button button

- edit task
    - when double click to task
        - remove task delete button
        - replace task text with input field contains task text
        - when click enter
            - if enter is empty: delete task, else: save task

- show tasks_left_count
    + use plural form, when items > 1
    + increment/decrement, when mark task as done/undone

- show task by type
    - show all tasks
        - show all_task_button
        - show all tasks, when click to all_task_button

    - show active tasks
        - show active_tasks_button
        - show active tasks, when click to active_tasks_button

    - show completed tasks
        - show completed_tasks_button
        - show completed tasks, when click to completed_tasks_button

- auto save tasks state between sessions

--------------------------------------------------------------------------------
- replace Task.onChange to onCheck