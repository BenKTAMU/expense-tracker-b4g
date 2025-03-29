function setDefaultDate() {
    const dateInput = document.getElementById('date'); // Get the date input field
    const today = new Date(); // Get today's date
    const formattedDate = today.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    dateInput.value = formattedDate; // Set the value of the date input
}


// Example inside your form submission handler
const form = document.getElementById('expense-form');
const clear_button = document.getElementById('clear-expenses'); // Clear button to clear localStorage

const itemsList = document.getElementById('itemsDisplay'); // Where you might display stored items
const allItems = loadItems(); // Load existing items from localStorage

const timeFilter = document.getElementById('time-filter'); // Time filter dropdown


function displayItems(items) {
    itemsList.innerHTML = ` <h1>Items</h1>`; // Clear previous list

    if (items.length === 0) {
        itemsList.innerHTML = '<p>No items to display.</p>'; // Show a message if no items exist
        return;
    }
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-card'; // Add a class for styling
        li.innerHTML = `
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Cost: $${item.cost.toFixed(2)}</p>
                <p>Category: ${item.category}</p>
                <p>Date: ${item.date}</p>
            </div>
        `;
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


document.addEventListener('DOMContentLoaded', () => {
    const items = loadItems();
    displayItems(items);
    //renderPieChart(items); // Render the pie chart with loaded items
    setDefaultDate();
});


function clear(){
    localStorage.clear(); // Clear localStorage
    itemsList.innerHTML = ''; // Clear displayed list
    alert('All entries cleared!'); // Alert user

}



function loadItems() {
    const storedItems = localStorage.getItem('shoppingListData');
    return storedItems ? JSON.parse(storedItems) : []; // Return empty array if nothing stored
}
