// Configuración de tu Google Sheet
const SHEET_ID = "1cCcjvdxZqCnZQzlmtz8chRKi2YrhyD-OoGwcQm71rGU"; 
// Cambia "1" por el nombre exacto de la pestaña si no te funciona (ej: "Hoja1" o "Moda Étnica")
const SHEET_NAME = "1"; 
const API_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

let allProducts = [];

// Renderizar productos en la grilla
function renderProducts(products) {
  const loading = document.getElementById("loading");
  const grid = document.getElementById("productGrid");

  loading.style.display = "none";
  grid.innerHTML = "";

  if (!products || products.length === 0) {
    loading.innerText = "No se encontraron productos en la hoja de cálculo.";
    loading.style.display = "block";
    return;
  }

  products.forEach(product => {
    // Mapeo de columnas en Español a las variables
    const imageUrl = product["Imagen"] || product.image_url || "";
    const title = product["Nombre"] || product.title || "Producto";
    const price = product["Precio"] || product.price || "";
    const affiliateUrl = product["Enlace"] || product.affiliate_url || "#";
    const category = product["Categoria"] || product.category || "Moda";
    const badge = product["Badge"] || product.badge || "";

    const card = document.createElement("article");
    card.className = "card";
    
    const titleText = title.toLowerCase();
    const tagText = category.toLowerCase();
    card.setAttribute("data-search", `${titleText} ${tagText}`);

    card.innerHTML = `
      <div class="card-image-wrapper">
        ${badge ? `<span class="badge">${badge}</span>` : ''}
        <img src="${imageUrl}" alt="${title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300?text=Sin+Imagen'">
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="category">${category}</span>
          <span class="price">${price}</span>
        </div>
        <h2 class="card-title">${title}</h2>
        <a href="${affiliateUrl}" target="_blank" rel="noopener sponsored" class="btn-temu">
          Ver Oferta en Temu
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Cargar datos desde Google Sheets
async function loadProducts() {
  const loading = document.getElementById("loading");
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudo obtener respuesta de la API");
    
    allProducts = await response.json();
    renderProducts(allProducts);

  } catch (error) {
    console.error("Error al conectar con Google Sheets:", error);
    loading.innerText = "Error al cargar el catálogo. Verifica que el permiso de Google Sheets sea 'Cualquier persona con el enlace'.";
  }
}

// Buscador en tiempo real
function filterProducts() {
  const input = document.getElementById('searchInput').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.card');
  const clearBtn = document.getElementById('clearBtn');
  const noResults = document.getElementById('noResults');
  
  const searchWords = input.split(' ').filter(word => word.length > 0);
  let visibleCount = 0;

  clearBtn.style.display = input.length > 0 ? 'block' : 'none';

  cards.forEach(card => {
    const searchText = card.getAttribute('data-search') || '';
    const matchesAll = searchWords.every(word => searchText.includes(word));

    if (matchesAll) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  filterProducts();
}

// Cargar datos automáticamente
loadProducts();