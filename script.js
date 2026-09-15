/**
 * ZENN Luxury Fashion House - Global Application Architecture
 * @version 3.0.0 (2026 Production Configuration)
 * @pattern Architectural OOP State Machine & Fail-Safe Module
 */

class ZennApp {
    constructor() {
        // --- 🔒 CENTRAL SYSTEM STATE ---
        this.state = {
            cart: [],
            currency: '$'
        };

        // --- 📌 STRUCTURAL REGISTRY (DOM MAP) ---
        this.dom = {
            menuToggleBtn: document.getElementById('menuToggleBtn'),
            navMenu: document.getElementById('navMenu'),
            searchBtn: document.getElementById('searchBtn'),
            closeSearch: document.getElementById('closeSearch'),
            searchOverlay: document.getElementById('searchOverlay'),
            
            cartBtn: document.getElementById('cartBtn'),
            closeCartBtn: document.getElementById('closeCartBtn'),
            cartDrawer: document.getElementById('cartDrawer'),
            cartDrawerOverlay: document.getElementById('cartDrawerOverlay'),
            
            cartCount: document.getElementById('cartCount'),
            cartHeaderCount: document.getElementById('cartHeaderCount'),
            cartItemsContainer: document.getElementById('cartItemsContainer'),
            cartTotalAmount: document.getElementById('cartTotalAmount'),
            
            copyPromoBtn: document.getElementById('copyPromoBtn'),
            promoCodeText: document.getElementById('promoCodeText'),
            sizeButtons: document.querySelectorAll('.size-opt'),
            addToCartButtons: document.querySelectorAll('.add-to-cart-btn')
        };

        this.init();
    }

    init() {
        this.registerOverlayEvents();
        this.registerProductEvents();
        this.registerUtilityEvents();
        console.log('💎 ZENN Enterprise Core Engine Fired Up Successfully.');
    }

    // -------------------------------------------------------------------------
    //  1. INTERACTIVE SYSTEM CONTROLLER (OVERLAYS & INTERFACES)
    // -------------------------------------------------------------------------
    registerOverlayEvents() {
        const { menuToggleBtn, navMenu, searchBtn, searchOverlay, closeSearch, cartBtn, closeCartBtn, cartDrawerOverlay } = this.dom;

        // --- Mobile Responsive Drawer Controller ---
        if (menuToggleBtn && navMenu) {
            menuToggleBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const icon = menuToggleBtn.querySelector('i');
                if (icon) icon.className = navMenu.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            });

            // Auto collapse framework on menu redirection
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    const icon = menuToggleBtn.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-bars';
                });
            });
        }

        // --- Cinematic Search Controller ---
        if (searchBtn && searchOverlay && closeSearch) {
            searchBtn.addEventListener('click', () => searchOverlay.classList.add('active'));
            closeSearch.addEventListener('click', () => searchOverlay.classList.remove('active'));
        }

        // --- Shopping Bag Interface Controller ---
        if (cartBtn && closeCartBtn && cartDrawerOverlay) {
            cartBtn.addEventListener('click', () => this.toggleCart(true));
            closeCartBtn.addEventListener('click', () => this.toggleCart(false));
            cartDrawerOverlay.addEventListener('click', () => this.toggleCart(false));
        }
          // -------------------------------------------------------------------------
    //  2. DYNAMIC BASKET MATRIX INTERACTION (Part 2/3)
    // -------------------------------------------------------------------------
    toggleCart(isOpen) {
        const { cartDrawer, cartDrawerOverlay } = this.dom;
        if (!cartDrawer || !cartDrawerOverlay) return;

        if (isOpen) {
            cartDrawer.classList.add('active');
            cartDrawerOverlay.classList.add('active');
        } else {
            cartDrawer.classList.remove('active');
            cartDrawerOverlay.classList.remove('active');
        }
    }

    registerProductEvents() {
        // High Performance Size Node Matrix Switcher
        this.dom.sizeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.parentElement;
                if (parent) {
                    parent.querySelectorAll('.size-opt').forEach(opt => opt.classList.remove('active'));
                }
                e.target.classList.add('active');
            });
        });

        // Add To Cart Lifecycle Observer
        this.dom.addToCartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAddToCart(e));
        });
    }

    handleAddToCart(e) {
        const productCard = e.target.closest('.premium-card');
        if (!productCard) return;

        // Hydrate Immutable Data Structure From Target Attributes
        const id = productCard.getAttribute('data-id');
        const name = productCard.getAttribute('data-name');
        const price = parseFloat(productCard.getAttribute('data-price'));
        const imgUrl = productCard.querySelector('.card-media img')?.getAttribute('src') || '';
        
        // Extract Dynamic Selected Size Attributes
        const activeSizeEl = productCard.querySelector('.size-opt.active');
        const size = activeSizeEl ? activeSizeEl.innerText : 'OS';
        const variantId = `${id}-${size}`;

        // Verify Existing State To Avoid Thread Collisions
        const existingItem = this.state.cart.find(item => item.variantId === variantId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({ variantId, id, name, price, imgUrl, size, quantity: 1 });
        }

        this.commitCartChanges();
        this.toggleCart(true); // Micro-interaction: Auto open panel slide
    }

    commitCartChanges() {
        this.renderCart();
        this.syncTotals();
    }
    // -------------------------------------------------------------------------
    //  3. DATA RENDERING & CLIPBOARD INTERFACE SUBSYSTEM (Part 3/3)
    // -------------------------------------------------------------------------
    renderCart() {
        const { cartItemsContainer } = this.dom;
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (this.state.cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-cart-msg">Your shopping bag is empty.</div>`;
            return;
        }

        // Generate Ultra-Minimalist Production Markup Templates
        this.state.cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.imgUrl}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div>
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-meta">Size: ${item.size} | Qty: ${item.quantity}</p>
                    </div>
                    <div class="cart-item-price">${this.state.currency}${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item-btn" data-variant-id="${item.variantId}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Safely Bind Event Delegates On Newly Mounted Targets
        cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleRemoveItem(e));
        });
    }

    handleRemoveItem(e) {
        const variantId = e.target.getAttribute('data-variant-id');
        this.state.cart = this.state.cart.filter(item => item.variantId !== variantId);
        this.commitCartChanges();
    }

    syncTotals() {
        const { cartCount, cartHeaderCount, cartTotalAmount } = this.dom;
        
        const totalItems = this.state.cart.reduce((acc, item) => acc + item.quantity, 0);
        const grossAmount = this.state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        if (cartCount) cartCount.innerText = totalItems;
        if (cartHeaderCount) cartHeaderCount.innerText = totalItems;
        if (cartTotalAmount) cartTotalAmount.innerText = `${this.state.currency}${grossAmount.toFixed(2)}`;
    }

    registerUtilityEvents() {
        const { copyPromoBtn, promoCodeText } = this.dom;
        if (!copyPromoBtn || !promoCodeText) return;

        // Modern High-Performance Non-Blocking Web API Execution
        copyPromoBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(promoCodeText.innerText);
                
                const fallbackHTML = copyPromoBtn.innerHTML;
                copyPromoBtn.innerHTML = `<i class="fa-solid fa-check"></i> COPIED`;
                copyPromoBtn.style.color = '#ffffff'; 
                
                setTimeout(() => {
                    copyPromoBtn.innerHTML = fallbackHTML;
                    copyPromoBtn.style.color = '';
                }, 2000);
                
            } catch (err) {
                console.error('📋 System Clipboard operation terminated:', err);
            }
        });
    }
}

// --- INITIALIZE APPLICATION ON COMPONENT load SUCCESS ---
document.addEventListener('DOMContentLoaded', () => {
    window.ZennLuxuryApp = new ZennApp();
});

    }
