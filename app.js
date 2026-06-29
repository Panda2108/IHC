const { createApp, ref, computed, watch, onMounted, nextTick } = Vue;

createApp({
    setup() {
        const categories = ["TODOS", "ALIMENTOS BÁSICOS", "HIGIENE PERSONAL", "LIMPIEZA DEL HOGAR"];
        const LOW_STOCK_THRESHOLD = 5;

        // ============================================================
        // BASE DE DATOS DE PRODUCTOS CON PRECIOS POR PUESTO
        // Cada producto tiene un array de "puestos" con su propio precio,
        // permitiendo la comparación de precios en tiempo real.
        // ============================================================
        const products = [
            {
                id: 1, name: "Arroz Faraon 750g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/arroz.jpg", offer: false, stock: 18, rating: 4.6, reviewCount: 24,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 4.20, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 4.50, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 3.90, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 2, name: "Fideos Nicolini 500g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/fideos.jpg", offer: true, stock: 3, rating: 4.8, reviewCount: 41,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 3.30, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 3.80, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 3.50, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 3, name: "Aceite UNO 900 ml", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/aceite.jpg", offer: false, stock: 12, rating: 4.3, reviewCount: 17,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 9.90, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 10.50, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 9.50, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 4, name: "Sal Marina 1Kg", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/sal.jpg", offer: true, stock: 0, rating: 4.5, reviewCount: 9,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 2.20, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 2.80, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 2.50, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 5, name: "Lenteja bebe 500g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/lentejas.jpg", offer: true, stock: 4, rating: 4.7, reviewCount: 12,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 5.50, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 6.80, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 5.90, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 6, name: "Frijol Canario 500g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/frejol_canario.jpg", offer: false, stock: 9, rating: 4.4, reviewCount: 8,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 6.90, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 7.20, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 6.50, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 7, name: "Quinua 500g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/quinua.jpg", offer: false, stock: 14, rating: 4.9, reviewCount: 33,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 9.50, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 9.90, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 8.80, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 8, name: "Avena clasica 900g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/avena.jpg", offer: true, stock: 2, rating: 4.6, reviewCount: 21,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 7.90, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 9.50, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 8.20, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 9, name: "Jabón Protex", category: "HIGIENE PERSONAL",
                img: "imagenes/jabon.jpg", offer: false, stock: 25, rating: 4.2, reviewCount: 14,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 3.20, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 3.50, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 3.10, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 10, name: "Pasta Dental Kolinos", category: "HIGIENE PERSONAL",
                img: "imagenes/pasta_dental.jpg", offer: false, stock: 16, rating: 4.4, reviewCount: 19,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 5.90, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 6.20, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 5.70, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 11, name: "Champú Head&Sholder", category: "HIGIENE PERSONAL",
                img: "imagenes/champu.jpg", offer: true, stock: 5, rating: 4.8, reviewCount: 37,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 16.90, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 22.90, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 18.50, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 12, name: "Desodorante Rexona", category: "HIGIENE PERSONAL",
                img: "imagenes/desodorante.jpg", offer: false, stock: 11, rating: 4.5, reviewCount: 22,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 11.50, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 12.00, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 11.00, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 13, name: "Jabón Popeye", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/jabon_ropa.jpg", offer: false, stock: 20, rating: 4.1, reviewCount: 6,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 2.30, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 2.60, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 2.20, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 14, name: "Detergente Patito 140g", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/detergente.jpg", offer: true, stock: 1, rating: 4.3, reviewCount: 11,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 1.80, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 2.30, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 1.90, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 15, name: "Limpiador Dkasa 4L", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/limpiador.jpg", offer: false, stock: 8, rating: 4.0, reviewCount: 5,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 13.90, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 14.50, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 13.50, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 16, name: "Lavavajillas Sapolio 800g", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/lavavajilla.jpg", offer: false, stock: 13, rating: 4.6, reviewCount: 16,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 6.50, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 6.80, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 6.20, vendedor: "Sra. Rosa" }
                ]
            },
            {
                id: 17, name: "Lejia Aro 5L", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/lejia.jpg", offer: true, stock: 0, rating: 4.2, reviewCount: 7,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 9.90, vendedor: "Sra. Carmen" },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 12.50, vendedor: "Sr. Pedro" },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 10.50, vendedor: "Sra. Rosa" }
                ]
            }
        ];

        // ============================================================
        // HELPERS DE PRECIO (derivados de puestos)
        // ============================================================
        // Precio más bajo entre puestos (precio "oferta" visible)
        const getPrecioMin = (product) => Math.min(...product.puestos.map(p => p.precio));
        // Precio más alto (sirve como "precio anterior" tachado)
        const getPrecioMax = (product) => Math.max(...product.puestos.map(p => p.precio));
        // Puesto con el precio más bajo
        const getPuestoMasBarato = (product) => product.puestos.reduce((a, b) => a.precio < b.precio ? a : b);
        // Ahorro máximo posible vs precio más caro
        const getAhorro = (product) => +(getPrecioMax(product) - getPrecioMin(product)).toFixed(2);

        // Reseñas de ejemplo por producto
        const productReviews = {
            1: [
                { author: "María G.", rating: 5, comment: "Grano parejo y rinde muchísimo. Lo compro siempre." },
                { author: "Jorge L.", rating: 4, comment: "Buena calidad, llegó bien empacado." }
            ],
            2: [
                { author: "Rosa P.", rating: 5, comment: "Excelente precio en oferta, los niños lo aman." },
                { author: "Luis A.", rating: 5, comment: "Cocción rápida y sabor rico." }
            ],
            3: [{ author: "Ana T.", rating: 4, comment: "Buen rendimiento para frituras diarias." }],
            5: [{ author: "Carmen V.", rating: 5, comment: "Ideal para los purés del bebé, muy suave." }],
            7: [
                { author: "Diego M.", rating: 5, comment: "La mejor quinua que he probado, sin impurezas." },
                { author: "Patricia S.", rating: 5, comment: "Llega limpia y se cocina rápido." }
            ],
            8: [{ author: "Fernando R.", rating: 4, comment: "Buena oferta, mi familia desayuna esto siempre." }],
            11: [
                { author: "Valeria C.", rating: 5, comment: "Deja el cabello suave, vale cada sol." },
                { author: "Andrea N.", rating: 5, comment: "Precio increíble comparado con otras tiendas." }
            ]
        };

        // Productos reactivos
        const productList = ref(products.map(p => ({ ...p, price: getPrecioMin(p), oldPrice: p.puestos.length > 1 ? getPrecioMax(p) : null })));

        const activeCategory = ref('TODOS');
        const view = ref('tienda');
        const cart = ref([]);
        const isCartOpen = ref(false);
        const searchQuery = ref('');
        const deliveryMethod = ref('recoger');

        // ============================================================
        // MÓDULO: COMPARACIÓN DE PRECIOS EN TIEMPO REAL
        // ============================================================
        const showPriceComparison = ref(false);
        const selectedCompareProduct = ref(null);
        const selectedPuestoId = ref(null); // puesto elegido por el usuario

        const openPriceComparison = (product) => {
            selectedCompareProduct.value = product;
            // Pre-seleccionar el puesto más barato
            selectedPuestoId.value = getPuestoMasBarato(product).id;
            showPriceComparison.value = true;
            isCartOpen.value = false;
        };

        const closePriceComparison = () => {
            showPriceComparison.value = false;
            selectedCompareProduct.value = null;
            selectedPuestoId.value = null;
        };

        const addToCartFromPuesto = () => {
            if (!selectedCompareProduct.value || !selectedPuestoId.value) return;
            const product = selectedCompareProduct.value;
            const puesto = product.puestos.find(p => p.id === selectedPuestoId.value);
            if (!puesto) return;

            const liveProduct = productList.value.find(p => p.id === product.id);
            if (!liveProduct || liveProduct.stock <= 0) return;

            const existing = cart.value.find(item => item.id === product.id);
            const qtyInCart = existing ? existing.qty : 0;
            if (qtyInCart + 1 > liveProduct.stock) return;

            // Guardar el precio del puesto elegido
            const cartProduct = { ...liveProduct, price: puesto.precio, puestoNombre: puesto.nombre, puestoVendedor: puesto.vendedor };

            if (existing) {
                existing.qty += 1;
                existing.price = puesto.precio;
                existing.puestoNombre = puesto.nombre;
            } else {
                cart.value.push({ ...cartProduct, qty: 1 });
            }

            liveProduct.stock -= 1;
            closePriceComparison();
            isCartOpen.value = true;
        };

        // Ahorro total acumulado en el carrito al elegir el precio más barato
        const totalSavingsInCart = computed(() => {
            return cart.value.reduce((acc, item) => {
                const product = productList.value.find(p => p.id === item.id);
                if (!product) return acc;
                const maxPrice = getPrecioMax(product);
                return acc + (maxPrice - item.price) * item.qty;
            }, 0);
        });

        // ============================================================
        // HISTORIAL DE COMPRAS
        // ============================================================
        const purchaseHistory = ref([]);

        const loadPurchaseHistory = () => {
            try {
                const saved = localStorage.getItem('eu_purchase_history');
                if (saved) purchaseHistory.value = JSON.parse(saved);
            } catch (e) { purchaseHistory.value = []; }
        };

        const savePurchaseHistory = () => {
            try { localStorage.setItem('eu_purchase_history', JSON.stringify(purchaseHistory.value)); }
            catch (e) { }
        };

        // ============================================================
        // COMPRAS FRECUENTES
        // ============================================================
        const frequentProducts = computed(() => {
            const countById = {};
            purchaseHistory.value.forEach(order => {
                order.items.forEach(item => {
                    countById[item.id] = (countById[item.id] || 0) + item.qty;
                });
            });
            return Object.keys(countById)
                .map(id => {
                    const product = productList.value.find(p => p.id === Number(id));
                    return product ? { ...product, timesBought: countById[id] } : null;
                })
                .filter(Boolean)
                .sort((a, b) => b.timesBought - a.timesBought)
                .slice(0, 8);
        });

        // ============================================================
        // PUNTOS DE FIDELIDAD
        // ============================================================
        const loyaltyPoints = ref(0);
        const POINTS_PER_SOL = 0.4;
        const REDEEM_COST = 500;
        const REDEEM_DISCOUNT = 10;
        const activeDiscount = ref(0);

        const loadLoyaltyPoints = () => {
            try {
                const saved = localStorage.getItem('eu_loyalty_points');
                loyaltyPoints.value = saved ? Number(saved) : 0;
            } catch (e) { loyaltyPoints.value = 0; }
        };

        const saveLoyaltyPoints = () => {
            try { localStorage.setItem('eu_loyalty_points', String(loyaltyPoints.value)); }
            catch (e) { }
        };

        const redeemPoints = () => {
            if (loyaltyPoints.value < REDEEM_COST) return;
            loyaltyPoints.value -= REDEEM_COST;
            activeDiscount.value += REDEEM_DISCOUNT;
            saveLoyaltyPoints();
        };

        // ============================================================
        // CHECKOUT Y PAGO
        // ============================================================
        const showPaymentModal = ref(false);
        const paymentMethod = ref('pagoefectivo');
        const isProcessingPayment = ref(false);
        const isVoiceReaderEnabled = ref(false);
        const isDictationEnabled = ref(false);
        const isListening = ref(false);
        const showOrderSuccess = ref(false);
        const countdown = ref(0);
        const activeOrder = ref([]);

        watch(isVoiceReaderEnabled, (newVal) => { if (newVal) isDictationEnabled.value = false; });
        watch(isDictationEnabled, (newVal) => { if (newVal) isVoiceReaderEnabled.value = false; });

        const cartTotal = computed(() => {
            const subtotal = cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0);
            return Math.max(subtotal - activeDiscount.value, 0);
        });

        const addToCart = (product) => {
            const liveProduct = productList.value.find(p => p.id === product.id);
            if (!liveProduct || liveProduct.stock <= 0) return;
            const existing = cart.value.find(item => item.id === product.id);
            const qtyInCart = existing ? existing.qty : 0;
            if (qtyInCart + 1 > liveProduct.stock) return;
            if (existing) existing.qty += 1;
            else cart.value.push({ ...liveProduct, qty: 1 });
            liveProduct.stock -= 1;
            isCartOpen.value = true;
        };

        const updateQty = (id, delta) => {
            const item = cart.value.find(item => item.id === id);
            if (!item) return;
            const liveProduct = productList.value.find(p => p.id === id);
            if (delta > 0 && liveProduct && liveProduct.stock <= 0) return;
            item.qty += delta;
            if (liveProduct) liveProduct.stock -= delta;
            if (item.qty <= 0) removeFromCart(id);
        };

        const removeFromCart = (id) => {
            const item = cart.value.find(item => item.id === id);
            if (item) {
                const liveProduct = productList.value.find(p => p.id === id);
                if (liveProduct) liveProduct.stock += item.qty;
            }
            cart.value = cart.value.filter(item => item.id !== id);
        };

        const proceedToCheckout = () => {
            if (activeOrder.value.length > 0) confirmPayment();
            else { showPaymentModal.value = true; isCartOpen.value = false; }
        };

        // Manejo de errores de pago
        const showPaymentError = ref(false);
        const isRetrying = ref(false);
        const retryCountdown = ref(0);
        let retryInterval;

        const simulateGatewayFailure = () => Math.random() < 0.25;

        const finalizeOrder = () => {
            if (activeOrder.value.length > 0 && countdown.value > 0) {
                const updatedOrder = [...activeOrder.value];
                cart.value.forEach(cartItem => {
                    const existing = updatedOrder.find(item => item.id === cartItem.id);
                    if (existing) existing.qty += cartItem.qty;
                    else updatedOrder.push({ ...cartItem });
                });
                activeOrder.value = updatedOrder;
            } else {
                activeOrder.value = [...cart.value];
                showOrderSuccess.value = true;
                countdown.value = 300;
            }

            if (cart.value.length > 0) {
                purchaseHistory.value.unshift({
                    id: Date.now(),
                    date: new Date().toISOString(),
                    items: cart.value.map(item => ({
                        id: item.id, name: item.name, qty: item.qty,
                        price: item.price, img: item.img,
                        puestoNombre: item.puestoNombre || null
                    })),
                    total: cartTotal.value,
                    deliveryMethod: deliveryMethod.value,
                    paymentMethod: paymentMethod.value,
                    savings: totalSavingsInCart.value
                });
                savePurchaseHistory();
                loyaltyPoints.value += Math.round(cartTotal.value * POINTS_PER_SOL);
                activeDiscount.value = 0;
                saveLoyaltyPoints();
            }
            cart.value = [];
        };

        const startAutoRetry = () => {
            isRetrying.value = true;
            retryCountdown.value = 5;
            clearInterval(retryInterval);
            retryInterval = setInterval(() => {
                retryCountdown.value--;
                if (retryCountdown.value <= 0) {
                    clearInterval(retryInterval);
                    isRetrying.value = false;
                    showPaymentError.value = false;
                    runPaymentAttempt(true);
                }
            }, 1000);
        };

        const runPaymentAttempt = (forceSuccess = false) => {
            isProcessingPayment.value = true;
            setTimeout(() => {
                isProcessingPayment.value = false;
                if (!forceSuccess && simulateGatewayFailure()) {
                    showPaymentError.value = true;
                    startAutoRetry();
                    return;
                }
                showPaymentModal.value = false;
                finalizeOrder();
            }, 1500);
        };

        const confirmPayment = () => runPaymentAttempt(false);

        const cancelPaymentRetry = () => {
            clearInterval(retryInterval);
            isRetrying.value = false;
            showPaymentError.value = false;
        };

        // ============================================================
        // FILTRADO DE PRODUCTOS
        // ============================================================
        const filteredProducts = computed(() => {
            return productList.value.filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
                const matchesCategory = activeCategory.value === 'TODOS' || p.category === activeCategory.value;
                if (view.value === 'ofertas') return p.offer && matchesSearch && matchesCategory;
                return matchesSearch && matchesCategory;
            });
        });

        const stockLabel = (product) => {
            if (product.stock <= 0) return 'AGOTADO';
            if (product.stock <= LOW_STOCK_THRESHOLD) return `ÚLTIMAS ${product.stock} UNIDADES`;
            return '';
        };
        const isOutOfStock = (product) => product.stock <= 0;
        const isLowStock = (product) => product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
        const getReviews = (productId) => productReviews[productId] || [];

        // ============================================================
        // SOPORTE
        // ============================================================
        const showSupportPanel = ref(false);
        const supportMessage = ref('');
        const supportSent = ref(false);

        const toggleSupportPanel = () => {
            showSupportPanel.value = !showSupportPanel.value;
            if (!showSupportPanel.value) supportSent.value = false;
        };
        const sendSupportMessage = () => {
            if (!supportMessage.value.trim()) return;
            supportSent.value = true;
            supportMessage.value = '';
        };

        // RESEÑAS
        const selectedReviewProduct = ref(null);
        const openReviews = (product) => { selectedReviewProduct.value = product; };
        const closeReviews = () => { selectedReviewProduct.value = null; };

        // HISTORIAL VISIBLE
        const showPurchaseHistory = ref(false);
        const toggleShowPurchaseHistory = () => { showPurchaseHistory.value = !showPurchaseHistory.value; };

        // ACCESIBILIDAD
        const speakProduct = (text) => {
            if (isVoiceReaderEnabled.value && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(text);
                msg.lang = 'es-ES';
                window.speechSynthesis.speak(msg);
            }
        };

        const handleListen = () => {
            if (!isDictationEnabled.value) return;
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) return;
            const recognition = new SpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.onstart = () => isListening.value = true;
            recognition.onresult = (event) => {
                searchQuery.value = event.results[0][0].transcript;
                isListening.value = false;
            };
            recognition.onerror = () => isListening.value = false;
            recognition.onend = () => isListening.value = false;
            if (isListening.value) recognition.stop();
            else recognition.start();
        };

        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        const formatDate = (isoString) => {
            const d = new Date(isoString);
            return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) +
                ' · ' + d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
        };

        let timerInterval;
        watch(countdown, (newVal) => {
            clearInterval(timerInterval);
            if (newVal > 0) {
                timerInterval = setInterval(() => {
                    countdown.value--;
                    if (countdown.value <= 0) {
                        showOrderSuccess.value = false;
                        activeOrder.value = [];
                        clearInterval(timerInterval);
                    }
                }, 1000);
            }
        });

        watch([view, isCartOpen, showOrderSuccess, showPaymentModal, selectedReviewProduct,
            showPurchaseHistory, showPaymentError, showSupportPanel, showPriceComparison], () => {
            nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        });

        onMounted(() => {
            loadPurchaseHistory();
            loadLoyaltyPoints();
            if (window.lucide) window.lucide.createIcons();
        });

        return {
            categories, activeCategory, view, cart, isCartOpen, deliveryMethod, searchQuery,
            isVoiceReaderEnabled, isDictationEnabled, isListening, showOrderSuccess, countdown, activeOrder,
            showPaymentModal, paymentMethod, isProcessingPayment, cartTotal,
            addToCart, updateQty, removeFromCart, proceedToCheckout, confirmPayment, filteredProducts,
            speakProduct, handleListen, formatTime,
            productList, frequentProducts, purchaseHistory,
            stockLabel, isOutOfStock, isLowStock,
            getReviews, selectedReviewProduct, openReviews, closeReviews,
            showPurchaseHistory, toggleShowPurchaseHistory, formatDate,
            loyaltyPoints, activeDiscount, redeemPoints, REDEEM_COST, REDEEM_DISCOUNT,
            showPaymentError, isRetrying, retryCountdown, cancelPaymentRetry,
            showSupportPanel, toggleSupportPanel, supportMessage, supportSent, sendSupportMessage,
            // Comparación de precios
            showPriceComparison, selectedCompareProduct, selectedPuestoId,
            openPriceComparison, closePriceComparison, addToCartFromPuesto,
            getPrecioMin, getPrecioMax, getPuestoMasBarato, getAhorro, totalSavingsInCart
        };
    }
}).mount('#app');