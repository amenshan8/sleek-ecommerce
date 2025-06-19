import { products } from './product_data.js';

// --- Dark Mode Toggle ---
const modeToggle = document.getElementById('mode-toggle');
const htmlElement = document.documentElement; // The root <html> element

function enableDarkMode() {
    htmlElement.classList.add('dark-mode');
     if (modeToggle) { // Check if button exists
        modeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
     }
}

function disableDarkMode() {
    htmlElement.classList.remove('dark-mode');
     if (modeToggle) { // Check if button exists
        modeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
     }
}

function toggleDarkMode() {
    if (htmlElement.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Apply saved theme on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    enableDarkMode(); // Apply dark mode immediately without transition on load
} else {
    disableDarkMode(); // Apply light mode immediately if no preference or 'light'
}

// Add event listener to the toggle button
if (modeToggle) { // Check if button exists
    modeToggle.addEventListener('click', toggleDarkMode);
}


// --- SPA Routing ---
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('nav ul li a, .logo a, .category-card, .auth-link a, .product-card');
const mainContent = document.querySelector('.site-main');

function hideAllPages() {
    pages.forEach(page => {
        page.classList.remove('active');
        // Delay display: none to allow transition to start
         setTimeout(() => {
            // Check if the page element still exists and doesn't have the 'active' class
            if (page && !page.classList.contains('active')) {
                 page.style.display = 'none';
            }
         }, 500); // Match CSS transition duration
    });
}

function showPage(id) {
    const page = document.getElementById(id);
    if (page) {
        hideAllPages();
         // Allow display block immediately, opacity handles visibility
        page.style.display = 'block';
         // Force reflow to ensure display: block is applied before transition
         page.offsetHeight;
        page.classList.add('active');
        // Scroll to the top of the main content area
        if (mainContent) { // Add check for mainContent
            mainContent.scrollTop = 0;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Also scroll window for smaller content

        // Specific actions for certain pages
        if (id === 'cart') {
            renderCartWithDiscounts();
        }
         if (id === 'home') {
             // Ensure discount promo is visible/handled if needed
         }
         if (id === 'login') {
             // Clear messages when navigating to login
             if (loginMessageDiv) loginMessageDiv.style.display = 'none';
              if (registerMessageDiv) registerMessageDiv.style.display = 'none'; // Clear register message too
              if (loginForm) loginForm.reset();
         }
          if (id === 'register') {
             // Clear messages when navigating to register
             if (registerMessageDiv) registerMessageDiv.style.display = 'none';
              if (loginMessageDiv) loginMessageDiv.style.display = 'none'; // Clear login message too
              if (registerForm) registerForm.reset();
         }
         if (id === 'product-detail') {
             // displayProductDetail is called by handleRouting before showPage,
             // so reviews will be loaded. No extra action needed here.
         }
    } else {
        // If page ID is not found, default to home
        showPage('home');
    }
}

function handleRouting() {
    const hash = window.location.hash || '#home';
    const pageId = hash.split('?')[0].substring(1); // Get id before query params
    const queryParams = hash.includes('?') ? hash.split('?')[1] : '';

    let targetPageId = pageId || 'home';

    // Handle product detail view
    if (targetPageId.startsWith('product-')) {
        const productId = targetPageId.substring('product-'.length);
        displayProductDetail(productId); // Display product details *before* showing the page
        targetPageId = 'product-detail'; // Route to the generic product detail page
    } else {
         // Clear product detail content when navigating away
        const productDetailContainer = document.querySelector('#product-detail .product-detail-container');
        const productReviewsDiv = document.getElementById('product-reviews'); // Clear reviews too
        if (productDetailContainer) {
            productDetailContainer.innerHTML = ''; // Clear previous product
        }
         if (productReviewsDiv) { // Clear reviews too
             productReviewsDiv.innerHTML = '';
         }
    }


    // Ensure the target page exists, default to home
    const targetPage = document.getElementById(targetPageId);
    if (!targetPage) {
        targetPageId = 'home';
    }

    // Only call showPage if the target page is different or it's the initial load
    // This prevents unnecessary transitions/re-renders if clicking the current page link
    const currentPageId = document.querySelector('.page.active')?.id;
    if (currentPageId !== targetPageId) {
         showPage(targetPageId);
    }


     // Handle category filter on products page
     if (targetPageId === 'products' && queryParams.includes('category=')) {
        const category = queryParams.split('category=')[1];
        const filterSelect = document.getElementById('category-filter');
        if (filterSelect) {
            filterSelect.value = decodeURIComponent(category);
            // filterProducts is called by handleRouting via hashchange implicitly
            // We need to explicitly call it here if the page is already 'products'
            // and only the hash *parameters* changed (e.g. ?category=X to ?category=Y)
             if (currentPageId === 'products') {
                 filterProducts(decodeURIComponent(category));
             }
        }
    } else if (targetPageId === 'products') {
         // If navigating to products without category, reset filter
         const filterSelect = document.getElementById('category-filter');
         if (filterSelect) {
             filterSelect.value = 'All';
             // Only filter if the page is already 'products' or transitioning to it
              if (currentPageId === 'products' || targetPageId === 'products') {
                 filterProducts('All');
              }
         }
    }
}

// Initial load
window.addEventListener('load', () => {
    renderProducts(); // Render products initially (hidden on products page)
    renderRecommendations(); // Render recommendations on home page
    handleRouting(); // Handle the initial hash
    updateCartCount(); // Initial cart count display
    initDiscountFeatures(); // Initialize discount features
    updateHeaderUI(); // Update header based on initial login status
});

// Listen for hash changes
window.addEventListener('hashchange', handleRouting);

// Add click listeners to nav links (optional, hashchange handles it, but good for visual feedback)
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Prevent default if it's a direct link within the SPA structure (e.g., #home)
        // This allows handleRouting via hashchange to manage the view.
        // If you remove this, the browser's default anchor link behavior might interfere.
        // However, handleRouting listens to hashchange which is triggered by default clicks.
        // Let's rely on hashchange listener for cleaner separation.
        // The event delegation on product/category cards is handled separately.
    });
});


// --- Product Listing & Filtering ---
const productListDiv = document.getElementById('product-list');
const categoryFilter = document.getElementById('category-filter');

function renderProducts(filteredProducts = products) {
    if (!productListDiv) return; // Add check

    productListDiv.innerHTML = ''; // Clear current products
    if (filteredProducts.length === 0) {
        productListDiv.innerHTML = '<p>No products found in this category.</p>';
        return;
    }
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.dataset.id = product.id; // Store product ID
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <div>
                     <h3>${product.name}</h3>
                     <p class="price">€${product.price.toFixed(2)}</p>
                </div>
                 <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
         // Make the whole card clickable to view details
        productCard.addEventListener('click', (e) => {
            // Only navigate if the click wasn't on the add to cart button or its icon
            if (!e.target.closest('.add-to-cart')) { // Use closest for robustness
                 window.location.hash = `#product-${product.id}`;
            }
        });
        productListDiv.appendChild(productCard);
    });

     // Add event listeners to the 'Add to Cart' buttons after rendering
     productListDiv.querySelectorAll('.add-to-cart').forEach(button => {
         button.addEventListener('click', (e) => {
             e.stopPropagation(); // Prevent the card click handler
             const productId = button.dataset.id;
             if (productId) { // Ensure product ID exists
                addToCart(productId);
             }
         });
     });
}

function filterProducts(category) {
    // This function is called by handleRouting, which checks if categoryFilter exists
    let filtered = products;
    if (category !== 'All') {
        filtered = products.filter(product => product.category === category);
    }
    renderProducts(filtered);
}

if (categoryFilter) { // Only add listener if element exists
    categoryFilter.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        // Update hash to reflect filter (optional but good for persistence)
        const currentHash = window.location.hash.split('?')[0];
        if (selectedCategory === 'All') {
             // Use replaceState to change URL without adding to history
             // This feels more natural for a filter change
             window.history.replaceState(null, '', currentHash);
             filterProducts('All'); // Explicitly filter if URL doesn't change hash part
        } else {
             // Use replaceState to change URL without adding to history
             window.history.replaceState(null, '', `${currentHash}?category=${encodeURIComponent(selectedCategory)}`);
             filterProducts(decodeURIComponent(selectedCategory)); // Explicitly filter
        }
        // Note: Using replaceState doesn't trigger 'hashchange', so we call filterProducts directly.
        // If using window.location.hash = ..., handleRouting would be called automatically.
    });
}


// --- Product Detail Display ---
const productDetailContainer = document.querySelector('#product-detail .product-detail-container');
const productReviewsDiv = document.getElementById('product-reviews'); // Get reviews div

function displayProductDetail(productId) {
    if (!productDetailContainer || !productReviewsDiv) { // Add checks for both
        console.error("Product detail or reviews container not found!");
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        productDetailContainer.innerHTML = '<p>Product not found.</p>';
        productReviewsDiv.innerHTML = ''; // Clear reviews if product not found
        return;
    }

    productDetailContainer.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-details">
            <h2>${product.name}</h2>
            <p class="price">€${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
             <button class="button primary add-to-cart-button" data-id="${product.id}">Add to Cart</button>
        </div>
    `;

     // Add event listener to the 'Add to Cart' button on the detail page
     const addToCartButton = productDetailContainer.querySelector('.add-to-cart-button');
    if (addToCartButton) { // Add check for button
        addToCartButton.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (id) { // Ensure product ID exists
                addToCart(id);
            }
        });
    }

    // --- Render Reviews ---
    productReviewsDiv.innerHTML = ''; // Clear previous reviews
    if (product.reviews && product.reviews.length > 0) {
        product.reviews.forEach(review => {
            const reviewItemDiv = document.createElement('div');
            reviewItemDiv.classList.add('review-item');

            // Create star rating HTML
            let starsHtml = '<div class="review-rating">';
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rating) {
                    starsHtml += '<i class="fas fa-star"></i>'; // Filled star
                } else {
                    starsHtml += '<i class="far fa-star"></i>'; // Empty star
                }
            }
            starsHtml += '</div>';


            reviewItemDiv.innerHTML = `
                 ${starsHtml}
                <h4 class="review-title">${review.title}</h4>
                <p class="review-text">${review.text}</p>
                <p class="review-meta">by ${review.author} on ${review.date}</p>
            `;
            productReviewsDiv.appendChild(reviewItemDiv);
        });
    } else {
        productReviewsDiv.innerHTML = '<p>No reviews yet.</p>';
    }
}


// --- AI Recommendations (Simulated) ---
const recommendationsGrid = document.getElementById('recommendations-grid');

function renderRecommendations() {
     if (!recommendationsGrid) return; // Add check

    // Simulate AI recommendations by picking a few random products
    const recommended = [];
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random()); // Shuffle array
    const numRecommendations = Math.min(4, shuffledProducts.length); // Limit to 4 or fewer

    for (let i = 0; i < numRecommendations; i++) {
        if (shuffledProducts[i]) { // Ensure product exists
            recommended.push(shuffledProducts[i]);
        }
    }

    recommendationsGrid.innerHTML = '';
    if (recommended.length === 0 && products.length > 0) {
         // Fallback if somehow shuffling/picking failed but products exist
         recommendationsGrid.innerHTML = '<p>Could not load recommendations.</p>';
    } else if (recommended.length === 0 && products.length === 0) {
         recommendationsGrid.innerHTML = '<p>No products available for recommendations.</p>';
    }


    recommended.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
         productCard.dataset.id = product.id; // Store product ID
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                 <div>
                     <h3>${product.name}</h3>
                     <p class="price">€${product.price.toFixed(2)}</p>
                </div>
                 <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
         // Make the whole card clickable to view details
        productCard.addEventListener('click', (e) => {
             // Only navigate if the click wasn't on the add to cart button or its icon
             if (!e.target.closest('.add-to-cart')) { // Use closest for robustness
                window.location.hash = `#product-${product.id}`;
             }
        });
        recommendationsGrid.appendChild(productCard);
    });

     // Add event listeners to the 'Add to Cart' buttons after rendering
     recommendationsGrid.querySelectorAll('.add-to-cart').forEach(button => {
         button.addEventListener('click', (e) => {
             e.stopPropagation();
             const productId = button.dataset.id;
             if (productId) { // Ensure product ID exists
                addToCart(productId);
             }
         });
     });
}


// --- Shopping Cart & Discounts (Simulated) ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// Store applied discount codes (just the code strings)
let appliedDiscounts = JSON.parse(localStorage.getItem('appliedDiscounts')) || [];

const cartCountSpan = document.getElementById('cart-count');
const cartItemsDiv = document.getElementById('cart-items');
const cartSummaryDiv = document.getElementById('cart-summary');
const cartSubtotalSpan = document.getElementById('cart-subtotal'); // Added subtotal span
const discountSummaryLine = document.getElementById('discount-summary-line'); // Added discount summary line
const cartDiscountSpan = document.getElementById('cart-discount'); // Added discount span
const cartTotalSpan = document.getElementById('cart-total');

// Discount specific elements
const discountCodeInput = document.getElementById('discount-code-input');
const applyDiscountButton = document.getElementById('apply-discount-button');
const discountErrorMessageDiv = document.getElementById('discount-error-message');
const appliedDiscountsListDiv = document.getElementById('applied-discounts-list');

// Simulated available discount codes (Admin Feature limitation)
const availableDiscountCodes = {
    SEEK15: { percentage: 15, minCartValue: 50 },
    SEEK30: { percentage: 30, minCartValue: 70 },
    // Add more codes here if needed
};

function updateCartCount() {
    if (!cartCountSpan) return; // Add check
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
     // Show/hide cart count badge
    if (totalItems > 0) {
         cartCountSpan.style.display = 'inline';
    } else {
        cartCountSpan.style.display = 'none';
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('appliedDiscounts', JSON.stringify(appliedDiscounts)); // Save applied discounts
}

function calculateCartTotalBeforeDiscount() {
    let total = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    });
    return total;
}

function calculateTotalDiscountAmount(cartTotal) {
    let totalDiscount = 0;
    const maxDiscount = cartTotal * 0.5; // Max 50% of cart value

    appliedDiscounts.forEach(code => {
        const discount = availableDiscountCodes[code];
        if (discount) {
             // Calculate potential discount for this code
            const potentialDiscount = cartTotal * (discount.percentage / 100);
             // Add to total discount *if* it doesn't exceed the max discount cap
             // This simplified logic applies discounts sequentially or sums them and caps,
             // which might not be true "multiple codes" logic but fits the 50% cap.
             // A more complex logic might consider which combination yields the max discount.
             // For simplicity, we'll just sum up the potential discounts and then cap the sum.
             totalDiscount += potentialDiscount;
        }
        // Note: Real multi-discount logic is complex (e.g., apply % then fixed, BOGO, etc.)
        // This simulation just sums eligible % discounts and caps the total.
    });

     // Apply the 50% cap to the *total* calculated discount
     return Math.min(totalDiscount, maxDiscount);
}

function renderCartWithDiscounts() {
    if (!cartItemsDiv || !cartSummaryDiv || !cartSubtotalSpan || !cartDiscountSpan || !cartTotalSpan || !discountSummaryLine || !appliedDiscountsListDiv) {
        console.error("Cart rendering elements not found!");
        return;
    }

    cartItemsDiv.innerHTML = ''; // Clear current items
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        cartSummaryDiv.style.display = 'none';
        discountSummaryLine.style.display = 'none'; // Hide discount line if cart is empty
        appliedDiscounts = []; // Clear applied discounts if cart becomes empty
        saveCart(); // Save empty cart and discounts
        updateCartCount();
        return;
    }

    cartSummaryDiv.style.display = 'block';
    let subtotal = calculateCartTotalBeforeDiscount();
    let totalDiscount = calculateTotalDiscountAmount(subtotal);
    let finalTotal = subtotal - totalDiscount;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            // const itemTotal = product.price * item.quantity; // Not displayed per item currently

            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-details">
                    <h4>${product.name}</h4>
                    <p class="price">€${product.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-actions">
                    <button class="icon-button small decrease-quantity" data-id="${product.id}"><i class="fas fa-minus"></i></button>
                    <input type="number" value="${item.quantity}" min="1" data-id="${product.id}">
                     <button class="icon-button small increase-quantity" data-id="${product.id}"><i class="fas fa-plus"></i></button>
                    <button class="remove-item" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsDiv.appendChild(cartItemDiv);
        }
    });

    // Render applied discounts list
    appliedDiscountsListDiv.innerHTML = ''; // Clear current list
    if (appliedDiscounts.length > 0) {
         appliedDiscounts.forEach(code => {
             const discountItemDiv = document.createElement('div');
             discountItemDiv.classList.add('applied-discount-item');
             discountItemDiv.innerHTML = `
                 <span>${code} Applied</span>
                 <button class="remove-discount" data-code="${code}"><i class="fas fa-times"></i> Remove</button>
             `;
             appliedDiscountsListDiv.appendChild(discountItemDiv);
         });
    }

    cartSubtotalSpan.textContent = `€${subtotal.toFixed(2)}`;
    if (totalDiscount > 0) {
        cartDiscountSpan.textContent = `€${totalDiscount.toFixed(2)}`;
        discountSummaryLine.style.display = 'block';
    } else {
        discountSummaryLine.style.display = 'none';
    }
    cartTotalSpan.textContent = `€${finalTotal.toFixed(2)}`;

    updateCartCount();
    saveCart(); // Save updated cart and applied discounts

    // Re-add event listeners after rendering cart items
    cartItemsDiv.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('button')?.dataset.id; // Use optional chaining and closest
            if (productId) {
                 removeFromCart(productId);
            }
        });
    });

     cartItemsDiv.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('button')?.dataset.id; // Use optional chaining and closest
            if (productId) {
                 changeQuantity(productId, 1);
            }
        });
    });

     cartItemsDiv.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('button')?.dataset.id; // Use optional chaining and closest
            if (productId) {
                 changeQuantity(productId, -1);
            }
        });
    });

    cartItemsDiv.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = e.target.dataset.id;
            const newQuantity = parseInt(e.target.value, 10);
             if (productId && !isNaN(newQuantity) && newQuantity >= 1) {
                 changeQuantity(productId, newQuantity, true); // Set exact quantity
             } else {
                 renderCartWithDiscounts(); // Re-render if input is invalid or productId missing
             }
        });
    });

     // Re-add event listeners for removing applied discounts
     appliedDiscountsListDiv.querySelectorAll('.remove-discount').forEach(button => {
         button.addEventListener('click', (e) => {
             const code = e.target.closest('button')?.dataset.code;
             if (code) {
                 removeAppliedDiscount(code);
             }
         });
     });
}

function addToCart(productId) {
    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity++;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }
    // alert('Item added to cart!'); // Simple feedback - can be annoying
    console.log(`Added item ${productId} to cart. Cart:`, cart); // Use console.log instead of alert
    updateCartCount();
    saveCart(); // Save cart changes
    // If we are on the cart page, re-render it to show the new item/quantity
    if (document.getElementById('cart')?.classList.contains('active')) {
        renderCartWithDiscounts();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
     console.log(`Removed item ${productId} from cart. Cart:`, cart);
    renderCartWithDiscounts(); // Re-render the cart display
}

function changeQuantity(productId, delta, exact = false) {
    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
        if (exact) {
             cart[itemIndex].quantity = delta;
        } else {
            cart[itemIndex].quantity += delta;
        }

        if (cart[itemIndex].quantity <= 0) {
            removeFromCart(productId); // Remove if quantity is zero or less
        } else {
             console.log(`Changed quantity for ${productId}. Cart:`, cart);
            renderCartWithDiscounts(); // Re-render to update quantity and total
        }
    }
}

function displayDiscountError(message) {
     if (discountErrorMessageDiv) {
        discountErrorMessageDiv.textContent = message;
        discountErrorMessageDiv.style.display = 'block';
        // Hide after a few seconds
        setTimeout(() => {
            if(discountErrorMessageDiv) discountErrorMessageDiv.style.display = 'none';
        }, 5000);
     }
}

function applyDiscountCode() {
    if (!discountCodeInput || !appliedDiscountsListDiv) return;

    const code = discountCodeInput.value.trim().toUpperCase();
    discountCodeInput.value = ''; // Clear input
    displayDiscountError(''); // Clear previous errors

    const discount = availableDiscountCodes[code];

    if (!discount) {
        displayDiscountError(`Invalid discount code: "${code}"`);
        return;
    }

    // Check if already applied
    if (appliedDiscounts.includes(code)) {
         displayDiscountError(`Discount code "${code}" is already applied.`);
         return;
    }

    // Check minimum cart value
    const currentCartTotal = calculateCartTotalBeforeDiscount();
    if (currentCartTotal < discount.minCartValue) {
        displayDiscountError(`Minimum order value of €${discount.minCartValue.toFixed(2)} required for code "${code}".`);
        return;
    }

    // --- Simulated "Server-Side" / "Usage Restriction" ---
    // In this simulation, we won't allow applying the same code multiple times in one session.
    // A real server would check expiration, total uses, per-user uses, etc.
    // We already checked if it's in the appliedDiscounts array.

    // If all checks pass, apply the discount
    appliedDiscounts.push(code);
    renderCartWithDiscounts(); // Re-render cart to show applied discount and updated total
     // Optional: Display a success message briefly
     displayDiscountError(`"${code}" applied successfully!`);
}

function removeAppliedDiscount(code) {
    const index = appliedDiscounts.indexOf(code);
    if (index > -1) {
        appliedDiscounts.splice(index, 1);
        renderCartWithDiscounts(); // Re-render cart to update total
         saveCart(); // Save changes
         // Optional: Display a success message briefly
         displayDiscountError(`"${code}" removed.`);
    }
}

function initDiscountFeatures() {
    // Add event listeners for the discount section on the cart page
    if (applyDiscountButton) {
        applyDiscountButton.addEventListener('click', applyDiscountCode);
         // Allow pressing Enter in the input field
        if (discountCodeInput) {
            discountCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent form submission if input is in a form
                    applyDiscountCode();
                }
            });
        }
    }

     // Add event listeners for "Copy Code" buttons on the homepage
     const copyButtons = document.querySelectorAll('.copy-code-button');
     const copyFeedbackDiv = document.getElementById('copy-feedback');
     copyButtons.forEach(button => {
         button.addEventListener('click', async (e) => {
             // Find the button ancestor if the click was on the icon
             const targetButton = e.target.closest('.copy-code-button');
             if (!targetButton) return;

             const codeToCopy = targetButton.dataset.code;
             if (codeToCopy) {
                 try {
                     await navigator.clipboard.writeText(codeToCopy);
                     console.log('Code copied to clipboard:', codeToCopy);
                     if (copyFeedbackDiv) {
                        copyFeedbackDiv.textContent = `"${codeToCopy}" copied!`;
                        copyFeedbackDiv.style.display = 'block';
                        setTimeout(() => {
                            if(copyFeedbackDiv) copyFeedbackDiv.style.display = 'none';
                        }, 2000); // Hide feedback after 2 seconds
                     }
                 } catch (err) {
                     console.error('Failed to copy code: ', err);
                      if (copyFeedbackDiv) {
                         copyFeedbackDiv.textContent = `Failed to copy code. Please copy manually: ${codeToCopy}`;
                         copyFeedbackDiv.style.display = 'block';
                         setTimeout(() => {
                             if(copyFeedbackDiv) copyFeedbackDiv.style.display = 'none';
                         }, 5000);
                      }
                 }
             }
         });
     });

     // Re-render cart with discounts when the cart page becomes active
    const cartPage = document.getElementById('cart');
    if (cartPage) {
        // Using hashchange listener instead of transitionend for robustness with direct URL access
        // The handleRouting function calls showPage, which now calls renderCartWithDiscounts if the page is 'cart'.
        // No extra listener needed here for activation via routing.
    }

    // Ensure initial state from localStorage is loaded (handled at top where cart and appliedDiscounts are initialized)
}


// --- Form Submissions (Simulated) ---
const contactForm = document.getElementById('contact-form');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const contactMessageDiv = document.getElementById('contact-message'); // Renamed for clarity
const loginMessageDiv = document.getElementById('login-message'); // Renamed for clarity
const registerMessageDiv = document.getElementById('register-message'); // Renamed for clarity

// --- Simulated Authentication ---
const LOCALSTORAGE_USER_KEY = 'sleekstore_user';
const LOCALSTORAGE_LOGGED_IN_KEY = 'sleekstore_logged_in';

// Very basic simulation: Store email and a *plaintext* password. Not secure in real app.
function saveUserToLocalStorage(name, email, password) {
    const user = { name, email, password }; // WARNING: Storing plaintext password is NOT secure
    localStorage.setItem(LOCALSTORAGE_USER_KEY, JSON.stringify(user));
}

function checkUserFromLocalStorage(email, password) {
    const userJson = localStorage.getItem(LOCALSTORAGE_USER_KEY);
    if (!userJson) {
        return false; // No user registered
    }
    try {
        const user = JSON.parse(userJson);
        // WARNING: Comparing plaintext password is NOT secure
        return user.email === email && user.password === password;
    } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        return false; // Handle potential corruption
    }
}

function simulateLogin(email) {
    localStorage.setItem(LOCALSTORAGE_LOGGED_IN_KEY, 'true');
    localStorage.setItem('sleekstore_logged_in_email', email); // Store email to display
    updateHeaderUI();
    // Redirect to home or previous page after login
    window.location.hash = '#home';
    // Display simulated success message on the login page briefly before redirect
    if (loginMessageDiv) {
        loginMessageDiv.textContent = `Logged in as ${email}! (Simulated)`;
        loginMessageDiv.classList.remove('error-message');
        loginMessageDiv.classList.add('success-message');
        loginMessageDiv.style.display = 'block';
        setTimeout(() => {
             if (loginMessageDiv) loginMessageDiv.style.display = 'none';
        }, 3000); // Short delay before redirect
    }
}

function simulateLogout() {
    localStorage.removeItem(LOCALSTORAGE_LOGGED_IN_KEY);
    localStorage.removeItem('sleekstore_logged_in_email');
    updateHeaderUI();
    // Redirect to home or login page after logout
    window.location.hash = '#home';
}

function isLoggedIn() {
    return localStorage.getItem(LOCALSTORAGE_LOGGED_IN_KEY) === 'true';
}

function getLoggedInUserEmail() {
     return localStorage.getItem('sleekstore_logged_in_email');
}


function updateHeaderUI() {
    const headerActionsDiv = document.querySelector('.site-header .header-actions');
    if (!headerActionsDiv) return;

    const isLoggedInStatus = isLoggedIn();
    const userEmail = getLoggedInUserEmail();

    // Remove existing Login/Register/User/Logout elements
    headerActionsDiv.querySelectorAll('.auth-link-item, .user-info-item').forEach(el => el.remove());

    if (isLoggedInStatus) {
        // Add Welcome message and Logout button
        const userInfoSpan = document.createElement('span');
        userInfoSpan.classList.add('user-info-item');
        userInfoSpan.textContent = `Welcome${userEmail ? ', ' + userEmail.split('@')[0] : ''}!`; // Display part before @
        userInfoSpan.style.marginRight = '15px'; // Space before cart icon
        userInfoSpan.style.fontWeight = '500';

        const logoutButton = document.createElement('button');
        logoutButton.classList.add('button', 'secondary', 'small', 'user-info-item');
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', simulateLogout);

        // Find the position before the cart icon or dark mode toggle
        const cartButton = headerActionsDiv.querySelector('.icon-button[href="#cart"]');
        const modeToggle = headerActionsDiv.querySelector('#mode-toggle');

         // Insert elements before the cart or toggle button, or at the end
        if (cartButton) {
             headerActionsDiv.insertBefore(logoutButton, cartButton);
             headerActionsDiv.insertBefore(userInfoSpan, logoutButton);
        } else if (modeToggle) {
             headerActionsDiv.insertBefore(logoutButton, modeToggle);
             headerActionsDiv.insertBefore(userInfoSpan, logoutButton);
        }
         else {
            headerActionsDiv.appendChild(userInfoSpan);
            headerActionsDiv.appendChild(logoutButton);
        }


    } else {
        // Add Login and Register buttons
        const loginLink = document.createElement('a');
        loginLink.href = '#login';
        loginLink.classList.add('button', 'primary', 'small', 'auth-link-item');
        loginLink.textContent = 'Login';

        const registerLink = document.createElement('a');
        registerLink.href = '#register';
        registerLink.classList.add('button', 'secondary', 'small', 'auth-link-item');
        registerLink.textContent = 'Register';

         // Find the position before the cart icon or dark mode toggle
         const cartButton = headerActionsDiv.querySelector('.icon-button[href="#cart"]');
         const modeToggle = headerActionsDiv.querySelector('#mode-toggle');

         // Insert elements before the cart or toggle button, or at the end
        if (cartButton) {
            headerActionsDiv.insertBefore(registerLink, cartButton);
            headerActionsDiv.insertBefore(loginLink, registerLink);
        } else if (modeToggle) {
             headerActionsDiv.insertBefore(registerLink, modeToggle);
             headerActionsDiv.insertBefore(loginLink, registerLink);
        }
        else {
             headerActionsDiv.appendChild(loginLink);
             headerActionsDiv.appendChild(registerLink);
         }


    }
}


if (contactForm && contactMessageDiv) { // Add checks
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulate sending data
        console.log('Contact form submitted!');
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries()); // Convert to plain object
        console.log('Form Data:', data);

        contactForm.reset();

        contactMessageDiv.textContent = 'Your message has been sent! We will get back to you soon.';
        contactMessageDiv.classList.remove('error-message');
        contactMessageDiv.classList.add('success-message');
        contactMessageDiv.style.display = 'block';
        setTimeout(() => {
            if (contactMessageDiv) contactMessageDiv.style.display = 'none'; // Add check inside timeout
        }, 5000); // Hide message after 5 seconds
    });
}

if (loginForm && loginMessageDiv) { // Add checks
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        displayAuthMessage(loginMessageDiv, '', false); // Clear previous messages

        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');

        if (!emailInput || !passwordInput) {
             displayAuthMessage(loginMessageDiv, 'Form elements missing!', true);
             return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            displayAuthMessage(loginMessageDiv, 'Please enter both email and password.', true);
            return;
        }

        // Simulate login logic using localStorage
        const userRegistered = localStorage.getItem(LOCALSTORAGE_USER_KEY);

        if (!userRegistered) {
             displayAuthMessage(loginMessageDiv, 'No user is currently registered. Please login first.', true);
             return;
        }

        if (checkUserFromLocalStorage(email, password)) {
            simulateLogin(email); // Handles UI update and redirect
             loginForm.reset(); // Reset form fields
        } else {
             displayAuthMessage(loginMessageDiv, 'Invalid email or password.', true);
        }
    });
}

if (registerForm && registerMessageDiv) { // Add checks
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        displayAuthMessage(registerMessageDiv, '', false); // Clear previous messages

        const nameInput = document.getElementById('register-name');
        const emailInput = document.getElementById('register-email');
        const passwordInput = document.getElementById('register-password');
        const confirmPasswordInput = document.getElementById('register-confirm-password');

         if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
             displayAuthMessage(registerMessageDiv, 'Form elements missing!', true);
             return;
         }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!name || !email || !password || !confirmPassword) {
            displayAuthMessage(registerMessageDiv, 'Please fill in all fields.', true);
            return;
        }

        if (password !== confirmPassword) {
            displayAuthMessage(registerMessageDiv, 'Passwords do not match.', true);
            return;
        }

         // Simulate registration logic: Save user to localStorage
         // WARNING: This is a highly insecure simulation for demonstration.
         // In a real app, you would send this to a server, hash the password,
         // and store it securely in a database.
        try {
            // Check if a user is already registered (we only support one simulated user)
             if (localStorage.getItem(LOCALSTORAGE_USER_KEY)) {
                 displayAuthMessage(registerMessageDiv, 'A user is already registered. Please login or clear localStorage.', true);
                 return;
             }

            saveUserToLocalStorage(name, email, password);
            displayAuthMessage(registerMessageDiv, 'Registration successful! You can now login.', false);
            registerForm.reset(); // Reset form fields

             // Optional: Auto-login after registration
             // simulateLogin(email); // Decided against auto-login for clearer flow
        } catch (e) {
             console.error("Error during simulated registration:", e);
             displayAuthMessage(registerMessageDiv, 'An error occurred during registration.', true);
        }
    });
}

// Helper function to display auth messages
function displayAuthMessage(element, message, isError) {
     if (!element) return;
     element.textContent = message;
     element.classList.remove('success-message', 'error-message');
     element.classList.add(isError ? 'error-message' : 'success-message');
     element.style.display = message ? 'block' : 'none';
     // Optionally hide success message after a delay
     if (!isError && message) {
        setTimeout(() => {
             if (element) element.style.display = 'none';
        }, 5000);
     }
}


// --- Chatbot Integration ---
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotBody = document.getElementById('chatbot-body');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSendButton = document.getElementById('chatbot-send');

let conversationHistory = []; // Store chat history

function displayMessage(sender, text) {
    if (!chatbotBody) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `${sender}-message`);
    messageDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`; // Replace newlines with <br>
    chatbotBody.appendChild(messageDiv);
    // Auto-scroll to the bottom
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

async function sendChatMessage(message) {
    if (!chatbotBody || !chatbotInput || !chatbotSendButton) return;

    displayMessage('user', message);
    conversationHistory.push({ role: "user", content: message });

    chatbotInput.value = ''; // Clear input field
    chatbotSendButton.disabled = true; // Disable send button while thinking
    chatbotInput.disabled = true; // Disable input field while thinking

    // Add a "typing" indicator (optional)
     const typingIndicator = document.createElement('div');
     typingIndicator.classList.add('chat-message', 'bot-message', 'typing-indicator');
     typingIndicator.innerHTML = '<p>...</p>';
     chatbotBody.appendChild(typingIndicator);
     chatbotBody.scrollTop = chatbotBody.scrollHeight; // Scroll to see indicator


    try {
        // Keep only the last 10 messages + system message
        const historyToSend = conversationHistory.slice(-10);

        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are SleekBot, a helpful and friendly support assistant for SleekStore, an e-commerce website.
                    Your primary goal is to help customers find products, answer questions about items (like price, description, category), and inform them about general aspects of the store (like contact info, cart, and available discounts).
                    Do not invent deals or products not mentioned.
                    The current available discount codes are: SEEK15 (15% off on orders above €50) and SEEK30 (30% off on orders above €70). You can mention these codes if the user asks about discounts or saving money.
                    If a customer asks about a specific product, try to provide the name, category, price, and description if you can infer it or if it's in the conversation history. You can also look up products in the 'products' array if the user asks for details about an item by name.
                    The available categories are: Electronics, Mobile Devices, Clothing, Lifestyle, Home Appliances, and Outdoor Gear.
                    If asked about something completely unrelated to products, discounts, or SleekStore, politely state that you are limited to assisting with store-related queries.
                    Keep responses concise and friendly.`,
                },
                ...historyToSend,
            ],
        });

        const botResponse = completion.content;

        // Remove typing indicator
        if (typingIndicator.parentNode) {
            chatbotBody.removeChild(typingIndicator);
        }


        displayMessage('bot', botResponse);
        conversationHistory.push({ role: "assistant", content: botResponse });

    } catch (error) {
        console.error("Chatbot API error:", error);
        // Remove typing indicator
        if (typingIndicator.parentNode) {
            chatbotBody.removeChild(typingIndicator);
        }
        displayMessage('bot', "Sorry, I'm having trouble connecting right now. Please try again later.");
         // Decide if you want to add the error message to history
         // conversationHistory.push({ role: "assistant", content: "..." });
    } finally {
        chatbotSendButton.disabled = false; // Re-enable send button
        chatbotInput.disabled = false; // Re-enable input field
        chatbotInput.focus(); // Put focus back on the input field
    }
}

if (chatbotToggle && chatbotWindow && chatbotClose && chatbotBody && chatbotInput && chatbotSendButton) {
     // Set initial transition properties if elements exist
    chatbotWindow.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
    chatbotWindow.style.display = 'none'; // Ensure it's hidden initially

    chatbotToggle.addEventListener('click', () => {
        if (chatbotWindow.style.display === 'none') {
            chatbotWindow.style.display = 'flex';
            // Add active class after display is block to trigger transition
            setTimeout(() => {
                 if (chatbotWindow) chatbotWindow.classList.add('active');
            }, 10);
        } else {
             chatbotWindow.classList.remove('active');
             // Delay setting display: none to allow transition to finish
            setTimeout(() => {
                 if (chatbotWindow) chatbotWindow.style.display = 'none';
            }, 300); // Match CSS transition
        }
    });

    chatbotClose.addEventListener('click', () => {
         chatbotWindow.classList.remove('active');
        setTimeout(() => {
             if (chatbotWindow) chatbotWindow.style.display = 'none';
        }, 300); // Match CSS transition
    });

    // Send message on button click
    chatbotSendButton.addEventListener('click', () => {
        const message = chatbotInput.value.trim();
        if (message) {
            sendChatMessage(message);
        }
    });

    // Send message on Enter key press in input field
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission
            const message = chatbotInput.value.trim();
            if (message) {
                sendChatMessage(message);
            }
        }
    });

    // Initial bot message is already in HTML, add it to history
    // Check if chatbotBody has any messages, add initial message only if not.
    if (chatbotBody.children.length <= 0) {
         displayMessage('bot', "Hello! I'm SleekBot, your virtual assistant. How can I help you today? Ask me about products!");
    }
     // Always add initial message to history to prime the bot context if history is empty
    if (conversationHistory.length === 0) {
        conversationHistory.push({ role: "assistant", content: "Hello! I'm SleekBot, your virtual assistant. How can I help you today? Ask me about products!" });
    }


}


// Helper to ensure display: block on initial load for the active page
// This listener seems redundant with the 'load' listener calling handleRouting,
// which in turn calls showPage. The showPage function already sets display: block.
// Keeping it just in case, but adding checks.
window.addEventListener('DOMContentLoaded', () => {
     // Initial rendering of products, recommendations etc. happens before this
    const initialHash = window.location.hash || '#home';
    const initialPageId = initialHash.split('?')[0].substring(1) || 'home';
    const initialPage = document.getElementById(initialPageId);

    // Ensure all pages are initially hidden *except* the determined initial one
    pages.forEach(page => {
        if (page && page.id !== initialPageId) {
             page.style.display = 'none';
             page.classList.remove('active');
        }
    });

    if (initialPage) {
        initialPage.style.display = 'block';
        initialPage.classList.add('active'); // Ensure initial page is active and visible
         // If it's a product detail page, display the content
        if (initialPageId.startsWith('product-')) {
             const productId = initialPageId.substring('product-'.length);
             displayProductDetail(productId);
        }
         // If it's the products page with a category hash, apply filter
         if (initialPageId === 'products' && initialHash.includes('category=')) {
             const category = initialHash.split('category=')[1];
             const filterSelect = document.getElementById('category-filter');
             if (filterSelect) {
                 filterSelect.value = decodeURIComponent(category);
                 filterProducts(decodeURIComponent(category));
             }
         } else if (initialPageId === 'products') {
             // Ensure filter is 'All' if no category in hash
             const filterSelect = document.getElementById('category-filter');
             if (filterSelect) {
                 filterSelect.value = 'All';
                 filterProducts('All');
             }
         } else if (initialPageId === 'cart') {
             // If the initial page is the cart, render it
             renderCartWithDiscounts();
         }
          else if (initialPageId === 'login') {
             // Clear messages on load if login page is active
             if (loginMessageDiv) loginMessageDiv.style.display = 'none';
          }
          else if (initialPageId === 'register') {
             // Clear messages on load if register page is active
             if (registerMessageDiv) registerMessageDiv.style.display = 'none';
          }
    } else {
        // Fallback to home if initial page ID from hash doesn't exist
         const homePage = document.getElementById('home');
         if (homePage) {
            homePage.style.display = 'block';
            homePage.classList.add('active');
         } else {
             console.error("Error: Home page element '#home' not found!");
             // Optionally display an user-friendly error message here
         }
    }

    // Initialize header UI based on login status on DOMContentLoaded
    updateHeaderUI();
});

// Add general error handling (though unhandled rejections might bypass this)
window.addEventListener('error', (event) => {
    console.error("Uncaught Error:", event.error);
    // You could display a user-friendly error message here
});

window.addEventListener('unhandledrejection', (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    // You could display a user-friendly error message here
});