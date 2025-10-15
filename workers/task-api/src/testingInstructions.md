1. create task
2. delete task

1. create task
2. complete task

1. try to create new board testBoard1.
2. if it already exists and new creation is rejected, succeed and complete test.
3. if it doesn't exist, ensure that it was created, and complete test.

1. try to create new tag 'existingTag1' on testBoard1.
2. if it already exists and new creation is rejected, succeed and complete test.
3. if it doesn't exist, ensure that it was created, and complete test.

1. create task.
2. assign task to new tag.
3. delete new tag.
4. verify that tag has been removed from task and that tag doesn't exist in board anymore.
5. complete task.

1. create task
2. move task in new board 'testBoard2'
3. move task to 'main' board
4. delete 'testBoard2'
5. delete task

1. get current preferences (should be light theme).
2. change theme to strawberry.
3. reload preferences to ensure they were saved and see the new one now.
4. change theme back to light theme.
3. reload preferences to ensure they were saved and see the prev one now.

1. create three tasks.
2. move all three tasks to new 'testBoard2'
3. move all three tasks to existing 'testBoard1'
4. assign all three to existing tag 'existingTag1'
5. assign all three to new tag 'newTag1'
6. clear all on 'newTag1'
7. delete the first two tasks manually, complete the third manually.