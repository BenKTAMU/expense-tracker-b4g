let categoryPieChart = null; // Variable to hold the chart instance

const week1Filter = document.getElementById('week1-filter');
const week2Filter = document.getElementById('week2-filter');
const compareButton = document.getElementById('compare-weeks');
const week1ChartCanvas = document.getElementById('week1PieChart');
const week2ChartCanvas = document.getElementById('week2PieChart');
let week1PieChart = null;
let week2PieChart = null;
const allTimeChartCanvas = document.getElementById('allTimePieChart'); // Canvas for all-time chart
let allTimePieChart = null; // Variable to hold the all-time chart instance


const timeFilter = document.getElementById('time-filter'); // Time filter dropdown

function renderAllTimeChart() {
    const items = loadItems(); // Load all items from localStorage
    allTimePieChart = renderComparisonPieChart(items, allTimeChartCanvas, allTimePieChart, 'All Time Spending');
}

function loadItems() {
    const storedItems = localStorage.getItem('shoppingListData');
    return storedItems ? JSON.parse(storedItems) : []; // Return empty array if nothing stored
}
const allItems = loadItems(); // Load existing items from localStorage

week1Filter.addEventListener('change', updateComparisonCharts);
week2Filter.addEventListener('change', updateComparisonCharts);

function updateComparisonCharts() {
    const week1Value = week1Filter.value;
    const week2Value = week2Filter.value;

    const items = loadItems(); // Load all items from localStorage

    // Filter items for each week
    const week1Items = filterItemsByDate(items, week1Value);
    const week2Items = filterItemsByDate(items, week2Value);

    // Render the pie charts
    week1PieChart = renderComparisonPieChart(week1Items, week1ChartCanvas, week1PieChart, 'Week 1 Spending');
    week2PieChart = renderComparisonPieChart(week2Items, week2ChartCanvas, week2PieChart, 'Week 2 Spending');
}

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



document.addEventListener('DOMContentLoaded', () => {
    renderAllTimeChart();
    updateComparisonCharts();
});