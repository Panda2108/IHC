const { createApp, ref, computed, watch, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // MockData integrada apuntando a tu carpeta local 'imagenes'
        const categories = ["TODOS", "ALIMENTOS BÁSICOS", "HIGIENE PERSONAL", "LIMPIEZA DEL HOGAR"];
        const products = [
            // === ALIMENTOS BÁSICOS ===
            { id: 1, name: "Arroz Faraon 750g", price: 12.50, category: "ALIMENTOS BÁSICOS", img: "imagenes/arroz.jpg", offer: false },
            { id: 2, name: "Fideos Nicolini 500g", price: 2.90, category: "ALIMENTOS BÁSICOS", img: "imagenes/fideos.jpg", offer: true, oldPrice: 4.50 },
            { id: 3, name: "Aceite UNO 900 ml", price: 4.00, category: "ALIMENTOS BÁSICOS", img: "imagenes/aceite.jpg", offer: false },
            { id: 4, name: "Sal Marina 1Kg", price: 1.50, category: "ALIMENTOS BÁSICOS", img: "imagenes/sal.jpg", offer: true, oldPrice: 3.00 },
            { id: 5, name: "Lenteja bebe 500g", price: 4.00, category: "ALIMENTOS BÁSICOS", img: "imagenes/lentejas.jpg", offer: true, oldPrice: 5.00 },
            { id: 6, name: "Frijol Canario 500g", price: 8.50, category: "ALIMENTOS BÁSICOS", img: "imagenes/frejol_canario.jpg", offer: false },
            { id: 7, name: "Quinua 500g", price: 8.30, category: "ALIMENTOS BÁSICOS", img: "imagenes/quinua.jpg", offer: false },
            { id: 8, name: "Avena clasica 900g", price: 9.00, category: "ALIMENTOS BÁSICOS", img: "imagenes/avena.jpg", offer: true, oldPrice: 11.90 },

            // === HIGIENE PERSONAL ===
            { id: 9, name: "Jabón Protex", price: 2.50, category: "HIGIENE PERSONAL", img: "imagenes/jabon.jpg", offer: false },
            { id: 10, name: "Pasta Dental Kolinos", price: 8.50, category: "HIGIENE PERSONAL", img: "imagenes/pasta_dental.jpg", offer: false },
            { id: 11, name: "Champú Head&Sholder", price: 13.50, category: "HIGIENE PERSONAL", img: "imagenes/champu.jpg", offer: true, oldPrice: 28.50 },
            { id: 12, name: "Desodorante Rexona", price: 9.90, category: "HIGIENE PERSONAL", img: "imagenes/desodorante.jpg", offer: false },

            // === LIMPIEZA DEL HOGAR ===
             { id: 13, name: "Jabón Popeye", price: 1.90, category: "LIMPIEZA DEL HOGAR", img: "imagenes/jabon_ropa.jpg", offer: false },
            { id: 14, name: "Detergente Patito 140g", price: 1.20, category: "LIMPIEZA DEL HOGAR", img: "imagenes/detergente.jpg", offer: true, oldPrice: 3.00 },
            { id: 15, name: "Limpiador Dkasa 4L", price: 11.50, category: "LIMPIEZA DEL HOGAR", img: "imagenes/limpiador.jpg", offer: false },
            { id: 16, name: "Lavavajillas Sapolio 800g", price: 5.00, category: "LIMPIEZA DEL HOGAR", img: "imagenes/lavavajilla.jpg", offer: false },
            { id: 17, name: "Lejia Aro 5L", price: 8.50, category: "LIMPIEZA DEL HOGAR", img: "imagenes/lejia.jpg", offer: true, oldPrice: 19.00 }
        ];

        // Estados Reactivos
        const activeCategory = ref('TODOS');
        const view = ref('tienda'); 
        const cart = ref([]);
        const isCartOpen = ref(false);
        const isSearchOpen = ref(false);
        const deliveryMethod = ref('recoger');
        const searchQuery = ref('');

        const isVoiceReaderEnabled = ref(false);
        const isDictationEnabled = ref(false);
        const isListening = ref(false);
        const showOrderSuccess = ref(false);
        const countdown = ref(0);
        const activeOrder = ref([]);

        // Métodos de Carrito
        const addToCart = (product) => {
            const existing = cart.value.find(item => item.id === product.id);
            if (existing) {
                existing.qty += 1;
            } else {
                cart.value.push({ ...product, qty: 1 });
            }
            isCartOpen.value = true;
        };

        const updateQty = (id, delta) => {
            const item = cart.value.find(item => item.id === id);
            if (item) {
                item.qty += delta;
                if (item.qty <= 0) {
                    removeFromCart(id);
                }
            }
        };

        const removeFromCart = (id) => {
            cart.value = cart.value.filter(item => item.id !== id);
        };

        const handleCheckout = () => {
            if (activeOrder.value.length > 0 && countdown.value > 0) {
                const updatedOrder = [...activeOrder.value];
                cart.value.forEach(cartItem => {
                    const existing = updatedOrder.find(item => item.id === cartItem.id);
                    if (existing) {
                        existing.qty += cartItem.qty;
                    } else {
                        updatedOrder.push({ ...cartItem });
                    }
                });
                activeOrder.value = updatedOrder;
                cart.value = [];
                isCartOpen.value = false;
            } else {
                activeOrder.value = [...cart.value];
                showOrderSuccess.value = true;
                countdown.value = 300; // 5 minutos
                cart.value = [];
                isCartOpen.value = false;
            }
        };

        // Filtro de Productos Computado
        const filteredProducts = computed(() => {
            return products.filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase());
                const matchesCategory = activeCategory.value === 'TODOS' || p.category === activeCategory.value;
                if (view.value === 'ofertas') return p.offer && matchesSearch && matchesCategory;
                return matchesSearch && matchesCategory;
            });
        });

        // Funciones de Accesibilidad de Voz
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
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => isListening.value = true;
            recognition.onresult = (event) => {
                searchQuery.value = event.results[0][0].transcript;
                isListening.value = false;
            };
            recognition.onerror = () => isListening.value = false;
            recognition.onend = () => isListening.value = false;

            if (isListening.value) {
                recognition.stop();
            } else {
                recognition.start();
            }
        };

        // Formateador de Tiempo
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        };

        // Manejo del Temporizador
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

        // Forzar renderizado de iconos de Lucide al mutar el DOM
        watch([view, isCartOpen, isSearchOpen, showOrderSuccess], () => {
            nextTick(() => {
                if(window.lucide) window.lucide.createIcons();
            });
        });

        onMounted(() => {
            if(window.lucide) window.lucide.createIcons();
        });

        return {
            categories,
            activeCategory,
            view,
            cart,
            isCartOpen,
            isSearchOpen,
            deliveryMethod,
            searchQuery,
            isVoiceReaderEnabled,
            isDictationEnabled,
            isListening,
            showOrderSuccess,
            countdown,
            activeOrder,
            addToCart,
            updateQty,
            removeFromCart,
            handleCheckout,
            filteredProducts,
            speakProduct,
            handleListen,
            formatTime
        };
    }
}).mount('#app');