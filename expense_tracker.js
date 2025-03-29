document.getElementById('add-entry').addEventListener('click', function() {
    const entriesContainer = document.getElementById('entries-container');

    // Create a container for the new entry
    const entryContainer = document.createElement('div');
    entryContainer.className = 'entry-container';
    entryContainer.style.marginBottom = '40px'; // Adds space between entries

    // Create a new row for the item
    const itemRow = document.createElement('div');
    itemRow.className = 'form-row';
    itemRow.innerHTML = `
        <label for="item">Item:</label>
        <input type="text" name="item[]" placeholder="Enter item name">
    `;
    entryContainer.appendChild(itemRow);

    // Create a new row for the cost
    const costRow = document.createElement('div');
    costRow.className = 'form-row';
    costRow.innerHTML = `
        <label for="cost">Cost:</label>
        <input type="number" name="cost[]" placeholder="Enter cost">
    `;
    entryContainer.appendChild(costRow);

    const categoryRow = document.createElement('div');
    categoryRow.className = 'form-row';
    categoryRow.innerHTML = `
                <label for="category">Category:</label>
                <select id="category" name="category[]" style="margin-left: 0px;">
                    <option value="Takeout">Takeout</option>
                    <option value="Homemade">Homemade</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Other">Other</option>
                </select>
    `;

    entryContainer.appendChild(categoryRow);

    const dateRow = document.createElement('div');
    dateRow.className = 'form-row';
    dateRow.innerHTML = `
                <label for="date">Date:</label>
                <input type="date" id="date" name="date[]" placeholder="Select a date">
    `;

    entryContainer.appendChild(dateRow);

    // Append the entry container to the entries container
    entriesContainer.appendChild(entryContainer);
});


// Example inside your form submission handler
const form = document.getElementById('expense-form');
const clear_button = document.getElementById('clear-expenses'); // Clear button to clear localStorage

const itemsList = document.getElementById('itemsDisplay'); // Where you might display stored items
const allItems = loadItems(); // Load existing items from localStorage

const timeFilter = document.getElementById('time-filter'); // Time filter dropdown


const categoryChartCanvas = document.getElementById('categoryPieChart');
const storageKey = 'shoppingListData';
let categoryPieChart = null; // Variable to hold the chart instance

const week1Filter = document.getElementById('week1-filter');
const week2Filter = document.getElementById('week2-filter');
const compareButton = document.getElementById('compare-weeks');
const week1ChartCanvas = document.getElementById('week1PieChart');
const week2ChartCanvas = document.getElementById('week2PieChart');
let week1PieChart = null;
let week2PieChart = null;


compareButton.addEventListener('click', function () {
    const week1Value = week1Filter.value;
    const week2Value = week2Filter.value;

    const items = loadItems(); // Load all items from localStorage

    // Filter items for each week
    const week1Items = filterItemsByDate(items, week1Value);
    const week2Items = filterItemsByDate(items, week2Value);

    // Render the pie charts
    week1PieChart = renderComparisonPieChart(week1Items, week1ChartCanvas, week1PieChart, 'Week 1 Spending');
    week2PieChart = renderComparisonPieChart(week2Items, week2ChartCanvas, week2PieChart, 'Week 2 Spending');
});


timeFilter.addEventListener('change', function () {
    const selectedValue = timeFilter.value; // Get the selected time period
    const items = loadItems(); // Load all items from localStorage
    const filteredItems = filterItemsByDate(items, selectedValue); // Filter items based on the selected time period
    renderPieChart(filteredItems); // Re-render the pie chart with the filtered data
});


function filterItemsByDate(items, days) {
    if (days === 'all') {
        return items; // Return all items if "All Time" is selected
    }

    const now = new Date();
    const filteredItems = items.filter(item => {
        const itemDate = new Date(item.date);
        const timeDifference = now - itemDate; // Difference in milliseconds
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert to days
        return daysDifference <= days; // Include items within the selected time period
    });

    return filteredItems;
}


function loadItems() {
    const storedItems = localStorage.getItem('shoppingListData');
    return storedItems ? JSON.parse(storedItems) : []; // Return empty array if nothing stored
}

function displayItems(items) {
    itemsList.innerHTML = ''; // Clear previous list
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name}: $${item.cost} -- ${item.category} -- ${item.date}`; // Display item name and cost
        itemsList.appendChild(li);
    });
}
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop form from submitting traditionally

    const entriesContainer = document.getElementById('entries-container');
    const entryContainers = entriesContainer.getElementsByClassName('entry-container'); // Get all entry containers

    

    // Loop through each entry container
    for (const entryContainer of entryContainers) {
        const itemInput = entryContainer.querySelector('input[name="item[]"]');
        const costInput = entryContainer.querySelector('input[name="cost[]"]');
        const categoryInput = entryContainer.querySelector('select[name="category[]"]');
        const dateInput = entryContainer.querySelector('input[name="date[]"]'); // Get the date input

        // Create an object for the current entry
        const newItem = {
            name: itemInput.value.trim(),
            cost: parseFloat(costInput.value), // Convert cost to a number
            category: categoryInput.value,
            date: dateInput.value // Get the date value
        };

        // Validate the entry before adding it
        if (newItem.name && !isNaN(newItem.cost)) {
            allItems.push(newItem); // Add the valid entry to the array
        } else {
            alert('Please fill out all fields correctly for each entry.');
            return; // Stop submission if any entry is invalid
        }
    }

    // Save all entries to localStorage
    localStorage.setItem('shoppingListData', JSON.stringify(allItems));

    // Optionally, display the updated list
    displayItems(allItems);

    // Clear the form
    // Clear all dynamically added entries and repopulate with one default entry
    entriesContainer.innerHTML = ''; // Clear all entries

    // Create a single default entry
    const defaultEntry = document.createElement('div');
    defaultEntry.className = 'entry-container';
    defaultEntry.style.marginBottom = '40px'; // Adds space between entries

    // Add the default "Item" field
    const itemRow = document.createElement('div');
    itemRow.className = 'form-row';
    itemRow.innerHTML = `
        <label for="item">Item:</label>
        <input type="text" name="item[]" placeholder="Enter item name">
    `;
    defaultEntry.appendChild(itemRow);

    // Add the default "Cost" field
    const costRow = document.createElement('div');
    costRow.className = 'form-row';
    costRow.innerHTML = `
        <label for="cost">Cost:</label>
        <input type="number" name="cost[]" placeholder="Enter cost">
    `;
    defaultEntry.appendChild(costRow);

    // Add the default "Category" dropdown
    const categoryRow = document.createElement('div');
    categoryRow.className = 'form-row';
    categoryRow.innerHTML = `
        <label for="category">Category:</label>
        <select name="category[]" style="margin-left: 0px;">
            <option value="Takeout">Takeout</option>
            <option value="Homemade">Homemade</option>
            <option value="Drinks">Drinks</option>
            <option value="Snacks">Snacks</option>
            <option value="Other">Other</option>
        </select>
    `;
    defaultEntry.appendChild(categoryRow);

    // Add the default "Date" field
    const dateRow = document.createElement('div');
    dateRow.className = 'form-row';
    dateRow.innerHTML = `
        <label for="date">Date:</label>
        <input type="date" name="date[]" placeholder="Select a date">
    `;
    defaultEntry.appendChild(dateRow);

    // Append the default entry back to the entries container
    entriesContainer.appendChild(defaultEntry);
    alert('Expenses submitted successfully!');

    //renderPieChart(allItems); // Re-render the pie chart with updated items
});


function calculateCategoryTotals(items) {
    const categoryTotals = {}; // Use an object to store totals { categoryName: totalCost }
    items.forEach(item => {
        const category = item.category.trim() || 'Uncategorized'; // Handle empty/whitespace categories
        const cost = item.cost;

        if (typeof cost === 'number' && !isNaN(cost)) {
            if (categoryTotals[category]) {
                categoryTotals[category] += cost;
            } else {
                categoryTotals[category] = cost;
            }
        }
    });
    return categoryTotals; // e.g., { 'Groceries': 50.50, 'Bills': 120.00 }
}




function renderComparisonPieChart(filteredItems, canvas, chartInstance, title) {
    const aggregatedData = calculateCategoryTotals(filteredItems);

    const labels = Object.keys(aggregatedData); // ['Takeout', 'Drinks']
    const dataValues = Object.values(aggregatedData); // [50.50, 120.00]

    // Destroy previous chart instance if it exists to prevent conflicts
    if (chartInstance) {
        chartInstance.destroy();
    }

    let newChartInstance = null; // Variable to hold the new instance

    if (labels.length > 0 && canvas) {
        const ctx = canvas.getContext('2d');
        // Assign the new chart to the variable we will return
        newChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cost',
                    data: dataValues,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        });
    } else if (canvas) {
        // Optional: Clear canvas or show message if no data
        const ctx = canvas.getContext('2d');
        // Potential typo fix: Use canvas.width/height unless chartCanvas is defined elsewhere
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // No new chart created, ensure null is returned
        newChartInstance = null;
    }

    // Return the newly created instance (or null if none was created)
    return newChartInstance;
}

clear_button.addEventListener('click', function() {
    localStorage.clear(); // Clear localStorage
    itemsList.innerHTML = ''; // Clear displayed list
    alert('All entries cleared!'); // Alert user
});

// Load and display items when the page load
document.addEventListener('DOMContentLoaded', () => {
    const items = loadItems();
    displayItems(items);
    //renderPieChart(items); // Render the pie chart with loaded items
});