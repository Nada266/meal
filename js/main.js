// Global variables
let currentSection = 'home';

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load random meals on page load
    fetchRandomMeals();
    
    // Load categories, areas, and ingredients
    fetchCategories();
    fetchAreas();
    fetchIngredients();
    
    // Set up form validation
    setupFormValidation();
});

// Navigation functions
function openNav() {
    document.getElementById("sidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('[id$="-section"]').forEach(section => {
        section.classList.add('d-none');
    });
    document.getElementById('home-section').classList.add('d-none');
    document.getElementById('meal-details').classList.add('d-none');
    
    // Show selected section
    if (sectionId === 'home') {
        document.getElementById('home-section').classList.remove('d-none');
        fetchRandomMeals();
    } else {
        document.getElementById(`${sectionId}-section`).classList.remove('d-none');
    }
    
    currentSection = sectionId;
    closeNav();
}

// API Functions
async function fetchRandomMeals() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();
        displayMeals(data.meals.slice(0, 20), 'meals-grid');
    } catch (error) {
        console.error('Error fetching random meals:', error);
    }
}

async function searchByName() {
    const searchTerm = document.getElementById('search-name').value.trim();
    if (!searchTerm) return;
    
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        displayMeals(data.meals, 'search-results');
    } catch (error) {
        console.error('Error searching by name:', error);
    }
}

async function searchByLetter() {
    const letter = document.getElementById('search-letter').value.trim();
    if (!letter || letter.length !== 1) return;
    
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const data = await response.json();
        displayMeals(data.meals, 'search-results');
    } catch (error) {
        console.error('Error searching by letter:', error);
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const data = await response.json();
        displayCategories(data.categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchMealsByCategory(category) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        displayMeals(data.meals, 'category-meals');
    } catch (error) {
        console.error('Error fetching meals by category:', error);
    }
}

async function fetchAreas() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const data = await response.json();
        displayAreas(data.meals);
    } catch (error) {
        console.error('Error fetching areas:', error);
    }
}

async function fetchMealsByArea(area) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const data = await response.json();
        displayMeals(data.meals, 'area-meals');
    } catch (error) {
        console.error('Error fetching meals by area:', error);
    }
}

async function fetchIngredients() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = await response.json();
        displayIngredients(data.meals);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
    }
}

async function fetchMealsByIngredient(ingredient) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        displayMeals(data.meals, 'ingredient-meals');
    } catch (error) {
        console.error('Error fetching meals by ingredient:', error);
    }
}

async function fetchMealDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        displayMealDetails(data.meals[0]);
    } catch (error) {
        console.error('Error fetching meal details:', error);
    }
}

// Display Functions
function displayMeals(meals, containerId) {
    const container = document.getElementById(containerId);
    if (!meals) {
        container.innerHTML = '<div class="col-12 text-center"><p>No meals found</p></div>';
        return;
    }
    
    container.innerHTML = meals.map(meal => `
        <div class="col-md-3 col-sm-6 mb-4">
            <div class="card meal-card" onclick="fetchMealDetails('${meal.idMeal}')">
                <img src="${meal.strMealThumb}" class="card-img-top meal-img" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                </div>
            </div>
        </div>
    `).join('');
}

function displayCategories(categories) {
    const container = document.getElementById('categories-grid');
    container.innerHTML = categories.map(category => `
        <div class="col-md-3 col-sm-6 mb-4">
            <div class="card" onclick="fetchMealsByCategory('${category.strCategory}')">
                <img src="${category.strCategoryThumb}" class="card-img-top meal-img" alt="${category.strCategory}">
                <div class="card-body">
                    <h5 class="card-title">${category.strCategory}</h5>
                </div>
            </div>
        </div>
    `).join('');
}

function displayAreas(areas) {
    const container = document.getElementById('areas-grid');
    container.innerHTML = areas.map(area => `
        <div class="col-md-3 col-sm-6 mb-4">
            <div class="card" onclick="fetchMealsByArea('${area.strArea}')">
                <div class="card-body text-center">
                    <h5 class="card-title">${area.strArea}</h5>
                </div>
            </div>
        </div>
    `).join('');
}

function displayIngredients(ingredients) {
    const container = document.getElementById('ingredients-grid');
    container.innerHTML = ingredients.map(ingredient => `
        <div class="col-md-2 col-sm-4 mb-3">
            <div class="card" onclick="fetchMealsByIngredient('${ingredient.strIngredient}')">
                <div class="card-body text-center">
                    <h6 class="card-title">${ingredient.strIngredient}</h6>
                </div>
            </div>
        </div>
    `).join('');
}

function displayMealDetails(meal) {
    // Hide current section and show meal details
    document.getElementById(`${currentSection}-section`).classList.add('d-none');
    document.getElementById('home-section').classList.add('d-none');
    document.getElementById('meal-details').classList.remove('d-none');
    
    const container = document.getElementById('meal-details-content');
    
    // Get ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push({
                ingredient: meal[`strIngredient${i}`],
                measure: meal[`strMeasure${i}`]
            });
        } else {
            break;
        }
    }
    
    // Get tags
    const tags = meal.strTags ? meal.strTags.split(',') : [];
    
    container.innerHTML = `
        <div class="col-md-6">
            <img src="${meal.strMealThumb}" class="img-fluid mb-3" alt="${meal.strMeal}">
            <h2>${meal.strMeal}</h2>
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <p><strong>Area:</strong> ${meal.strArea}</p>
            ${tags.length > 0 ? `<p><strong>Tags:</strong> ${tags.join(', ')}</p>` : ''}
        </div>
        <div class="col-md-6">
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
            
            <h3 class="mt-4">Ingredients</h3>
            <ul class="list-group">
                ${ingredients.map(item => `
                    <li class="list-group-item">${item.ingredient} - ${item.measure}</li>
                `).join('')}
            </ul>
            
            ${meal.strYoutube ? `
                <div class="mt-4">
                    <h3>Video Recipe</h3>
                    <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">
                        <i class="fab fa-youtube"></i> Watch on YouTube
                    </a>
                </div>
            ` : ''}
            
            ${meal.strSource ? `
                <div class="mt-3">
                    <a href="${meal.strSource}" target="_blank" class="btn btn-secondary">
                        <i class="fas fa-external-link-alt"></i> View Source
                    </a>
                </div>
            ` : ''}
        </div>
    `;
}

function hideMealDetails() {
    document.getElementById('meal-details').classList.add('d-none');
    document.getElementById(`${currentSection}-section`).classList.remove('d-none');
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const inputs = form.querySelectorAll('input');
    
    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{3,}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[0-9]{10,15}$/,
        age: value => value >= 18,
        password: /^.{8,}$/
    };
    
    // Validate on input
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
            checkFormValidity();
        });
    });
    
    function validateInput(input) {
        const id = input.id;
        const value = input.value;
        let isValid = false;
        
        if (id === 'age') {
            isValid = patterns.age(Number(value));
        } else if (patterns[id]) {
            isValid = patterns[id].test(value);
        }
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
    }
    
    function checkFormValidity() {
        const validInputs = form.querySelectorAll('.is-valid').length;
        submitBtn.disabled = validInputs !== inputs.length;
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submitted successfully!');
        form.reset();
        inputs.forEach(input => input.classList.remove('is-valid'));
        submitBtn.disabled = true;
    });
}