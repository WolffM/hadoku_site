1. create task
2. delete task

3. create task
4. complete task

5. try to create new board testBoard1.
6. if it already exists and new creation is rejected, succeed and complete test.
7. if it doesn't exist, ensure that it was created, and complete test.

8. try to create new tag 'existingTag1' on testBoard1.
9. if it already exists and new creation is rejected, succeed and complete test.
10. if it doesn't exist, ensure that it was created, and complete test.

11. create task.
12. assign task to new tag.
13. delete new tag.
14. verify that tag has been removed from task and that tag doesn't exist in board anymore.
15. complete task.

16. create task
17. move task in new board 'testBoard2'
18. move task to 'main' board
19. delete 'testBoard2'
20. delete task

21. get current preferences (should be light theme).
22. change theme to strawberry.
23. reload preferences to ensure they were saved and see the new one now.
24. change theme back to light theme.
25. reload preferences to ensure they were saved and see the prev one now.

26. create three tasks.
27. move all three tasks to new 'testBoard2'
28. move all three tasks to existing 'testBoard1'
29. assign all three to existing tag 'existingTag1'
30. assign all three to new tag 'newTag1'
31. clear all on 'newTag1'
32. delete the first two tasks manually, complete the third manually.
