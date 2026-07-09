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
                img: "imagenes/arroz.jpg", offer: false, rating: 4.6, reviewCount: 24,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 4.20, vendedor: "Sra. Carmen", stock: 6 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 4.50, vendedor: "Sr. Pedro", stock: 5 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 3.90, vendedor: "Sra. Rosa", stock: 7 }
                ]
            },
            {
                id: 2, name: "Fideos Nicolini 500g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/fideos.jpg", offer: true, rating: 4.8, reviewCount: 41,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 3.30, vendedor: "Sra. Carmen", stock: 1 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 3.80, vendedor: "Sr. Pedro", stock: 0 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 3.50, vendedor: "Sra. Rosa", stock: 2 }
                ]
            },
            {
                id: 3, name: "Aceite UNO 900 ml", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/aceite.jpg", offer: false, rating: 4.3, reviewCount: 17,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 9.90, vendedor: "Sra. Carmen", stock: 4 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 10.50, vendedor: "Sr. Pedro", stock: 4 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 9.50, vendedor: "Sra. Rosa", stock: 4 }
                ]
            },
            {
                id: 4, name: "Sal Marina 1Kg", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/sal.jpg", offer: true, rating: 4.5, reviewCount: 9,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 2.20, vendedor: "Sra. Carmen", stock: 0 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 2.80, vendedor: "Sr. Pedro", stock: 0 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 2.50, vendedor: "Sra. Rosa", stock: 0 }
                ]
            },
            {
                id: 5, name: "Lenteja bebe 500g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/lentejas.jpg", offer: true, rating: 4.7, reviewCount: 12,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 5.50, vendedor: "Sra. Carmen", stock: 2 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 6.80, vendedor: "Sr. Pedro", stock: 0 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 5.90, vendedor: "Sra. Rosa", stock: 2 }
                ]
            },
            {
                id: 6, name: "Frijol Canario 500g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/frejol_canario.jpg", offer: false, rating: 4.4, reviewCount: 8,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 6.90, vendedor: "Sra. Carmen", stock: 3 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 7.20, vendedor: "Sr. Pedro", stock: 3 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 6.50, vendedor: "Sra. Rosa", stock: 3 }
                ]
            },
            {
                id: 7, name: "Quinua 500g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/quinua.jpg", offer: false, rating: 4.9, reviewCount: 33,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 9.50, vendedor: "Sra. Carmen", stock: 5 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 9.90, vendedor: "Sr. Pedro", stock: 4 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 8.80, vendedor: "Sra. Rosa", stock: 5 }
                ]
            },
            {
                id: 8, name: "Avena clasica 900g", category: "ALIMENTOS BÁSICOS",
                img: "imagenes/avena.jpg", offer: true, rating: 4.6, reviewCount: 21,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 7.90, vendedor: "Sra. Carmen", stock: 1 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 9.50, vendedor: "Sr. Pedro", stock: 0 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 8.20, vendedor: "Sra. Rosa", stock: 1 }
                ]
            },
            {
                id: 9, name: "Jabón Protex", category: "HIGIENE PERSONAL",
                img: "imagenes/jabon.jpg", offer: false, rating: 4.2, reviewCount: 14,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 3.20, vendedor: "Sra. Carmen", stock: 9 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 3.50, vendedor: "Sr. Pedro", stock: 8 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 3.10, vendedor: "Sra. Rosa", stock: 8 }
                ]
            },
            {
                id: 10, name: "Pasta Dental Kolinos", category: "HIGIENE PERSONAL",
                img: "imagenes/pasta_dental.jpg", offer: false, rating: 4.4, reviewCount: 19,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 5.90, vendedor: "Sra. Carmen", stock: 6 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 6.20, vendedor: "Sr. Pedro", stock: 5 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 5.70, vendedor: "Sra. Rosa", stock: 5 }
                ]
            },
            {
                id: 11, name: "Champú Head&Sholder", category: "HIGIENE PERSONAL",
                img: "imagenes/champu.jpg", offer: true, rating: 4.8, reviewCount: 37,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 16.90, vendedor: "Sra. Carmen", stock: 2 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 22.90, vendedor: "Sr. Pedro", stock: 1 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 18.50, vendedor: "Sra. Rosa", stock: 2 }
                ]
            },
            {
                id: 12, name: "Desodorante Rexona", category: "HIGIENE PERSONAL",
                img: "imagenes/desodorante.jpg", offer: false, rating: 4.5, reviewCount: 22,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 11.50, vendedor: "Sra. Carmen", stock: 4 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 12.00, vendedor: "Sr. Pedro", stock: 3 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 11.00, vendedor: "Sra. Rosa", stock: 4 }
                ]
            },
            {
                id: 13, name: "Jabón Popeye", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/jabon_ropa.jpg", offer: false, rating: 4.1, reviewCount: 6,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 2.30, vendedor: "Sra. Carmen", stock: 7 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 2.60, vendedor: "Sr. Pedro", stock: 6 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 2.20, vendedor: "Sra. Rosa", stock: 7 }
                ]
            },
            {
                id: 14, name: "Detergente Patito 140g", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/detergente.jpg", offer: true, rating: 4.3, reviewCount: 11,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 1.80, vendedor: "Sra. Carmen", stock: 0 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 2.30, vendedor: "Sr. Pedro", stock: 1 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 1.90, vendedor: "Sra. Rosa", stock: 0 }
                ]
            },
            {
                id: 15, name: "Limpiador Dkasa 4L", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/limpiador.jpg", offer: false, rating: 4.0, reviewCount: 5,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 13.90, vendedor: "Sra. Carmen", stock: 3 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 14.50, vendedor: "Sr. Pedro", stock: 2 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 13.50, vendedor: "Sra. Rosa", stock: 3 }
                ]
            },
            {
                id: 16, name: "Lavavajillas Sapolio 800g", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/lavavajilla.jpg", offer: false, rating: 4.6, reviewCount: 16,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 6.50, vendedor: "Sra. Carmen", stock: 5 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 6.80, vendedor: "Sr. Pedro", stock: 4 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 6.20, vendedor: "Sra. Rosa", stock: 4 }
                ]
            },
            {
                id: 17, name: "Lejia Aro 5L", category: "LIMPIEZA DEL HOGAR",
                img: "imagenes/lejia.jpg", offer: true, rating: 4.2, reviewCount: 7,
                puestos: [
                    { id: 'p1', nombre: "Puesto La Esperanza", precio: 9.90, vendedor: "Sra. Carmen", stock: 0 },
                    { id: 'p2', nombre: "Puesto Don Pepe",     precio: 12.50, vendedor: "Sr. Pedro", stock: 0 },
                    { id: 'p3', nombre: "Puesto El Rincón",    precio: 10.50, vendedor: "Sra. Rosa", stock: 0 }
                ]
            }
        ];

        // ============================================================
        // HELPERS DE STOCK Y PRECIO (derivados de puestos)
        // El stock ahora vive en cada puesto (tienda), no en el producto.
        // ============================================================
        // Puestos de un producto que todavía tienen stock disponible
        const getPuestosDisponibles = (product) => product.puestos.filter(p => p.stock > 0);
        // Stock total del producto sumando todas las tiendas
        const getStockTotal = (product) => product.puestos.reduce((acc, p) => acc + p.stock, 0);
        // Precio más bajo entre puestos con stock (si ninguno tiene, se usa el precio de referencia)
        const getPrecioMin = (product) => {
            const disponibles = getPuestosDisponibles(product);
            const lista = disponibles.length ? disponibles : product.puestos;
            return Math.min(...lista.map(p => p.precio));
        };
        // Precio más alto (sirve como "precio anterior" tachado)
        const getPrecioMax = (product) => {
            const disponibles = getPuestosDisponibles(product);
            const lista = disponibles.length ? disponibles : product.puestos;
            return Math.max(...lista.map(p => p.precio));
        };
        // Puesto con el precio más bajo, priorizando los que tienen stock
        const getPuestoMasBarato = (product) => {
            const disponibles = getPuestosDisponibles(product);
            const lista = disponibles.length ? disponibles : product.puestos;
            return lista.reduce((a, b) => a.precio < b.precio ? a : b);
        };
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

        // Productos reactivos (clonamos también los puestos, ya que ahora cada uno
        // guarda su propio stock y será mutado al comprar)
        const productList = ref(products.map(p => ({
            ...p,
            puestos: p.puestos.map(puesto => ({ ...puesto })),
            price: getPrecioMin(p),
            oldPrice: p.puestos.length > 1 ? getPrecioMax(p) : null
        })));

        const activeCategory = ref('TODOS');
        const view = ref('tienda');
        const cart = ref([]);
        // El carrito ahora empieza SIEMPRE visible y fijo al lado de la tienda.
        // Solo se puede ocultar (hideCart) una vez que el cliente ha dado a
        // "Proceder al Pago" por primera vez (canHideCart pasa a true en ese
        // momento). Antes de eso no existe ninguna forma de cerrarlo.
        const isCartOpen = ref(true);
        const canHideCart = ref(false);
        const searchQuery = ref('');
        const deliveryMethod = ref('recoger');

        // Abre el carrito fijo (siempre permitido).
        const openCart = () => { isCartOpen.value = true; };
        // Oculta el carrito: solo funciona si ya se desbloqueó (tras la primera compra).
        const hideCart = () => {
            if (!canHideCart.value) return;
            isCartOpen.value = false;
        };
        // Alterna mostrar/ocultar, respetando el bloqueo inicial.
        const toggleCart = () => {
            if (isCartOpen.value) hideCart();
            else openCart();
        };

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
            // El carrito fijo vuelve a mostrarse al cerrar este modal.
            isCartOpen.value = true;
        };

        // Agrega una unidad de un producto desde un puesto específico,
        // descontando el stock de esa tienda (no del producto en general)
        const addUnitFromPuesto = (liveProduct, puesto) => {
            if (!puesto || puesto.stock <= 0) return false;
            const cartId = liveProduct.id + '-' + puesto.id;
            const existing = cart.value.find(item => item.cartId === cartId);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.value.push({
                    ...liveProduct,
                    cartId,
                    puestoId: puesto.id,
                    price: puesto.precio,
                    puestoNombre: puesto.nombre,
                    puestoVendedor: puesto.vendedor,
                    qty: 1
                });
            }
            puesto.stock -= 1;
            return true;
        };

        const addToCartFromPuesto = () => {
            if (!selectedCompareProduct.value || !selectedPuestoId.value) return;
            const product = selectedCompareProduct.value;

            const liveProduct = productList.value.find(p => p.id === product.id);
            if (!liveProduct) return;
            const puesto = liveProduct.puestos.find(p => p.id === selectedPuestoId.value);
            if (!puesto || puesto.stock <= 0) return;

            addUnitFromPuesto(liveProduct, puesto);
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
                // Limpieza única del historial anterior al actualizar la tienda
                if (!localStorage.getItem('eu_history_reset_v2')) {
                    localStorage.removeItem('eu_purchase_history');
                    localStorage.setItem('eu_history_reset_v2', '1');
                }
                const saved = localStorage.getItem('eu_purchase_history');
                if (saved) purchaseHistory.value = JSON.parse(saved);
                // Los pedidos "en_proceso" solo existen mientras el temporizador de 5 minutos
                // sigue corriendo en memoria. Si la página se recarga, ese temporizador se
                // pierde, así que cualquier pedido que haya quedado "en_proceso" (de una sesión
                // anterior) o sin estado (guardado por una versión previa de la tienda) se
                // considera completado para no dejar pedidos fantasma en curso.
                purchaseHistory.value.forEach(order => {
                    if (!order.status || order.status === 'en_proceso') order.status = 'completado';
                });
                savePurchaseHistory();
            } catch (e) { purchaseHistory.value = []; }
        };

        const savePurchaseHistory = () => {
            try { localStorage.setItem('eu_purchase_history', JSON.stringify(purchaseHistory.value)); }
            catch (e) { }
        };

        const clearPurchaseHistory = () => {
            // No borra pedidos "en_proceso": solo se vacían los ya completados o
            // cancelados, para no perder de vista un pedido en marcha.
            purchaseHistory.value = purchaseHistory.value.filter(o => o.status === 'en_proceso');
            savePurchaseHistory();
        };

        // Pedidos "en tiempo real" (dentro de la ventana de 5 minutos, aún editables o
        // recién cancelados) vs. historial ya cerrado (completados o cancelados).
        const currentOrders = computed(() => purchaseHistory.value.filter(o => o.status === 'en_proceso'));
        const completedOrdersHistory = computed(() => purchaseHistory.value.filter(o => o.status !== 'en_proceso'));

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
        // Al iniciar, las funciones de accesibilidad por voz están desactivadas;
        // el usuario debe activarlas explícitamente desde Ajustes.
        const isVoiceReaderEnabled = ref(false);
        const isDictationEnabled = ref(false);
        const isListening = ref(false);
        const showOrderCompleted = ref(false);
        const lastCompletedOrder = ref(null);
        let orderCompletedTimeout;

        // ============================================================
        // PEDIDOS EN CURSO (varios a la vez, cada uno con su propio contador)
        //
        // Al presionar "Proceder al Pago" el carrito se convierte en un pedido
        // "esperando_pago": queda reservado con sus productos y no se puede
        // cancelar desde el carrito, pero el carrito mismo queda libre de
        // inmediato para armar y pagar un pedido nuevo e independiente. Durante
        // esos 5 minutos el cliente puede seguir navegando la tienda; la
        // "ventanita" flotante que muestra el contador se puede cerrar y volver
        // a abrir sin que eso afecte el proceso, que sigue corriendo de fondo.
        //
        // Al agotarse el tiempo (o si el cliente elige "Terminar compra sin
        // tiempo extra") se muestran recién las opciones de pago. Una vez
        // pagado, el pedido pasa a "Mis Pedidos" con estado 'en_proceso'
        // (en preparación, con su propio contador) y finalmente a 'completado'.
        // ============================================================
        const PAYMENT_WAIT_SECONDS = 300; // 5 minutos de espera antes de mostrar el pago
        const PREP_SECONDS = 300; // 5 minutos de preparación tras el pago

        const pendingOrders = ref([]); // pedidos aún no pagados, en su ventana de espera
        const checkoutOrderId = ref(null); // id del pedido cuyo modal de pago está abierto

        const paymentOrder = computed(() => pendingOrders.value.find(o => o.id === checkoutOrderId.value) || null);
        const checkoutTotal = computed(() => {
            if (!paymentOrder.value) return 0;
            const subtotal = paymentOrder.value.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
            return Math.max(subtotal - (paymentOrder.value.discount || 0), 0);
        });
        const checkoutDiscount = computed(() => paymentOrder.value ? (paymentOrder.value.discount || 0) : 0);
        const checkoutSavings = computed(() => paymentOrder.value ? (paymentOrder.value.savings || 0) : 0);

        const cartTotal = computed(() => {
            const subtotal = cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0);
            return Math.max(subtotal - activeDiscount.value, 0);
        });

        const addToCart = (product) => {
            const liveProduct = productList.value.find(p => p.id === product.id);
            if (!liveProduct) return;
            const puesto = getPuestoMasBarato(liveProduct);
            if (!puesto || puesto.stock <= 0) return;
            addUnitFromPuesto(liveProduct, puesto);
            isCartOpen.value = true;
        };

        const updateQty = (cartId, delta) => {
            const item = cart.value.find(item => item.cartId === cartId);
            if (!item) return;
            const liveProduct = productList.value.find(p => p.id === item.id);
            const puesto = liveProduct ? liveProduct.puestos.find(p => p.id === item.puestoId) : null;
            if (delta > 0 && puesto && puesto.stock <= 0) return;
            item.qty += delta;
            if (puesto) puesto.stock -= delta;
            if (item.qty <= 0) removeFromCart(cartId);
        };

        const removeFromCart = (cartId) => {
            const item = cart.value.find(item => item.cartId === cartId);
            if (item) {
                const liveProduct = productList.value.find(p => p.id === item.id);
                const puesto = liveProduct ? liveProduct.puestos.find(p => p.id === item.puestoId) : null;
                if (puesto) puesto.stock += item.qty;
            }
            cart.value = cart.value.filter(item => item.cartId !== cartId);
        };

        // ¿Se puede seguir sumando unidades de este ítem del carrito?
        // (depende del stock restante en la tienda de la que se compró)
        const canIncreaseCartItem = (item) => {
            const liveProduct = productList.value.find(p => p.id === item.id);
            const puesto = liveProduct ? liveProduct.puestos.find(p => p.id === item.puestoId) : null;
            return !!puesto && puesto.stock > 0;
        };

        // ============================================================
        // ETIQUETAS DE MÉTODOS DE PAGO
        // ============================================================
        const PAYMENT_METHOD_LABELS = {
            pagoefectivo: 'PagoEfectivo / Banca Móvil',
            billetera: 'Yape / Plin',
            tarjeta: 'Tarjeta de Crédito / Débito'
        };
        const paymentMethodLabel = computed(() => PAYMENT_METHOD_LABELS[paymentMethod.value] || '');

        // Al presionar "Proceder al Pago": el carrito actual se convierte en un
        // pedido en espera (independiente de cualquier otro pedido en curso) y
        // el carrito se vacía de inmediato para poder armar uno nuevo. No hay
        // forma de cancelar este pedido en espera desde el carrito: solo se
        // resuelve esperando los 5 minutos o eligiendo "Terminar compra sin
        // tiempo extra".
        const proceedToCheckout = () => {
            if (cart.value.length === 0) return;
            const order = {
                id: Date.now(),
                items: cart.value.map(item => ({
                    id: item.id, cartId: item.cartId, puestoId: item.puestoId, name: item.name, qty: item.qty,
                    price: item.price, img: item.img, puestoNombre: item.puestoNombre || null
                })),
                deliveryMethod: deliveryMethod.value,
                discount: activeDiscount.value,
                savings: totalSavingsInCart.value,
                paymentMethod: paymentMethod.value,
                phase: 'esperando_pago',
                countdown: PAYMENT_WAIT_SECONDS,
                readyForPayment: false,
                skippedWait: false,
                widgetDismissed: false
            };
            pendingOrders.value.push(order);
            cart.value = [];
            activeDiscount.value = 0;
            // A partir de la primera compra, el carrito puede ocultarse; como
            // ya quedó vacío, lo ocultamos automáticamente (se puede volver a
            // mostrar en cualquier momento con el botón del carrito).
            canHideCart.value = true;
            isCartOpen.value = false;
            announce('Tu pedido quedó en espera de pago durante 5 minutos. Puedes editar las cantidades o cancelarlo desde el aviso flotante o desde Mis Pedidos, o terminar la compra sin tiempo extra.');
        };

        // ============================================================
        // EDICIÓN Y CANCELACIÓN DE UN PEDIDO EN ESPERA DE PAGO
        // Mientras el pedido esté en su ventana de 5 minutos (y aún no esté
        // listo para pagar), el cliente puede cambiar cantidades, quitar
        // productos o cancelarlo por completo. El precio final que se paga
        // luego en las opciones de pago es siempre el que resulte de estos
        // cambios (checkoutTotal se calcula en vivo desde order.items).
        // ============================================================
        const updateOrderItemQty = (orderId, cartId, delta) => {
            const order = pendingOrders.value.find(o => o.id === orderId);
            if (!order || order.readyForPayment) return;
            const item = order.items.find(i => i.cartId === cartId);
            if (!item) return;
            const liveProduct = productList.value.find(p => p.id === item.id);
            const puesto = liveProduct ? liveProduct.puestos.find(p => p.id === item.puestoId) : null;
            if (delta > 0 && puesto && puesto.stock <= 0) return;
            item.qty += delta;
            if (puesto) puesto.stock -= delta;
            if (item.qty <= 0) {
                order.items = order.items.filter(i => i.cartId !== cartId);
            }
            // Si el pedido se queda sin productos al editar, se cancela solo.
            if (order.items.length === 0) cancelPendingOrder(orderId);
        };

        const removeOrderItem = (orderId, cartId) => {
            const order = pendingOrders.value.find(o => o.id === orderId);
            if (!order || order.readyForPayment) return;
            const item = order.items.find(i => i.cartId === cartId);
            if (item) {
                const liveProduct = productList.value.find(p => p.id === item.id);
                const puesto = liveProduct ? liveProduct.puestos.find(p => p.id === item.puestoId) : null;
                if (puesto) puesto.stock += item.qty;
            }
            order.items = order.items.filter(i => i.cartId !== cartId);
            if (order.items.length === 0) cancelPendingOrder(orderId);
        };

        // ¿Se puede seguir sumando unidades de este ítem dentro de un pedido en espera?
        const canIncreaseOrderItem = (item) => {
            const liveProduct = productList.value.find(p => p.id === item.id);
            const puesto = liveProduct ? liveProduct.puestos.find(p => p.id === item.puestoId) : null;
            return !!puesto && puesto.stock > 0;
        };

        // Cancela un pedido que aún está en espera de pago: devuelve el stock
        // reservado a cada puesto y lo mueve a Mis Pedidos con estado 'cancelado'.
        const cancelPendingOrder = (orderId) => {
            const order = pendingOrders.value.find(o => o.id === orderId);
            if (!order) return;
            order.items.forEach(item => {
                const liveProduct = productList.value.find(p => p.id === item.id);
                const puesto = liveProduct ? liveProduct.puestos.find(p => p.id === item.puestoId) : null;
                if (puesto) puesto.stock += item.qty;
            });
            const subtotal = order.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
            const total = Math.max(subtotal - (order.discount || 0), 0);
            purchaseHistory.value.unshift({
                id: order.id,
                date: new Date().toISOString(),
                status: 'cancelado',
                items: order.items,
                total,
                deliveryMethod: order.deliveryMethod,
                paymentMethod: order.paymentMethod,
                savings: order.savings || 0,
                widgetDismissed: false
            });
            savePurchaseHistory();
            pendingOrders.value = pendingOrders.value.filter(o => o.id !== orderId);
            if (checkoutOrderId.value === orderId) {
                showPaymentModal.value = false;
                checkoutOrderId.value = null;
            }
            announce('Pedido cancelado. Los productos volvieron a estar disponibles.');
        };

        // Abre el modal de pago para un pedido en espera puntual.
        const openPaymentModalForOrder = (orderId) => {
            if (isProcessingPayment.value) return;
            const order = pendingOrders.value.find(o => o.id === orderId);
            if (!order) return;
            checkoutOrderId.value = orderId;
            paymentMethod.value = order.paymentMethod || 'pagoefectivo';
            showPaymentModal.value = true;
        };

        // Si el modal de pago está libre, abre el siguiente pedido que ya
        // terminó su espera (por tiempo o porque se eligió "sin tiempo extra").
        const maybeOpenNextPayment = () => {
            if (showPaymentModal.value || isProcessingPayment.value) return;
            const ready = pendingOrders.value.find(o => o.phase === 'esperando_pago' && o.readyForPayment);
            if (ready) openPaymentModalForOrder(ready.id);
        };

        // "Terminar compra sin tiempo extra": salta el resto de la espera y
        // muestra las opciones de pago de inmediato para ese pedido puntual.
        const finishWaitNow = (orderId) => {
            const order = pendingOrders.value.find(o => o.id === orderId);
            if (!order || order.phase !== 'esperando_pago') return;
            order.countdown = 0;
            order.readyForPayment = true;
            order.skippedWait = true;
            openPaymentModalForOrder(orderId);
        };

        const closePaymentModal = () => {
            if (isProcessingPayment.value) return;
            showPaymentModal.value = false;
            checkoutOrderId.value = null;
        };

        // Manejo de errores de pago
        const showPaymentError = ref(false);
        const isRetrying = ref(false);
        const retryCountdown = ref(0);
        let retryInterval;

        const simulateGatewayFailure = () => Math.random() < 0.25;

        // Se ejecuta al confirmarse el pago: el pedido pasa de "esperando_pago"
        // directamente a "completado" en Mis Pedidos. No hay una espera de
        // preparación adicional ni un segundo contador: apenas se paga, el
        // pedido queda completo y se muestra el aviso de "Pedido Completado".
        const finalizeOrder = () => {
            const order = pendingOrders.value.find(o => o.id === checkoutOrderId.value);
            if (!order) return;

            const subtotal = order.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
            const total = Math.max(subtotal - (order.discount || 0), 0);

            const histEntry = {
                id: order.id,
                date: new Date().toISOString(),
                status: 'completado',
                items: order.items,
                total,
                deliveryMethod: order.deliveryMethod,
                paymentMethod: paymentMethod.value,
                savings: order.savings || 0,
                widgetDismissed: false
            };
            purchaseHistory.value.unshift(histEntry);
            savePurchaseHistory();

            loyaltyPoints.value += Math.round(total * POINTS_PER_SOL);
            saveLoyaltyPoints();

            pendingOrders.value = pendingOrders.value.filter(o => o.id !== order.id);
            checkoutOrderId.value = null;

            lastCompletedOrder.value = histEntry;
            clearTimeout(orderCompletedTimeout);
            showOrderCompleted.value = true;
            orderCompletedTimeout = setTimeout(() => { showOrderCompleted.value = false; }, 6000);

            announce('Tu pago fue confirmado. Tu pedido está completo y ya aparece en tu historial de compras.');
            nextTick(() => maybeOpenNextPayment());
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
            const total = getStockTotal(product);
            if (total <= 0) return 'AGOTADO';
            if (total <= LOW_STOCK_THRESHOLD) return `ÚLTIMAS ${total} UNIDADES`;
            return '';
        };
        const isOutOfStock = (product) => getStockTotal(product) <= 0;
        const isLowStock = (product) => {
            const total = getStockTotal(product);
            return total > 0 && total <= LOW_STOCK_THRESHOLD;
        };
        // Stock de un puesto en particular (para la tienda elegida)
        const getPuestoStock = (product, puestoId) => {
            const puesto = product.puestos.find(p => p.id === puestoId);
            return puesto ? puesto.stock : 0;
        };
        const getReviews = (productId) => productReviews[productId] || [];

        // ============================================================
        // AJUSTES: MODO OSCURO Y TAMAÑO DE TEXTO
        // ============================================================
        const isDarkMode = ref(false);
        const FONT_SIZE_OPTIONS = [
            { key: 'pequeno', label: 'Pequeño', scale: 0.875 },
            { key: 'normal', label: 'Normal', scale: 1 },
            { key: 'grande', label: 'Grande', scale: 1.15 },
            { key: 'muy-grande', label: 'Muy grande', scale: 1.3 }
        ];
        const fontSizeKey = ref('normal');
        const fontScale = computed(() => {
            const found = FONT_SIZE_OPTIONS.find(o => o.key === fontSizeKey.value);
            return found ? found.scale : 1;
        });

        const applyDarkMode = () => {
            document.body.classList.toggle('dark-mode', isDarkMode.value);
        };
        const applyFontScale = () => {
            document.documentElement.style.setProperty('--font-scale', fontScale.value);
        };

        // Todos los ajustes de Ajustes de Accesibilidad empiezan SIEMPRE
        // apagados/en su valor por defecto al cargar la tienda, sin importar
        // lo que se haya configurado en una sesión anterior. No se restauran
        // desde localStorage: el usuario debe volver a activarlos si los quiere.
        const loadSettings = () => {
            isDarkMode.value = false;
            fontSizeKey.value = 'normal';
            isVoiceReaderEnabled.value = false;
            isDictationEnabled.value = false;
            applyDarkMode();
            applyFontScale();
        };

        const toggleDarkMode = () => {
            isDarkMode.value = !isDarkMode.value;
        };
        const setFontSize = (key) => {
            if (FONT_SIZE_OPTIONS.some(o => o.key === key)) fontSizeKey.value = key;
        };

        watch(isDarkMode, (newVal) => {
            applyDarkMode();
            try { localStorage.setItem('eu_dark_mode', String(newVal)); } catch (e) { }
        });
        watch(fontSizeKey, (newVal) => {
            applyFontScale();
            try { localStorage.setItem('eu_font_size', newVal); } catch (e) { }
        });
        // El lector de accesibilidad y el dictado por voz no pueden estar
        // activos al mismo tiempo (ambos usan la voz y se pisarían entre sí).
        // Al activar uno, se apaga automáticamente el otro.
        watch(isVoiceReaderEnabled, (newVal) => {
            if (newVal && isDictationEnabled.value) {
                isDictationEnabled.value = false;
            }
            try { localStorage.setItem('eu_voice_reader', String(newVal)); } catch (e) { }
        });
        watch(isDictationEnabled, (newVal) => {
            if (newVal && isVoiceReaderEnabled.value) {
                isVoiceReaderEnabled.value = false;
            }
            try { localStorage.setItem('eu_dictation', String(newVal)); } catch (e) { }
        });

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


        // ============================================================
        // ACCESIBILIDAD: LECTOR DE VOZ Y DICTADO POR COMANDOS
        // Diseñado para personas con discapacidad visual o motriz:
        // no solo dicta texto de búsqueda, sino que permite controlar
        // casi toda la tienda por voz (navegar, agregar/quitar productos,
        // abrir el carrito, pagar, cambiar ajustes, etc.) con confirmación
        // hablada de cada acción.
        // ============================================================
        const speak = (text) => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(text);
                msg.lang = 'es-ES';
                window.speechSynthesis.speak(msg);
            }
        };

        // Lector general de accesibilidad: además de productos, lee categorías,
        // botones de navegación, precios, controles del carrito, pago,
        // ajustes y otros elementos interactivos al pasar el cursor o el foco
        // (teclado), para personas con discapacidad visual o motriz.
        const announce = (text) => {
            if (isVoiceReaderEnabled.value) speak(text);
        };
        // Alias retrocompatible
        const speakProduct = announce;

        // Texto reconocido y resultado de la última orden de voz,
        // mostrados en pantalla (aria-live) para personas con discapacidad auditiva
        const voiceHeard = ref('');
        const voiceFeedback = ref('');
        let voiceFeedbackTimeout;
        const announceVoiceResult = (heard, feedback) => {
            voiceHeard.value = heard;
            voiceFeedback.value = feedback;
            speak(feedback);
            clearTimeout(voiceFeedbackTimeout);
            voiceFeedbackTimeout = setTimeout(() => {
                voiceHeard.value = '';
                voiceFeedback.value = '';
            }, 6000);
        };

        // Quita tildes para comparar texto de forma flexible
        const stripAccents = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Limpia el texto que entrega el reconocimiento de voz: quita puntuación
        // final (el bug reportado: "arroz." no encontraba el producto "Arroz"),
        // signos de apertura/cierre en español y espacios repetidos.
        const cleanVoiceTranscript = (raw) => {
            return raw
                .trim()
                .replace(/[¿?¡!.,;:]+/g, ' ') // quita puntuación en cualquier posición, no solo al final
                .replace(/\s+/g, ' ')
                .trim();
        };

        const normalizeForMatch = (text) => stripAccents(text.toLowerCase()).trim();

        // Busca el producto cuyo nombre coincide mejor con lo dicho por voz
        const findProductByVoice = (query) => {
            const q = normalizeForMatch(query);
            if (!q) return null;
            const candidates = productList.value.map(p => ({ product: p, name: normalizeForMatch(p.name) }));
            // Coincidencia exacta o el nombre empieza con lo dicho
            let match = candidates.find(c => c.name === q) || candidates.find(c => c.name.startsWith(q));
            if (!match) {
                // Coincidencia por palabras: todas las palabras dichas están en el nombre
                const words = q.split(' ').filter(Boolean);
                match = candidates.find(c => words.every(w => c.name.includes(w)));
            }
            if (!match) match = candidates.find(c => c.name.includes(q));
            return match ? match.product : null;
        };

        // Busca un ítem del carrito por nombre de producto dicho por voz
        const findCartItemByVoice = (query) => {
            const q = normalizeForMatch(query);
            if (!q) return null;
            return cart.value.find(item => normalizeForMatch(item.name).includes(q))
                || cart.value.find(item => q.includes(normalizeForMatch(item.name)));
        };

        const VIEW_LABELS = { tienda: 'la tienda', ofertas: 'ofertas', comparar: 'comparar precios', cuenta: 'mi cuenta', ajustes: 'ajustes' };

        const increaseFontSize = () => {
            const idx = FONT_SIZE_OPTIONS.findIndex(o => o.key === fontSizeKey.value);
            if (idx < FONT_SIZE_OPTIONS.length - 1) fontSizeKey.value = FONT_SIZE_OPTIONS[idx + 1].key;
        };
        const decreaseFontSize = () => {
            const idx = FONT_SIZE_OPTIONS.findIndex(o => o.key === fontSizeKey.value);
            if (idx > 0) fontSizeKey.value = FONT_SIZE_OPTIONS[idx - 1].key;
        };

        // Lista de comandos disponibles, evaluados en orden. Cada uno tiene una
        // expresión regular y una acción; el primero que coincida gana.
        const buildVoiceCommands = () => [
            {
                pattern: /^(ayuda|que puedo decir|comandos|que comandos hay)/,
                run: () => 'Puedes decir, por ejemplo: buscar arroz, agregar fideos, quitar aceite, abrir carrito, ir a ofertas, comparar precios, pagar, modo oscuro, o aumentar el texto.'
            },
            { pattern: /^(ir a|ve a|mostrar|muestra|abrir)?\s*(la )?tienda$|^inicio$|^pagina principal$/, run: () => { view.value = 'tienda'; return 'Mostrando la tienda.'; } },
            { pattern: /ofertas/, run: () => { view.value = 'ofertas'; return 'Mostrando las ofertas.'; } },
            { pattern: /frecuentes|compras frecuentes/, run: () => { view.value = 'frecuentes'; return 'Mostrando tus compras frecuentes.'; } },
            { pattern: /comparar( precios)?/, run: () => { view.value = 'comparar'; return 'Abriendo el comparador de precios.'; } },
            { pattern: /^(ir a )?(mi )?cuenta$|^perfil$/, run: () => { view.value = 'cuenta'; return 'Mostrando mi cuenta.'; } },
            { pattern: /ajustes|configuracion/, run: () => { view.value = 'ajustes'; return 'Abriendo ajustes.'; } },

            { pattern: /abrir carrito|ver carrito|mostrar carrito/, run: () => { openCart(); return 'Abriendo el carrito.'; } },
            { pattern: /cerrar carrito/, run: () => {
                if (!canHideCart.value) return 'El carrito se mantiene visible hasta que hagas tu primer pedido.';
                hideCart();
                return 'Cerrando el carrito.';
            } },
            { pattern: /vaciar carrito|limpiar carrito/, run: () => {
                cart.value.slice().forEach(item => removeFromCart(item.cartId));
                return 'Carrito vaciado.';
            } },

            { pattern: /^(pagar|finalizar compra|proceder( al)? pago)/, run: () => {
                if (cart.value.length === 0) return 'Tu carrito está vacío, agrega productos antes de pagar.';
                proceedToCheckout();
                return 'Abriendo el pago de tu pedido.';
            } },

            { pattern: /activar (el )?lector( de productos)?|leer productos/, run: () => { isVoiceReaderEnabled.value = true; return 'Lector de productos activado.'; } },
            { pattern: /desactivar (el )?lector( de productos)?/, run: () => { isVoiceReaderEnabled.value = false; return 'Lector de productos desactivado.'; } },
            { pattern: /modo oscuro/, run: () => { isDarkMode.value = true; return 'Modo oscuro activado.'; } },
            { pattern: /modo claro/, run: () => { isDarkMode.value = false; return 'Modo claro activado.'; } },
            { pattern: /(aumentar|agrandar|subir)( el)? (texto|letra)|texto (mas|más) grande/, run: () => { increaseFontSize(); return 'Aumentando el tamaño del texto.'; } },
            { pattern: /(reducir|achicar|bajar)( el)? (texto|letra)|texto (mas|más) pequeño/, run: () => { decreaseFontSize(); return 'Reduciendo el tamaño del texto.'; } },

            { pattern: /^(agregar|añadir|anadir|comprar)\s+(.+)/, run: (m) => {
                const product = findProductByVoice(m[2]);
                if (!product) return `No encontré ningún producto llamado ${m[2]}.`;
                const liveProduct = productList.value.find(p => p.id === product.id);
                if (isOutOfStock(liveProduct)) return `${liveProduct.name} está agotado en todos los puestos.`;
                addToCart(liveProduct);
                return `${liveProduct.name} agregado al carrito.`;
            } },
            { pattern: /^(quitar|eliminar|borrar|remover)\s+(.+)/, run: (m) => {
                const item = findCartItemByVoice(m[2]);
                if (!item) return `No encontré ${m[2]} en tu carrito.`;
                removeFromCart(item.cartId);
                return `${item.name} eliminado del carrito.`;
            } },

            { pattern: /^(buscar|busca|encontrar|encuentra)\s+(.+)/, run: (m) => {
                searchQuery.value = m[2];
                if (!['tienda','ofertas','comparar','frecuentes'].includes(view.value)) view.value = 'tienda';
                return `Buscando ${m[2]}.`;
            } },
            { pattern: /^(limpiar|borrar) busqueda$/, run: () => { searchQuery.value = ''; return 'Búsqueda borrada.'; } }
        ];

        // Procesa lo dicho por voz: primero intenta encontrar un comando conocido;
        // si no hay coincidencia, lo trata como una búsqueda directa de producto
        // (así basta con decir el nombre del producto, sin decir "buscar").
        const processVoiceCommand = (rawTranscript) => {
            const heard = cleanVoiceTranscript(rawTranscript);
            if (!heard) return;
            const normalized = normalizeForMatch(heard);
            const commands = buildVoiceCommands();
            for (const cmd of commands) {
                const m = normalized.match(cmd.pattern);
                if (m) {
                    const feedback = cmd.run(m);
                    announceVoiceResult(heard, feedback);
                    return;
                }
            }
            // Sin comando reconocido: se busca directamente por el texto dicho
            searchQuery.value = heard;
            if (!['tienda','ofertas','comparar','frecuentes'].includes(view.value)) view.value = 'tienda';
            announceVoiceResult(heard, `Buscando ${heard}.`);
        };

        const handleListen = () => {
            if (!isDictationEnabled.value) return;
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                announceVoiceResult('', 'Tu navegador no soporta el reconocimiento de voz.');
                return;
            }
            if (isListening.value) return;
            const recognition = new SpeechRecognition();
            recognition.lang = 'es-PE';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            recognition.onstart = () => { isListening.value = true; voiceHeard.value = ''; voiceFeedback.value = ''; };
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                isListening.value = false;
                processVoiceCommand(transcript);
            };
            recognition.onerror = () => {
                isListening.value = false;
                announceVoiceResult('', 'No pude escucharte, inténtalo de nuevo.');
            };
            recognition.onend = () => { isListening.value = false; };
            recognition.start();
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

        // Un pedido en preparación ('en_proceso') llega a su contador en cero:
        // pasa a 'completado' y queda disponible en el Historial de Compras.
        // Se muestra un aviso de "Pedido completado" durante unos segundos.
        const completeOrder = (orderId) => {
            const histEntry = purchaseHistory.value.find(o => o.id === orderId);
            if (!histEntry || histEntry.status !== 'en_proceso') return;
            histEntry.status = 'completado';
            savePurchaseHistory();
            lastCompletedOrder.value = histEntry;
            clearTimeout(orderCompletedTimeout);
            showOrderCompleted.value = true;
            orderCompletedTimeout = setTimeout(() => { showOrderCompleted.value = false; }, 6000);
            announce('Tu pedido ha sido completado y ya está disponible en tu historial de compras.');
        };

        // Reabre los avisos flotantes que el usuario haya cerrado manualmente,
        // sin afectar los contadores que siguen corriendo de fondo.
        const reopenDismissedOrderWidgets = () => {
            pendingOrders.value.forEach(o => { o.widgetDismissed = false; });
            purchaseHistory.value.forEach(o => { if (o.status === 'en_proceso') o.widgetDismissed = false; });
        };
        const hasDismissedOrderWidgets = computed(() =>
            pendingOrders.value.some(o => o.widgetDismissed) ||
            purchaseHistory.value.some(o => o.status === 'en_proceso' && o.widgetDismissed)
        );

        // Un único intervalo global que hace avanzar, cada segundo, el contador
        // propio de CADA pedido en curso (esperando pago o en preparación), sin
        // importar cuántos haya a la vez.
        let masterInterval;
        const tickOrders = () => {
            pendingOrders.value.forEach(order => {
                if (order.phase === 'esperando_pago' && !order.readyForPayment && order.countdown > 0) {
                    order.countdown--;
                    if (order.countdown <= 0) order.readyForPayment = true;
                }
            });
            purchaseHistory.value.forEach(order => {
                if (order.status === 'en_proceso' && order.countdown > 0) {
                    order.countdown--;
                    if (order.countdown <= 0) completeOrder(order.id);
                }
            });
            maybeOpenNextPayment();
        };

        watch([view, isCartOpen, showOrderCompleted, showPaymentModal, selectedReviewProduct,
            showPaymentError, showSupportPanel, showPriceComparison, isDarkMode,
            isListening, voiceFeedback], () => {
            nextTick(() => { if (window.lucide) window.lucide.createIcons(); });
        });

        // El carrito fijo empuja el contenido en pantallas grandes (se ve "al
        // lado" de la tienda, no encima). En celular no hay espacio para eso,
        // así que se maneja solo por CSS (media query) como un panel deslizante.
        watch(isCartOpen, (open) => {
            document.body.classList.toggle('cart-open', open);
        });

        onMounted(() => {
            loadPurchaseHistory();
            loadLoyaltyPoints();
            loadSettings();
            document.body.classList.toggle('cart-open', isCartOpen.value);
            masterInterval = setInterval(tickOrders, 1000);
            if (window.lucide) window.lucide.createIcons();
        });

        return {
            categories, activeCategory, view, cart, isCartOpen, deliveryMethod, searchQuery,
            canHideCart, openCart, hideCart, toggleCart,
            isVoiceReaderEnabled, isDictationEnabled, isListening,
            showPaymentModal, paymentMethod, isProcessingPayment, cartTotal, closePaymentModal,
            addToCart, updateQty, removeFromCart, proceedToCheckout, confirmPayment, filteredProducts,
            paymentMethodLabel,
            // Pedidos en espera de pago (varios a la vez, cada uno con su propio contador)
            pendingOrders, PAYMENT_WAIT_SECONDS, PREP_SECONDS, finishWaitNow, openPaymentModalForOrder,
            paymentOrder, checkoutTotal, checkoutDiscount, checkoutSavings,
            // Edición y cancelación de un pedido en espera de pago
            updateOrderItemQty, removeOrderItem, canIncreaseOrderItem, cancelPendingOrder,
            reopenDismissedOrderWidgets, hasDismissedOrderWidgets,
            // Pedido completado (aviso al terminar la preparación)
            showOrderCompleted, lastCompletedOrder,
            speakProduct, announce, handleListen, formatTime, voiceHeard, voiceFeedback,
            productList, frequentProducts, purchaseHistory, clearPurchaseHistory,
            currentOrders, completedOrdersHistory,
            stockLabel, isOutOfStock, isLowStock, getStockTotal, getPuestoStock, canIncreaseCartItem,
            getReviews, selectedReviewProduct, openReviews, closeReviews,
            formatDate,
            loyaltyPoints, activeDiscount, redeemPoints, REDEEM_COST, REDEEM_DISCOUNT,
            showPaymentError, isRetrying, retryCountdown, cancelPaymentRetry,
            showSupportPanel, toggleSupportPanel, supportMessage, supportSent, sendSupportMessage,
            // Ajustes: modo oscuro y tamaño de texto
            isDarkMode, toggleDarkMode, FONT_SIZE_OPTIONS, fontSizeKey, setFontSize,
            // Comparación de precios
            showPriceComparison, selectedCompareProduct, selectedPuestoId,
            openPriceComparison, closePriceComparison, addToCartFromPuesto,
            getPrecioMin, getPrecioMax, getPuestoMasBarato, getAhorro, totalSavingsInCart
        };
    }
}).mount('#app');