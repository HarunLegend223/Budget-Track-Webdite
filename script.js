let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;

document.getElementById('add-button').addEventListener('click', addExpense);
document.getElementById('login-submit').addEventListener('click', logIn);
document.getElementById('signup-submit').addEventListener('click', signUp);
document.getElementById('make-budget-button').addEventListener('click', showBudget);
document.getElementById('login-button').addEventListener('click', showLogin);
document.getElementById('signup-button').addEventListener('click', showSignUp);
document.getElementById('home-button').addEventListener('click', showHome);

function showHome() {
    hideAllSections();
    document.getElementById('home').style.display = 'block';
}

function showBudget() {
    hideAllSections();
    document.getElementById('budget-container').style.display = 'block';
    renderExpenses();
}

function showLogin() {
    hideAllSections();
    document.getElementById('login-form').style.display = 'block';
}

function showSignUp() {
    hideAllSections();
    document.getElementById('signup-form').style.display = 'block';
}

function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

function addExpense() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (description && !isNaN(amount) && amount > 0) {
        const expense = { description, amount };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    } else {
        alert('Please enter valid values.');
    }
}

function renderExpenses() {
    const expensesList = document.getElementById('expenses');
    expensesList.innerHTML = '';
    let total = 0;

    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.description}: $${expense.amount.toFixed(2)}`;
        expensesList.appendChild(li);
        total += expense.amount;
    });

    document.getElementById('total-amount').textContent = total.toFixed(2);
}

function logIn() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        alert('Login successful!');
        showBudget();
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function signUp() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;
    const password = document.getElementById('signup-password').value;

    if (username && email && phone && password) {
        const newUser = { username, email, phone, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        alert('Signup successful! You can now log in.');
        showLogin();
    } else {
        alert('Please fill out all fields.');
    }
}
document.getElementById('track-button').addEventListener('click', trackBudget);

// Function to track budget using the receipt number
function trackBudget() {
    const receiptNumber = document.getElementById('track-receipt-number').value;
    const trackingResult = document.getElementById('tracking-result');

    // Simulate checking for a receipt number
    if (receiptNumber.startsWith('REC-')) {
        trackingResult.innerHTML = `
            <h3>Expenses for ${receiptNumber}:</h3>
            <ul>${renderReceiptExpenses()}</ul>
            <h2>Subtotal: $${getSubtotal().toFixed(2)}</h2>
            <h2>Total (incl. VAT): $${getTotal().toFixed(2)}</h2>
            <p>Date of calculation: ${new Date().toLocaleDateString()}</p>
        `;
    } else {
        trackingResult.textContent = 'Invalid receipt number. Please try again.';
    }
}
// Event listener for the delete and edit buttons (add this inside renderExpenses function)
function renderExpenses() {
    const expensesList = document.getElementById('expenses');
    expensesList.innerHTML = '';
    let total = 0;

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.textContent = `${expense.description}: $${expense.amount.toFixed(2)}`;

        // Create Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editExpense(index);
        
        // Create Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteExpense(index);

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        expensesList.appendChild(li);
        total += expense.amount;
    });

    document.getElementById('total-amount').textContent = total.toFixed(2);
}

// Function to edit an expense
function editExpense(index) {
    const description = prompt('Enter new description:', expenses[index].description);
    const amount = parseFloat(prompt('Enter new amount:', expenses[index].amount));

    if (description && !isNaN(amount) && amount > 0) {
        expenses[index] = { description, amount };
        updateLocalStorage();
        renderExpenses();
    } else {
        alert('Please enter valid values.');
    }
}

// Function to delete an expense
function deleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1);
        updateLocalStorage();
        renderExpenses();
    }
}

// Function to update local storage
function updateLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}
// Add event listener for the Print Receipt button
document.getElementById('print-receipt').addEventListener('click', printReceipt);

// Function to generate and print the receipt
function printReceipt() {
    if (expenses.length === 0) {
        alert('No expenses to print!');
        return;
    }

    const receiptContent = document.createElement('div');
    receiptContent.innerHTML = `
        <h2>Receipt</h2>
        <img src="https://i.pinimg.com/564x/31/23/52/31235223e3724d09e515331efe6ff1da.jpg" alt="Logo" class="receipt-logo" style="width:100px;">
        <h4>Receipt Number: ${generateReceiptNumber()}</h4>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <h3>Expenses:</h3>
        <ul>${renderReceiptExpenses()}</ul>
        <h2>Subtotal: $${getSubtotal().toFixed(2)}</h2>
        <h2>Total (incl. VAT): $${getTotal().toFixed(2)}</h2>
    `;

    const win = window.open('', '_blank');
    win.document.write(receiptContent.outerHTML);
    win.document.close();
    win.onload = function() {
        win.print();
        win.close();
    };
}

// Function to render the list of expenses for the receipt
function renderReceiptExpenses() {
    return expenses.map(expense => `<li>${expense.description}: $${expense.amount.toFixed(2)}</li>`).join('');
}

// Function to calculate subtotal
function getSubtotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

// Function to calculate total including VAT (10%)
function getTotal() {
    return getSubtotal() * 1.1; // 10% VAT
}

// Function to generate a unique receipt number
function generateReceiptNumber() {
    return 'REC-' + Date.now();
}
document.getElementById('track-button').addEventListener('click', trackBudget);

// Function to track budget using the receipt number
function trackBudget() {
    const receiptNumber = document.getElementById('track-receipt-number').value;
    const trackingResult = document.getElementById('tracking-result');

    // Here we're simulating receipt number validation; you can implement a more robust method
    if (receiptNumber.startsWith('REC-')) {
        // Display expenses related to this receipt number (assuming the same expenses for demonstration)
        trackingResult.innerHTML = `
            <h3>Expenses for ${receiptNumber}:</h3>
            <ul>${renderReceiptExpenses()}</ul>
            <h2>Subtotal: $${getSubtotal().toFixed(2)}</h2>
            <h2>Total (incl. VAT): $${getTotal().toFixed(2)}</h2>
            <p>Date of calculation: ${new Date().toLocaleDateString()}</p>
        `;
    } else {
        trackingResult.textContent = 'Invalid receipt number. Please try again.';
    }
}
