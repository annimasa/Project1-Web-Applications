// Storage key, forms, error summary at the top, results at the bottom, history for results, save buttons
const STORAGE_KEY = "budgetDraft";
const ENTRIES_KEY = "budgetEntries";
const budgetForm = document.querySelector('#budget-form');
const monitorForm = document.querySelector('#monitor-form');
const summary = document.querySelector('#error-summary');
const results = document.querySelector('#results');
let history = [];
const saveBudgetBtn = document.querySelector('#saveBudget');
const saveActualBtn = document.querySelector('#saveActual')

// References to input fields
const plannedFields = {
    plannedMonths: document.querySelector('#plannedMonths'),
    plannedIncome: document.querySelector('#plannedIncome'),
    plannedCategories: document.querySelector('#plannedCategories'),
    budget: document.querySelector('#budget'),
    hp1: document.querySelector('#hp1')
};

const actualFields = {
    actualMonths: document.querySelector('#actualMonths'),
    actualIncome: document.querySelector('#actualIncome'),
    actualCategories: document.querySelector('#actualCategories'),
    expense: document.querySelector('#expense'),
    hp2: document.querySelector('#hp2')
};

const errorEls= {
    plannedIncome: document.querySelector('#plannedIncomeError'),
    budget: document.querySelector('#budgetError'),
    actualIncome: document.querySelector('#actualIncomeError'),
    expense: document.querySelector('#expenseError')
};

// Save entries to localStorage
let entries = JSON.parse(localStorage.getItem(ENTRIES_KEY)) || []; // Load saved entries or start empty
function saveToStorage() {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries)); 
}

// Event listeners for save buttons

saveBudgetBtn.addEventListener("click", () => {
    // Create entry object to store
    const entry = {
        type: 'plan',
        id: Date.now(), 
        date: new Date().toLocaleDateString(),
        plannedMonths: plannedFields.plannedMonths.value,
        plannedIncome: plannedFields.plannedIncome.value,
        plannedCategories: plannedFields.plannedCategories.value,
        budget: plannedFields.budget.value,
    }

    // Add entry to array and save updated array, show the entry below
    entries.push(entry);
    saveToStorage(); 
})

saveActualBtn.addEventListener("click", () => {
     const entry = {
        type: 'monitor',
        id: Date.now(), 
        date: new Date().toLocaleDateString(),
        actualMonths: actualFields.actualMonths.value,
        actualIncome: actualFields.actualIncome.value,
        actualCategories: actualFields.actualCategories.value,
        expense: actualFields.expense.value,
    }

    // Add entry to array and save updated array, show the entry below
    entries.push(entry);
    saveToStorage(); 
})

// Capitalize function for showing results more clearly
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Show results below the form

function showResults() {
    // If there are no entries, show nothing
    if (entries.length === 0) {
        results.innerHTML = '';
        return;
    }

    results.innerHTML = ''; // Empty the history

    const group = {}; // For grouping different categories under the same month


    entries.forEach(entry => {

        // Grouping
        const month = entry.type === 'plan'
            ? entry.plannedMonths
            : entry.actualMonths;

        if (!group[month]) {
            group[month] = {
                plan: [],
                monitor: []
            };
        }

        group[month][entry.type].push(entry);

    });
   
    // Rendering
    Object.keys(group).forEach(month => {
        const groupedMonths = group[month];

        results.innerHTML += `<h3>${capitalize(month)}</h3>`;

        // Show income information only once for each mode
        if (groupedMonths.plan.length > 0) {
            results.innerHTML += `
            <div>Planned Income: ${groupedMonths.plan[0].plannedIncome} €</div> <br>
            `;
        }

        if (groupedMonths.monitor.length > 0) {
            results.innerHTML += `
                <div>Actual Income: ${groupedMonths.monitor[0].actualIncome} €</div> <br>
                `;
        }

        // Planned categories
        if (groupedMonths.plan.length > 0) {
            results.innerHTML += `<strong>Budget Plan:</strong>`;
            groupedMonths.plan.forEach(entry => {
                results.innerHTML += `
                <div>
                ${capitalize(entry.plannedCategories)}: ${entry.budget}
                </div>
                `;
            });
            results.innerHTML += `<br>`;
        }

        // Actual categories
        if (groupedMonths.monitor.length > 0) {
            results.innerHTML += `<strong>Realized Budget:</strong>`;
            groupedMonths.monitor.forEach(entry => {
                results.innerHTML += `
                <div>
                ${capitalize(entry.actualCategories)}: ${entry.expense}
                </div>
                `;
            });
        results.innerHTML += `<br>`;
        }

    });
}

// Highlight selected mode button
const btnElList = document.querySelectorAll('.choice');

btnElList.forEach(btnEl => {
    btnEl.addEventListener('click', () => {
        document.querySelector('.highlight')?.classList.remove('highlight');
        btnEl.classList.add('highlight');
    });
});

// Show budget form of the active mode and hide the other mode
let activeMode = null;
const planMode = document.querySelector('#budget-plan');
const monitorMode = document.querySelector('#budget-actual');
let planModeIsClicked = true;
let monitorModeIsClicked = true;

function clearErrors() {
    problems.length = 0;
    summary.classList.add('visually-hidden');
} // Clear the errors so the "wrong" errors don't show when switching mode

let showPlanMode = function() {
    if(planModeIsClicked){
        planMode.style.display = 'block';
        monitorMode.style.display = 'none';
        planModeIsClicked = false;
        monitorModeIsClicked = true;
        activeMode = 'plan';
        clearErrors();
    }
    else {
        planMode.style.display = 'none';
        planModeIsClicked = true;
    }
}

let showMonitorMode = function() {
    if(monitorModeIsClicked){
        monitorMode.style.display = 'block';
        planMode.style.display = 'none';
        monitorModeIsClicked = false;
        planModeIsClicked = true;
        activeMode = 'monitor';
        clearErrors();
    }
    else {
        monitorMode.style.display = 'none';
        monitorModeIsClicked = true;
    }
}


// Debounce: prevent too many validations when typing fast
function debounce(fn, wait = 250) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn (...args), wait);
    };
}

// Validation

function validatePlannedIncome() {
    const el = plannedFields.plannedIncome;
    el.setCustomValidity(''); // Clear old errors

// Check if empty
if (el.validity.valueMissing) {
    el.setCustomValidity('Income is required. Numbers only!')
}

// Show the error message below the field

errorEls.plannedIncome.textContent = el.validationMessage;

// Mark field as invalid
el.setAttribute('aria-invalid', String(!el.checkValidity()));

// Return true if valid, false if not
return el.checkValidity();
}

function validateBudget() {
    const el = plannedFields.budget;
    el.setCustomValidity('');

    if (el.validity.valueMissing) {
        el.setCustomValidity('Budget is required. Numbers only!');
    }

    errorEls.budget.textContent = el.validationMessage;

    el.setAttribute('aria-invalid', String(!el.checkValidity()));

    return el.checkValidity();
}


function validateActualIncome() {
    const el = actualFields.actualIncome;
    el.setCustomValidity('');

    if (el.validity.valueMissing) {
        el.setCustomValidity('Income is required. Numbers only!');
    }

    errorEls.actualIncome.textContent = el.validationMessage;

    el.setAttribute('aria-invalid', String(!el.checkValidity()));

    return el.checkValidity();
}

function validateExpense() {
    const el = actualFields.expense;
    el.setCustomValidity('');

    if (el.validity.valueMissing) {
        el.setCustomValidity('Expense is required. Numbers only!');
    }

    errorEls.expense.textContent = el.validationMessage;

    el.setAttribute('aria-invalid', String(!el.checkValidity()));

    return el.checkValidity();
}

// Live validation as user types

plannedFields.plannedIncome.addEventListener('input', () => { 
    if (activeMode === 'plan') {
        debounce(validatePlannedIncome, 150)(); 
        buildSummary();
    } 
});
plannedFields.budget.addEventListener('input', () => { 
    if (activeMode === 'plan') {
        debounce(validateBudget, 150)(); 
        buildSummary(); 
    }
});
actualFields.actualIncome.addEventListener('input', () => { 
    if (activeMode === 'monitor') {
        debounce(validateActualIncome, 150)(); buildSummary(); 
    }
});
actualFields.expense.addEventListener('input', () => { 
    if (activeMode === 'monitor') {
        debounce(validateExpense, 150)(); buildSummary(); 
    }
});

// Error summary

const problems = [];

function buildSummary() {
    problems.length = 0; // Clear the list

    if (activeMode === 'plan') {
        if (!validatePlannedIncome()) problems.push('Incomes: ' + plannedFields.plannedIncome.validationMessage);
        if (!validateBudget()) problems.push('Budget: ' + plannedFields.budget.validationMessage);
    } else if (activeMode === 'monitor') {
        if (!validateActualIncome()) problems.push('Incomes: ' + actualFields.actualIncome.validationMessage);
        if (!validateExpense()) problems.push('Expense: ' + actualFields.expense.validationMessage);
    }

// Show the error summary box if there are errors

    if (problems.length) {
        summary.classList.remove('visually-hidden');
        summary.innerHTML = 'Please fix the following: ' + problems.join(' ');
    } else {
        summary.classList.add('visually-hidden');
        summary.innerHTML = '';
}

}

// Save data to browser memory

// Save current form data

function saveDraft() {
    const data = {
        plannedMonths: plannedFields.plannedMonths.value,
        plannedIncome: plannedFields.plannedIncome.value,
        plannedCategories: plannedFields.plannedCategories.value,
        budget: plannedFields.budget.value,
        actualMonths: actualFields.actualMonths.value,
        actualIncome: actualFields.actualIncome.value,
        actualCategories: actualFields.actualCategories.value,
        expense: actualFields.expense.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Load saved data
function restoreDraft() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const data = JSON.parse(raw);

        plannedFields.plannedMonths.value = data.plannedMonths || '';
        plannedFields.plannedIncome.value = data.plannedIncome || '';
        plannedFields.plannedCategories.value = data.plannedCategories || '';
        plannedFields.budget.value = data.budget || '';
        actualFields.actualMonths.value = data.actualMonths || '';
        actualFields.actualIncome.value = data.actualIncome || '';
        actualFields.actualCategories.value = data.actualCategories || '';
        actualFields.expense.value = data.expense || '';

        console.log('Restored Draft:', data);
    } catch (e) {
        console.error('Restore Error, e');
    }
 }

 // Save data when user types or clicks
 ['input', 'change'].forEach(evt => budgetForm.addEventListener(evt, debounce(saveDraft, 300)));
 ['input', 'change'].forEach(evt => monitorForm.addEventListener(evt, debounce(saveDraft, 300)));

 restoreDraft();
 showResults();

 // Clear buttons

 const clearBudget = document.querySelector('#clearBudget'); 
 const clearActual = document.querySelector('#clearActual');
 const clearHistory = document.querySelector('#clearHistory');


 // Clear the forms
 clearBudget.addEventListener('click', () => {
    budgetForm.reset(); 
    localStorage.removeItem(STORAGE_KEY);
    Object.values(errorEls).forEach(e => e.textContent = '');
    buildSummary();
    console.log('Form Cleared');
 });

  clearActual.addEventListener('click', () => {
    monitorForm.reset(); 
    localStorage.removeItem(STORAGE_KEY);
    Object.values(errorEls).forEach(e => e.textContent = '');
    buildSummary();
    console.log('Form Cleared');
 });

 // Clear result history
 clearHistory.addEventListener('click', () => {
    localStorage.removeItem(ENTRIES_KEY);
    results.innerHTML = '';
    entries = [];
    clearHistory.classList.add('visually-hidden');
    console.log('History Cleared')
 });

 // Form submission

budgetForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop normal form submit

    // Check all fields
    const isValid = validatePlannedIncome() && validateBudget();
    buildSummary();

    // If not valid, focus on first error
    const firstInvalid = budgetForm.querySelector('[aria-invalid="true"]');
    if (!isValid && firstInvalid) {
        firstInvalid.focus();
        return;
    }

    // Bot detection: if hidden field has text, block submit
    if (plannedFields.hp1.value) {
        alert('Submission blocked due to bot detection.');
        return;
    } else if (actualFields.hp2.value) {
        alert('Submission blocked due to bot detection.');
        return;
    }


    // Prepare data to send
    const payload = {
        plannedMonths: plannedFields.plannedMonths.value,
        plannedIncome: plannedFields.plannedIncome.value,
        plannedCategories: plannedFields.plannedCategories.value,
        budget: plannedFields.budget.value,
        time: new Date().toISOString()
    };

    try {
        // Send data to a demo server (no real database)
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log('Submitted successfully. Demo ID: ' + data.id);
        console.log('Submitted Data:', payload);
    } catch (error) {
        alert('Network error occurred. Please try again.');
        console.error('Submission Error:', error);
    }
    // Show results below the form, show button to clear history
    showResults();
    clearHistory.classList.remove('visually-hidden');
});

monitorForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop normal form submit

    // Check all fields
    const isValid = validateActualIncome() && validateExpense();
    buildSummary();

    // If not valid, focus on first error
    const firstInvalid = monitorForm.querySelector('[aria-invalid="true"]');
    if (!isValid && firstInvalid) {
        firstInvalid.focus();
        return;
    }

    // Bot detection: if hidden field has text, block submit
    if (plannedFields.hp1.value) {
        alert('Submission blocked due to bot detection.');
        return;
    } else if (actualFields.hp2.value) {
        alert('Submission blocked due to bot detection.');
        return;
    }

     // Prepare data to send
    const payload = {
        actualMonths: actualFields.actualMonths.value,
        actualIncome: actualFields.actualIncome.value,
        actualCategories: actualFields.actualCategories.value,
        expense: actualFields.expense.value,
        time: new Date().toISOString()
    };

    try {
        // Send data to a demo server (no real database)
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log('Submitted successfully. Demo ID: ' + data.id);
        console.log('Submitted Data:', payload);
    } catch (error) {
        alert('Network error occurred. Please try again.');
        console.error('Submission Error:', error);
    }

    // Show results below the form, show button to clear history
    showResults();
    clearHistory.classList.remove('visually-hidden');
});