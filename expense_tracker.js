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
    entriesContainer.innerHTML = `           
                <div id = "entry-container">
                <div class="form-row">
                    <label for="item">Item:</label>
                    <input type="text" id="itemName" name="item[]" placeholder="Enter item name">
                </div>
                <div class="form-row" >
                    <label for="cost">Cost:</label>
                    <input type="number" id="itemCost" name="cost[]" placeholder="Enter cost">
                </div>
                <div class="form-row" style="margin-bottom: 40px;">
                    <label for="category">Category:</label>
                    <select id="itemCategory" name="category[]" style="margin-left: 0px;">
                        <option value="Takeout">Takeout</option>
                        <option value="Homemade">Homemade</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Snacks">Snacks</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="date">Date:</label>
                    <input type="date" id="date" name="date[]" placeholder="Select a date">
                </div>
            </div>`; // Remove all dynamically added entries
    alert('Expenses submitted successfully!');

    renderPieChart(items); // Re-render the pie chart with updated items
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



function renderPieChart(filteredItems) {
    const aggregatedData = calculateCategoryTotals(filteredItems);

    const labels = Object.keys(aggregatedData);    // ['Groceries', 'Bills']
    const dataValues = Object.values(aggregatedData); // [50.50, 120.00]


    // Destroy previous chart instance if it exists to prevent conflicts
    if (categoryPieChart) {
        categoryPieChart.destroy();
    }

    // Only render chart if there's data
    if (labels.length > 0 && categoryChartCanvas) {
        const ctx = categoryChartCanvas.getContext('2d');
        categoryPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cost',
                    data: dataValues,
                    backgroundColor: [ // Add more colors if you expect many categories
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(199, 199, 199, 0.7)',
                        'rgba(83, 102, 255, 0.7)',
                        'rgba(100, 255, 100, 0.7)'
                    ],
                    borderColor: [ // Optional border colors
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(199, 199, 199, 1)',
                         'rgba(83, 102, 255, 1)',
                         'rgba(100, 255, 100, 1)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 4 // Slightly enlarge slice on hover
                }]
            },
            options: {
                responsive: true, // Make chart resize with container
                maintainAspectRatio: false, // Allow chart to fill container height/width better
                plugins: {
                    legend: {
                        position: 'top', // Display legend at the top
                    },
                    title: {
                        display: true,
                        text: 'Spending Distribution by Category'
                    },
                    tooltip: { // Customize tooltips
                         callbacks: {
                              label: function(context) {
                                   let label = context.label || '';
                                   if (label) {
                                       label += ': ';
                                   }
                                   if (context.parsed !== null) {
                                       // Format as currency
                                       label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                                   }
                                   // Calculate percentage
                                   const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
                                   const percentage = ((context.parsed / total) * 100).toFixed(1) + '%';
                                   label += ` (${percentage})`;
                                   return label;
                                }
                         }
                    }
                }
            }
        });
    } else if (categoryChartCanvas) {
       // Optional: Clear canvas or show message if no data
       const ctx = categoryChartCanvas.getContext('2d');
       ctx.clearRect(0, 0, categoryChartCanvas.width, categoryChartCanvas.height);
       // ctx.textAlign = 'center';
       // ctx.fillText('No data to display', categoryChartCanvas.width / 2, categoryChartCanvas.height / 2);
    }
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
    renderPieChart(items); // Render the pie chart with loaded items
});