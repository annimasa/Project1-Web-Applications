<ins>**Project overview**</ins>

**Budget tracker**

A tool to plan and monitor personal budget. You can add budgetet incomes, budgets per category and actual incomes and expenses. The Budget tracker shows a summary of the results per each month. 

**Step-by-step instructions:**

1. Choose the right mode (Plan Budget / Monitor Budget) by clicking buttons
2. Select month
3. Set the months incomes
4. Select budgeting / monitoring category
5. Set the budget / actual expense for the category
6. Click save to submit
7. See the summary of the results below
8. Repeat the process to see the results for multiple categories, different months and summaries for Budget Plan / Actual for each month
9. In case of errors / wanting to start again, "Clear" -buttons clear the form and "Clear History" -button clears and erases the result history

**Visuals**

<img width="1918" height="991" alt="image" src="https://github.com/user-attachments/assets/f3f365d7-e71a-47aa-b1a0-f4fe15f42c9a" />

<img width="1915" height="987" alt="image" src="https://github.com/user-attachments/assets/4f6ebf74-053d-4645-b994-650d40e266ce" />

<img width="1916" height="991" alt="image" src="https://github.com/user-attachments/assets/f526112d-c8e6-429c-98f9-34e27eddc69e" />

<img width="1917" height="990" alt="image" src="https://github.com/user-attachments/assets/2f318305-d87b-4466-91de-916550dec822" />


**Self-Assessment**

A. Core Functionality 8 pts -> Otherwise working but "Clear History button" disappears after refreshing the page and needs a new entry to show up again\
B. Code Quality and Architecture 4 pts -> Code is quite organized with comments and small functions, but there might be some duplication\
C. UX and Accessibility 5 pts -> Everything should be okay\
D. Data Handling and Persistence 3-4 pts -> Data is written to localStorage/JSON, validation is present, includes resilience\
E. Documentation 2 pts -> Documentation should be okay but some of it was a little late\
F. Deployment 3 pts -> Everything should be okay\
G. Demo video and Documentation on Git 4 pts -> Video might miss something but should be mostly clear\
--> Total 29/30 pts 

**Reflection**

I wanted to try to do a Budget Tracker for my project, since it is something I had thought I wanted to try to do before. It turned out to bee surprisingly challenging, since there are two different modes (Plan / Monitor).
All the functions and features had to be done so that both of the modes work, which meant that I needed to get the program to recognize different entry types. Some of the features, like switching the mode and hiding the 
inactive mode and especially getting the results to show correctly (grouped per month, budget + actual results show under the same month group, income informations show only once per month, and all the categories from 
the same month show below it from both modes). I needed to do quite a lot of research and many unsuccessful tries to get it work. There are still quite a few improvements that I could do: find out why the "clear history" -button disappears after refreshing the page, add a possibility to edit and remove the entries one by one (not just all history), a feature to calculate budgetet and actual savings, and a comparison calculations for planned / actual budget. I am still quite happy that I managed to get the features that already exist to work and to create quite clear and responsive layout. I also definitively learned a lot about JavaScript and building dynamic web applications. 


**#Video timestamps**

00:00 Intro and goal
00:17 Features overview
01:22 Demo Delete History
01:47 Code Highlight Show Results
03:01 Code Highlight Switch Mode
03:39 Reflection
