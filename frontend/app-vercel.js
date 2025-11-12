// VERCEL DEMO VERSION - Uses localStorage only, no backend required
// This is a simplified demo for visual presentation
// For full microservices implementation, see local Docker Compose setup

// Configuration
const USE_MOCK_DATA = true; // Always true for Vercel demo
const SET_CODE = 'SV01';
const USER_ID = 1;

// State
let allCards = [];
let collectionCards = [];
let currentView = 'catalog';
let selectedCard = null;

// Mock data - Sample cards from SV01
const MOCK_CARDS = [
    { id: 1, cardNumber: "001", name: "Sprigatito", setName: "Scarlet & Violet", rarity: "COMMON", type: "Grass", artist: "Kouki Saitou", imageUrl: "https://images.pokemontcg.io/sv1/1_hires.png" },
    { id: 2, cardNumber: "002", name: "Floragato", setName: "Scarlet & Violet", rarity: "UNCOMMON", type: "Grass", artist: "Kouki Saitou", imageUrl: "https://images.pokemontcg.io/sv1/2_hires.png" },
    { id: 3, cardNumber: "003", name: "Meowscarada", setName: "Scarlet & Violet", rarity: "RARE", type: "Grass", artist: "5ban Graphics", imageUrl: "https://images.pokemontcg.io/sv1/3_hires.png" },
    { id: 4, cardNumber: "004", name: "Tarountula", setName: "Scarlet & Violet", rarity: "COMMON", type: "Grass", artist: "Kouki Saitou", imageUrl: "https://images.pokemontcg.io/sv1/4_hires.png" },
    { id: 5, cardNumber: "005", name: "Spidops", setName: "Scarlet & Violet", rarity: "UNCOMMON", type: "Grass", artist: "Kouki Saitou", imageUrl: "https://images.pokemontcg.io/sv1/5_hires.png" },
    { id: 10, cardNumber: "010", name: "Fuecoco", setName: "Scarlet & Violet", rarity: "COMMON", type: "Fire", artist: "Kouki Saitou", imageUrl: "https://images.pokemontcg.io/sv1/10_hires.png" },
    { id: 11, cardNumber: "011", name: "Crocalor", setName: "Scarlet & Violet", rarity: "UNCOMMON", type: "Fire", artist: "Kouki Saitou", imageUrl: "https://images.pokemontcg.io/sv1/11_hires.png" },
    { id: 12, cardNumber: "012", name: "Skeledirge", setName: "Scarlet & Violet", rarity: "RARE", type: "Fire", artist: "5ban Graphics", imageUrl: "https://images.pokemontcg.io/sv1/12_hires.png" },
    { id: 20, cardNumber: "020", name: "Quaxly", setName: "Scarlet & Violet", rarity: "COMMON", type: "Water", artist: "Kouki Saitou", imageUrl: "https://images.pokemontcg.io/sv1/20_hires.png" },
    { id: 21, cardNumber: "021", name: "Quaxwell", setName: "Scarlet & Violet", rarity: "UNCOMMON", type: "Water", artist: "Kouki Saitou", imageUrl: "https://images.pokemontcg.io/sv1/21_hires.png" },
    { id: 22, cardNumber: "022", name: "Quaquaval", setName: "Scarlet & Violet", rarity: "RARE", type: "Water", artist: "5ban Graphics", imageUrl: "https://images.pokemontcg.io/sv1/22_hires.png" },
    { id: 30, cardNumber: "030", name: "Pikachu", setName: "Scarlet & Violet", rarity: "COMMON", type: "Electric", artist: "Mitsuhiro Arita", imageUrl: "https://images.pokemontcg.io/sv1/30_hires.png" },
    { id: 50, cardNumber: "050", name: "Lechonk", setName: "Scarlet & Violet", rarity: "COMMON", type: "Colorless", artist: "Sanosuke Sakuma", imageUrl: "https://images.pokemontcg.io/sv1/50_hires.png" },
    { id: 100, cardNumber: "100", name: "Koraidon ex", setName: "Scarlet & Violet", rarity: "RARE_HOLO_EX", type: "Fighting", artist: "5ban Graphics", imageUrl: "https://images.pokemontcg.io/sv1/100_hires.png" },
    { id: 101, cardNumber: "101", name: "Miraidon ex", setName: "Scarlet & Violet", rarity: "RARE_HOLO_EX", type: "Electric", artist: "5ban Graphics", imageUrl: "https://images.pokemontcg.io/sv1/101_hires.png" },
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    initializeSearchAndFilters();
    initializeModal();
    loadCatalog();
    loadCollection();
});

// Theme Toggle
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(icon, currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            switchView(view);
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const viewElement = document.getElementById(`${view}-view`);
    if (viewElement) {
        viewElement.classList.add('active');
    }
    if (view === 'collection') {
        loadCollection();
    } else if (view === 'progress') {
        loadProgress();
    }
}

// Search and Filters
function initializeSearchAndFilters() {
    const searchInput = document.getElementById('search-input');
    const rarityFilter = document.getElementById('rarity-filter');

    searchInput.addEventListener('input', debounce(() => {
        filterCards();
    }, 300));

    rarityFilter.addEventListener('change', () => {
        filterCards();
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function filterCards() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const rarity = document.getElementById('rarity-filter').value;

    let filtered = allCards;

    if (searchTerm) {
        filtered = filtered.filter(card =>
            card.name.toLowerCase().includes(searchTerm) ||
            card.cardNumber.includes(searchTerm)
        );
    }

    if (rarity) {
        filtered = filtered.filter(card => card.rarity === rarity);
    }

    displayCards(filtered);
    document.getElementById('showing-cards').textContent = filtered.length;
}

// Load Catalog (Mock Data)
async function loadCatalog() {
    showLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    allCards = MOCK_CARDS;
    displayCards(allCards);

    document.getElementById('total-cards').textContent = allCards.length;
    document.getElementById('showing-cards').textContent = allCards.length;

    showLoading(false);
}

function displayCards(cards) {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';

    if (cards.length === 0) {
        grid.innerHTML = '<div class="no-cards">No cards found</div>';
        return;
    }

    cards.forEach(card => {
        const cardElement = createCardElement(card);
        grid.appendChild(cardElement);
    });
}

function createCardElement(card) {
    const div = document.createElement('div');
    div.className = 'card-item';

    const isInCollection = collectionCards.some(c => c.cardId === card.id);
    if (isInCollection) {
        div.classList.add('in-collection');
    }

    div.innerHTML = `
        <div class="card-image">
            <img src="${card.imageUrl}" alt="${card.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/245x342?text=Card+Image'">
            ${isInCollection ? '<div class="collection-badge">✓</div>' : ''}
        </div>
        <div class="card-info">
            <div class="card-number">#${card.cardNumber}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-rarity ${card.rarity.toLowerCase()}">${formatRarity(card.rarity)}</div>
        </div>
    `;

    div.addEventListener('click', () => showCardDetail(card));

    return div;
}

function formatRarity(rarity) {
    return rarity.replace(/_/g, ' ').toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Load Collection (localStorage)
async function loadCollection() {
    const stored = localStorage.getItem('pokemonCollection');
    collectionCards = stored ? JSON.parse(stored) : [];
    displayCollection();
    updateCollectionStats();
}

function displayCollection() {
    const grid = document.getElementById('collection-grid');
    grid.innerHTML = '';

    if (collectionCards.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" opacity="0.3">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                </svg>
                <p>Your collection is empty</p>
                <p class="empty-hint">Add cards from the catalog to start your collection</p>
            </div>
        `;
        return;
    }

    collectionCards.forEach(collectionCard => {
        const card = allCards.find(c => c.id === collectionCard.cardId);
        if (card) {
            const cardElement = createCollectionCardElement(card, collectionCard);
            grid.appendChild(cardElement);
        }
    });
}

function createCollectionCardElement(card, collectionCard) {
    const div = document.createElement('div');
    div.className = 'card-item collection-card';

    div.innerHTML = `
        <div class="card-image">
            <img src="${card.imageUrl}" alt="${card.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/245x342?text=Card+Image'">
            <div class="quantity-badge">×${collectionCard.quantity}</div>
        </div>
        <div class="card-info">
            <div class="card-number">#${card.cardNumber}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-condition">${formatCondition(collectionCard.condition)}</div>
        </div>
    `;

    div.addEventListener('click', () => showCardDetail(card));

    return div;
}

function formatCondition(condition) {
    return condition.replace(/_/g, ' ').toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function updateCollectionStats() {
    const uniqueCount = collectionCards.length;
    const totalCount = collectionCards.reduce((sum, card) => sum + card.quantity, 0);

    document.getElementById('unique-owned').textContent = uniqueCount;
    document.getElementById('total-owned').textContent = totalCount;
}

// Load Progress
async function loadProgress() {
    const ownedCardIds = collectionCards.map(c => c.cardId);
    const ownedCards = allCards.filter(card => ownedCardIds.includes(card.id));
    const ownedNumbers = ownedCards.map(card => parseInt(card.cardNumber));

    const standardCount = ownedNumbers.filter(num => num >= 1 && num <= 198).length;
    const fullCount = ownedNumbers.length;

    updateProgressBar('standard', standardCount, 198);
    document.getElementById('standard-count').textContent = standardCount;

    updateProgressBar('full', fullCount, 258);
    document.getElementById('full-count').textContent = fullCount;

    updateProgressBar('complete', fullCount, 516);
    document.getElementById('complete-count').textContent = fullCount;
}

function updateProgressBar(id, current, total) {
    const percentage = (current / total) * 100;
    const progressBar = document.getElementById(`progress-${id}`);
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// Card Detail Modal
function initializeModal() {
    const modal = document.getElementById('card-modal');
    const closeBtn = document.querySelector('.modal-close');
    const addBtn = document.getElementById('add-to-collection');
    const deleteBtn = document.getElementById('delete-from-collection');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    addBtn.addEventListener('click', () => {
        if (selectedCard) {
            addToCollection(selectedCard);
        }
    });

    deleteBtn.addEventListener('click', () => {
        if (selectedCard) {
            deleteFromCollection(selectedCard);
        }
    });
}

function showCardDetail(card) {
    selectedCard = card;
    const modal = document.getElementById('card-modal');

    document.getElementById('modal-card-image').src = card.imageUrl;
    document.getElementById('modal-card-name').textContent = card.name;
    document.getElementById('modal-card-number').textContent = `#${card.cardNumber}`;
    document.getElementById('modal-card-set').textContent = card.setName;
    document.getElementById('modal-card-rarity').textContent = formatRarity(card.rarity);
    document.getElementById('modal-card-type').textContent = card.type || 'N/A';
    document.getElementById('modal-card-artist').textContent = card.artist || 'Unknown';

    const isInCollection = collectionCards.some(c => c.cardId === card.id);
    const addBtn = document.getElementById('add-to-collection');
    const deleteBtn = document.getElementById('delete-from-collection');

    if (isInCollection) {
        addBtn.style.display = 'none';
        deleteBtn.style.display = 'flex';
        deleteBtn.disabled = false;
    } else {
        addBtn.style.display = 'flex';
        deleteBtn.style.display = 'none';
        addBtn.innerHTML = `
            <i class="fa-solid fa-plus"></i>
            Add to Collection
        `;
        addBtn.disabled = false;
    }

    modal.classList.add('active');
}

// Add to Collection (localStorage)
async function addToCollection(card) {
    const newCard = {
        cardId: card.id,
        quantity: 1,
        condition: 'NEAR_MINT',
        isReverseHolo: false,
        addedAt: new Date().toISOString()
    };

    collectionCards.push(newCard);
    localStorage.setItem('pokemonCollection', JSON.stringify(collectionCards));

    await loadCollection();

    const addBtn = document.getElementById('add-to-collection');
    addBtn.textContent = 'Added to Collection!';
    addBtn.disabled = true;

    if (currentView === 'catalog') {
        filterCards();
    }

    showNotification('Card added to collection!');
}

// Delete from Collection (localStorage)
async function deleteFromCollection(card) {
    collectionCards = collectionCards.filter(c => c.cardId !== card.id);
    localStorage.setItem('pokemonCollection', JSON.stringify(collectionCards));

    await loadCollection();

    document.getElementById('card-modal').classList.remove('active');

    if (currentView === 'catalog') {
        filterCards();
    }

    showNotification('Card removed from collection!');
}

// Utility Functions
function showLoading(show) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
