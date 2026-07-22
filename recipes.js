let allRecipes = [];

// Fetch recipes from JSON
async function loadRecipes() {
    const res = await fetch('data/recipes.json');
    allRecipes = await res.json();
    renderCategories();
    renderItems('all');
}

function renderCategories() {
    const cats = ['all', ...new Set(allRecipes.map(r => r.category))];
    const list = document.getElementById('category-list');
    list.innerHTML = '';
    cats.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat === 'all' ? 'All Items' : cat;
        li.dataset.cat = cat;
        if (cat === 'all') li.classList.add('active');
        li.addEventListener('click', () => {
            document.querySelectorAll('#category-list li').forEach(l => l.classList.remove('active'));
            li.classList.add('active');
            renderItems(cat);
        });
        list.appendChild(li);
    });
}

function renderItems(category, search = '') {
    const itemList = document.getElementById('item-list');
    itemList.innerHTML = '';
    
    let filtered = allRecipes.filter(r => category === 'all' || r.category === category);
    if (search) {
        filtered = filtered.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    }

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-icon';
        div.title = item.name;
        div.innerHTML = `<img src="${item.icon}" alt="${item.name}">`;
        div.addEventListener('click', () => renderRecipe(item));
        itemList.appendChild(div);
    });
}

function renderRecipe(item) {
    const display = document.getElementById('recipe-display');
    display.innerHTML = `
        <h2 style="font-family: 'Press Start 2P'; color: var(--mc-yellow); margin-bottom: 20px;">${item.name}</h2>
        <div class="crafting-grid">
            ${Array.from({length: 9}).map((_, i) => {
                const ingredient = item.grid[i];
                const ingData = ingredient ? item.keys[ingredient] : null;
                return `<div class="grid-cell">${ingData ? `<img src="${getIconUrl(ingData.item)}" title="${ingData.item}">` : ''}</div>`;
            }).join('')}
        </div>
        <div class="recipe-result">
            <div class="recipe-arrow">➡</div>
            <div class="recipe-result-icon"><img src="${item.icon}" alt="${item.name}"></div>
        </div>
        <p style="margin-top: 30px; text-align: center; max-width: 400px;">${item.description}</p>
    `;
}

// Helper to get icon URL for ingredients (using minecraft.wiki images)
function getIconUrl(itemName) {
    return `https://minecraft.wiki/images/${itemName.charAt(0).toUpperCase() + itemName.slice(1)}.png`;
}

// Search functionality
document.getElementById('recipe-search').addEventListener('input', (e) => {
    const activeCat = document.querySelector('#category-list li.active').dataset.cat;
    renderItems(activeCat, e.target.value);
});

// Load recipes on DOM ready
document.addEventListener('DOMContentLoaded', loadRecipes);
