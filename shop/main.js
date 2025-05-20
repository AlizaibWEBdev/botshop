let allProductsCache = {};
let chatState = {
    currentMenu: 'main',
    selectedCategory: null,
    selectedSubTopic: null,
    awaitingTrackingId: false,
    shownProductIds: []
};

const productFiles = [
    "./beanies caps for men women.json",
    "./branded hand women bags.json",
    "./Formal Dresses_men.json",
    "./Formal Dresses_women.json",
    "./high end shoes for men.json",
    "./high end shoes for women.json",
    "./lather jackets men.json",
    "./lather jackets women.json",
    "./socks for men.json",
    "./socks for women.json",
    "./sunglasses mens.json",
    "./sunglasses womens.json",
    "./tshirts shirts for men.json",
    "./tshirts shirts for women.json"
];

const faqCategories = [
    {
        id: 1, name: "Purchasing Process", keywords: ["purchase", "buy", "order", "checkout"], subTopics: [
            { id: "1.1", name: "How do I place an order", keywords: ["place order", "how to buy"], answer: "To place an order, simply add your chosen items to the cart, proceed to checkout, fill in your shipping and payment details, and confirm your order. Does this solve your issue?" },
            { id: "1.2", name: "Can I change or cancel my order", keywords: ["change order", "cancel order"], answer: "Orders can only be changed or cancelled within 1 hour of placement. Please contact support immediately if needed. Does this solve your issue?" },
            { id: "1.3", name: "Do I need an account to checkout", keywords: ["guest checkout", "account"], answer: "No, you can check out as a guest or create an account for faster future purchases. Does this solve your issue?" },
            { id: "1.4", name: "Is there a minimum order value", keywords: ["minimum order", "order value"], answer: "There is no minimum order value. You can shop as little or as much as you would like. Does this solve your issue?" }
        ]
    },
    {
        id: 2, name: "Returns & Exchanges", keywords: ["return", "exchange", "refund"], subTopics: [
            { id: "2.1", name: "What is your return policy", keywords: ["return policy"], answer: "You can return items within 30 days of delivery as long as they are unworn and in original condition. Does this solve your issue?" },
            { id: "2.2", name: "How do I return an item", keywords: ["return item"], answer: "Log in or use your order ID to request a return label, pack your item, and send it back to us. Does this solve your issue?" },
            { id: "2.3", name: "Can I exchange an item", keywords: ["exchange item"], answer: "Yes, exchanges for size or color are allowed within 30 days of delivery. Does this solve your issue?" },
            { id: "2.4", name: "How long does a refund take", keywords: ["refund time"], answer: "Refunds are processed within 5-7 business days after receiving the returned item. Does this solve your issue?" },
            { id: "2.5", name: "Do I have to pay for return shipping", keywords: ["return shipping"], answer: "We offer free return shipping on all domestic orders. Does this solve your issue?" }
        ]
    },
    {
        id: 3, name: "Delivery Timelines", keywords: ["delivery", "shipping", "timeline"], subTopics: [
            { id: "3.1", name: "When will my order arrive", keywords: ["order arrive", "delivery time"], answer: "Standard delivery takes 3-5 business days, Express delivery takes 1-2 days. Orders need 24h processing before shipment. Does this solve your issue?" },
            { id: "3.2", name: "Do you deliver on weekends", keywords: ["weekend delivery"], answer: "Deliveries are typically made on weekdays. Saturday deliveries may be available in select areas. Sunday/holidays are usually excluded. Does this solve your issue?" },
            { id: "3.3", name: "Can I get my order faster", keywords: ["faster delivery", "express"], answer: "Yes, we offer express and next-day shipping options at checkout. Does this solve your issue?" }
        ]
    },
    {
        id: 4, name: "Order Tracking", keywords: ["track", "order status", "tracking"], subTopics: [
            { id: "4.1", name: "How can I track my order", keywords: ["track order"], answer: "Please provide your tracking number to check your order status." },
            { id: "4.2", name: "My tracking number isn't working", keywords: ["tracking not working"], answer: "Please wait 24 hours for updates. If it still doesn't work, contact our support team. Does this solve your issue?" },
            { id: "4.3", name: "I haven't received tracking info", keywords: ["no tracking info"], answer: "Tracking information is emailed after shipment. Please check your spam folder or contact support. Does this solve your issue?" }
        ]
    },
    {
        id: 5, name: "Delivery Costs", keywords: ["shipping cost", "delivery fee", "cost"], subTopics: [
            { id: "5.1", name: "How much does shipping cost", keywords: ["shipping cost"], answer: "Orders under $50 incur a $5 shipping fee. Orders over $50 ship for free. Does this solve your issue?" },
            { id: "5.2", name: "Do you offer free shipping", keywords: ["free shipping"], answer: "Yes, all orders above $50 qualify for free standard shipping. Does this solve your issue?" },
            { id: "5.3", name: "Is international shipping available", keywords: ["international shipping"], answer: "Currently, we only ship within select regions. Please check availability at checkout. Does this solve your issue?" },
            { id: "5.4", name: "Are there any additional delivery fees", keywords: ["additional fees"], answer: "Additional fees may apply for express shipping or remote delivery areas. Does this solve your issue?" }
        ]
    },
    {
        id: 6, name: "Payment Methods", keywords: ["payment", "pay", "card"], subTopics: [
            { id: "6.1", name: "What payment methods do you accept", keywords: ["payment methods"], answer: "We accept Visa, MasterCard, American Express, PayPal, Apple Pay, and Google Pay. Does this solve your issue?" },
            { id: "6.2", name: "Can I pay with PayPal", keywords: ["paypal"], answer: "Yes, PayPal is available as a secure payment option at checkout. Does this solve your issue?" },
            { id: "6.3", name: "Is my payment information secure", keywords: ["payment secure"], answer: "Yes, all transactions are protected with SSL encryption. Does this solve your issue?" },
            { id: "6.4", name: "When will I be charged", keywords: ["when charged"], answer: "Your payment is processed immediately upon order confirmation. Does this solve your issue?" }
        ]
    },
    {
        id: 7, name: "Products & Availability", keywords: ["product", "stock", "availability"], subTopics: [
            { id: "7.1", name: "What products do you sell", keywords: ["products sold"], answer: "Select a product category to view available items." },
            { id: "7.2", name: "Do you offer plus sizes", keywords: ["plus sizes"], answer: "Yes, many of our items are available in sizes XS to XXL. Does this solve your issue?" },
            { id: "7.3", name: "Will you restock sold-out items", keywords: ["restock"], answer: "Some popular items may be restocked. Sign up for notifications on the product page. Does this solve your issue?" }
        ]
    },
    {
        id: 8, name: "Promotions & Discounts", keywords: ["promotion", "discount", "sale"], subTopics: [
            { id: "8.1", name: "Are there any current promotions", keywords: ["current promotions"], answer: "Visit our 'Deals' page for current offers and discounts. Does this solve your issue?" },
            { id: "8.2", name: "How do I use a promo code", keywords: ["promo code"], answer: "Enter your promo code in the 'Coupon' box at checkout. Does this solve your issue?" },
            { id: "8.3", name: "Can I use more than one promo code", keywords: ["multiple promo codes"], answer: "Only one promo code can be used per order. Does this solve your issue?" }
        ]
    },
    {
        id: 9, name: "Premium Membership", keywords: ["premium", "membership"], subTopics: [
            { id: "9.1", name: "Do you offer a premium membership", keywords: ["premium membership"], answer: "Yes, BoldThreads Premium members get perks like free shipping and exclusive discounts. Does this solve your issue?" },
            { id: "9.2", name: "What are the benefits of premium membership", keywords: ["membership benefits"], answer: "Benefits include next-day shipping, early access to new collections, and 10% off all purchases. Does this solve your issue?" },
            { id: "9.3", name: "Is there a quality guarantee", keywords: ["quality guarantee"], answer: "Yes, all items are backed by our 30-day satisfaction guarantee. Does this solve your issue?" }
        ]
    },
    {
        id: 10, name: "Physical Store", keywords: ["store", "physical store"], subTopics: [
            { id: "10.1", name: "Do you have a physical store", keywords: ["physical store"], answer: "No, we operate exclusively online to offer global convenience. Does this solve your issue?" },
            { id: "10.2", name: "Can I try items in a store", keywords: ["try items"], answer: "Unfortunately, no. But we provide detailed sizing guides and a flexible return policy. Does this solve your issue?" }
        ]
    },
    {
        id: 11, name: "Contact", keywords: ["contact", "support", "help"], subTopics: [
            { id: "11.1", name: "How can I contact support", keywords: ["contact support"], answer: "Reach us at support@boldthreads.com or call 1-800-123-4567, Mon-Fri, 9am-5pm. Does this solve your issue?" },
            { id: "11.2", name: "Do you offer live chat with a human", keywords: ["live chat"], answer: "Currently, we only offer AI-based assistance and email/phone support. Does this solve your issue?" }
        ]
    },
    {
        id: 12, name: "Complaints & Issues", keywords: ["complaint", "issue", "problem"], subTopics: [
            { id: "12.1", name: "I have a problem with my order", keywords: ["order problem"], answer: "Please contact support with your order ID, and we'll resolve the issue promptly. Does this solve your issue?" },
            { id: "12.2", name: "How do I give feedback or file a complaint", keywords: ["file complaint"], answer: "Email us at feedback@boldthreads.com or use the contact form on our website. Does this solve your issue?" },
            { id: "12.3", name: "My order arrived damaged or incorrect", keywords: ["damaged order"], answer: "We are sorry! You can return or exchange the item free of charge. Contact support to begin. Does this solve your issue?" }
        ]
    }
];

function loadChatState() {
    const state = localStorage.getItem('chatState');
    return state ? JSON.parse(state) : {
        currentMenu: 'main',
        selectedCategory: null,
        selectedSubTopic: null,
        awaitingTrackingId: false,
        shownProductIds: []
    };
}

function saveChatState(state) {
    localStorage.setItem('chatState', JSON.stringify(state));
}

async function addToCart(product) {
    let quantity = 1;
    const { id, title, price, imageUrl, user_id } = product;

    if (!id || !title || !price || !imageUrl || !user_id) {
        console.error("Missing required product fields");
        addMessageToChat("Sorry, there was an issue adding the product to your cart. Please try again.", 'bot-message');
        return;
    }

    try {
        const response = await fetch("https://fitedit.tooliso.com/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                user_id,
                id,
                title,
                price,
                quantity,
                imageUrl,
            }),
        });

        const data = await response.json();
        updateCartItemCount();
        if (response.ok) {
            addMessageToChat("Product added to cart successfully!", 'bot-message');
            return data;
        } else {
            addMessageToChat(`Error: ${data.message}`, 'bot-message');
        }
    } catch (err) {
        console.error("Server error:", err);
        addMessageToChat("Sorry, there was a server error. Please try again later.", 'bot-message');
    }
}

async function trackOrder(trackingId) {
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    if (!userId) {
        return { success: false, message: "User not logged in" };
    }

    try {
        const response = await fetch(`https://fitedit.tooliso.com/orders/track?user_id=${userId}&trackingId=${trackingId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });

        const data = await response.json();
        if (response.ok) {
            return {
                success: true,
                order: data.order
            };
        } else {
            return {
                success: false,
                message: data.message
            };
        }
    } catch (err) {
        console.error("Error tracking order:", err);
        return {
            success: false,
            message: "Server error while tracking order"
        };
    }
}

function toggleChatbot() {
    document.querySelector(".chatbot-icon").classList.toggle("msg");
    const chatbotPopup = document.getElementById('chatbotPopup');
    chatbotPopup.classList.toggle('active');
    if (chatbotPopup.classList.contains('active')) {
        loadChatMessages();
    }
}

function loadChatMessages() {
    chatState = loadChatState();
    const chatbotBody = document.getElementById('chatbotBody');
    chatbotBody.innerHTML = '';
    addMessageToChat("Hello! Welcome to FitEdit. I'm here to assist with your shopping needs. Would you like help today?", 'bot-message', false);
    displayYesNoButtons();
}

function displayYesNoButtons() {
    const chatbotBody = document.getElementById('chatbotBody');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const yesButton = document.createElement('button');
    yesButton.className = 'chatbot-option-button';
    yesButton.textContent = 'Yes';
    yesButton.onclick = () => handleYesResponse();
    buttonContainer.appendChild(yesButton);

    const noButton = document.createElement('button');
    noButton.className = 'chatbot-option-button';
    noButton.textContent = 'No';
    noButton.onclick = () => handleNoResponse();
    buttonContainer.appendChild(noButton);

    const restartButton = document.createElement('button');
    restartButton.className = 'chatbot-option-button';
    restartButton.textContent = 'Restart Chat';
    restartButton.onclick = () => {
        chatState = {
            currentMenu: 'main',
            selectedCategory: null,
            selectedSubTopic: null,
            awaitingTrackingId: false,
            shownProductIds: []
        };
        saveChatState(chatState);
        loadChatMessages();
    };
    buttonContainer.appendChild(restartButton);

    chatbotBody.appendChild(buttonContainer);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function handleYesResponse() {
    chatState.currentMenu = 'categories';
    saveChatState(chatState);
    addMessageToChat('You: Yes', 'user-message');
    displayCategoryMenu();
}

function handleNoResponse() {
    chatState.currentMenu = 'main';
    saveChatState(chatState);
    addMessageToChat('You: No', 'user-message');
    addMessageToChat("Thank you! I'm here if you need assistance later.", 'bot-message');
}

function displayCategoryMenu() {
    const chatbotBody = document.getElementById('chatbotBody');
    addMessageToChat('Please select a topic (type the number, keyword, or click a button):', 'bot-message', false);
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    faqCategories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'chatbot-option-button';
        button.textContent = `${category.id}. ${category.name}`;
        button.onclick = () => handleCategorySelection(category.id, `${category.id}`);
        buttonContainer.appendChild(button);
    });

    chatbotBody.appendChild(buttonContainer);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function handleCategorySelection(categoryId, userInput) {
    const category = faqCategories.find(c => c.id === categoryId);
    if (!category) {
        addMessageToChat('Invalid selection. Please choose a valid topic number or keyword.', 'bot-message');
        displayCategoryMenu();
        return;
    }

    chatState.selectedCategory = category;
    chatState.currentMenu = 'subTopics';
    saveChatState(chatState);
    addMessageToChat(`You: ${userInput}`, 'user-message');
    displaySubTopicMenu(category);
}

function displaySubTopicMenu(category) {
    const chatbotBody = document.getElementById('chatbotBody');
    addMessageToChat(`Selected: ${category.name}. Please choose a sub-topic (type the number, keyword, or click a button):`, 'bot-message', false);
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    category.subTopics.forEach(subTopic => {
        const button = document.createElement('button');
        button.className = 'chatbot-option-button';
        button.textContent = `${subTopic.id}. ${subTopic.name}`;
        button.onclick = () => handleSubTopicSelection(subTopic.id, subTopic.id);
        buttonContainer.appendChild(button);
    });

    const backButton = document.createElement('button');
    backButton.className = 'chatbot-option-button';
    backButton.textContent = 'Back to Topics';
    backButton.onclick = () => {
        chatState.currentMenu = 'categories';
        saveChatState(chatState);
        addMessageToChat('You: Back', 'user-message');
        displayCategoryMenu();
    };
    buttonContainer.appendChild(backButton);

    chatbotBody.appendChild(buttonContainer);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function handleSubTopicSelection(subTopicId, userInput) {
    const subTopic = chatState.selectedCategory.subTopics.find(s => s.id === subTopicId);
    if (!subTopic) {
        addMessageToChat('Invalid selection. Please choose a valid sub-topic number or keyword.', 'bot-message');
        displaySubTopicMenu(chatState.selectedCategory);
        return;
    }

    chatState.selectedSubTopic = subTopic;
    saveChatState(chatState);
    addMessageToChat(`You: ${userInput}`, 'user-message');

    if (subTopic.id === '4.1') { // Track my order
        chatState.awaitingTrackingId = true;
        saveChatState(chatState);
        addMessageToChat(subTopic.answer, 'bot-message');
    } else if (subTopic.id === '7.1') { // What products do you sell
        chatState.currentMenu = 'productCategories';
        saveChatState(chatState);
        displayProductCategories();
    } else {
        addMessageToChat(subTopic.answer, 'bot-message');
        if (subTopic.answer.includes('Does this solve your issue?')) {
            displayYesNoResolutionButtons();
        }
    }
}

function displayProductCategories() {
    const chatbotBody = document.getElementById('chatbotBody');
    addMessageToChat('Please select a product category (type the number, keyword, or click a button):', 'bot-message', false);
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    productFiles.forEach((file, index) => {
        const categoryName =  file.toLocaleLowerCase().replace('.json', '').replace('./', '').replace(/_/g, ' ').replace("mens","men").replace("womens","women").replace("lather","leather")
        const button = document.createElement('button');
        button.className = 'chatbot-option-button';
        button.textContent = `${index + 1}. ${categoryName}`;
        button.onclick = () => handleProductCategorySelection(file, `${index + 1}`);
        buttonContainer.appendChild(button);
    });

    const backButton = document.createElement('button');
    backButton.className = 'chatbot-option-button';
    backButton.textContent = 'Back to Topics';
    backButton.onclick = () => {
        chatState.currentMenu = 'categories';
        saveChatState(chatState);
        addMessageToChat('You: Back', 'user-message');
        displayCategoryMenu();
    };
    buttonContainer.appendChild(backButton);

    chatbotBody.appendChild(buttonContainer);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

async function handleProductCategorySelection(file, userInput) {
    addMessageToChat(`You: ${userInput}`, 'user-message');
    await renderProductsByCategory(file, 5);
    const products = allProductsCache[file].slice(0, 5);
    displayProductRecommendations(products, file);
}

function displayProductRecommendations(products, file) {
    const chatbotBody = document.getElementById('chatbotBody');
    const productsContainer = document.createElement('div');
    productsContainer.className = 'product-recommendations';
    productsContainer.dataset.currentIndex = '0';

    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = `chatbot-product-card ${index === 0 ? 'active' : ''}`;
        productCard.dataset.index = index;
        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h4>${product.title}</h4>
                <p>Price: $${parseFloat(product.price || 9).toFixed(2)}</p>
                <button class="view-product-btn">View Product</button>
                <button class="view-product-btn add-to-cart-btn">+ Add to Cart</button>
            </div>
        `;

        const addToCartButton = productCard.querySelector('.add-to-cart-btn');
        addToCartButton.addEventListener('click', () => {
            addToCart({
                imageUrl: product.imageUrl,
                title: product.title,
                price: parseFloat(product.price || 9),
                id: product.asin,
                user_id: JSON.parse(localStorage.getItem('user'))?.id
            });
        });

        const viewProductButton = productCard.querySelector('.view-product-btn');
        viewProductButton.addEventListener('click', () => {
            showProductPopup(product);
        });

        productsContainer.appendChild(productCard);
        chatState.shownProductIds.push(product.asin || product.title);
    });

    if (products.length > 1) {
        const leftArrow = document.createElement('div');
        leftArrow.className = 'nav-arrow left';
        leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
        leftArrow.onclick = () => navigateProducts(productsContainer, -1);
        productsContainer.appendChild(leftArrow);

        const rightArrow = document.createElement('div');
        rightArrow.className = 'nav-arrow right';
        rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
        rightArrow.onclick = () => navigateProducts(productsContainer, 1);
        productsContainer.appendChild(rightArrow);
    }

    chatbotBody.appendChild(productsContainer);
    addMessageToChat('Browse these products using the arrows. Would you like to see more?', 'bot-message');
    displayYesNoProductButtons(file);
    saveChatState(chatState);
}

function displayYesNoProductButtons(file) {
    const chatbotBody = document.getElementById('chatbotBody');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const yesButton = document.createElement('button');
    yesButton.className = 'chatbot-option-button';
    yesButton.textContent = 'Yes';
    yesButton.onclick = () => {
        addMessageToChat('You: Yes', 'user-message');
        renderProductsByCategory(file, 5);
        const products = allProductsCache[file].slice(5, 10).filter(p => !chatState.shownProductIds.includes(p.asin || p.title));
        displayProductRecommendations(products, file);
    };
    buttonContainer.appendChild(yesButton);

    const noButton = document.createElement('button');
    noButton.className = 'chatbot-option-button';
    noButton.textContent = 'No';
    noButton.onclick = () => {
        addMessageToChat('You: No', 'user-message');
        chatState.currentMenu = 'categories';
        saveChatState(chatState);
        displayCategoryMenu();
    };
    buttonContainer.appendChild(noButton);

    chatbotBody.appendChild(buttonContainer);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function displayYesNoResolutionButtons() {
    const chatbotBody = document.getElementById('chatbotBody');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const yesButton = document.createElement('button');
    yesButton.className = 'chatbot-option-button';
    yesButton.textContent = 'Yes';
    yesButton.onclick = () => {
        addMessageToChat('You: Yes', 'user-message');
        addMessageToChat("Great! I'm here if you need more help.", 'bot-message');
        chatState.currentMenu = 'main';
        saveChatState(chatState);
        displayYesNoButtons();
    };
    buttonContainer.appendChild(yesButton);

    const noButton = document.createElement('button');
    noButton.className = 'chatbot-option-button';
    noButton.textContent = 'No';
    noButton.onclick = () => {
        addMessageToChat('You: No', 'user-message');
        chatState.currentMenu = 'categories';
        saveChatState(chatState);
        displayCategoryMenu();
    };
    buttonContainer.appendChild(noButton);

    chatbotBody.appendChild(buttonContainer);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

function navigateProducts(container, direction) {
    const currentIndex = parseInt(container.dataset.currentIndex);
    const cards = container.querySelectorAll('.chatbot-product-card');
    const newIndex = Math.max(0, Math.min(currentIndex + direction, cards.length - 1));

    cards[currentIndex].classList.remove('active');
    cards[newIndex].classList.add('active');
    container.dataset.currentIndex = newIndex;
}

function handleInput(event) {
    if (event.key === 'Enter') {
        sendMessageCommon();
    }
}

function sendMessageClick() {
    sendMessageCommon();
}

async function simulateTyping() {
    const typingIndicator = addMessageToChat('<i class="fas fa-spinner fa-spin"></i> Typing...', 'bot-message');
    await new Promise(resolve => setTimeout(resolve, 1000));
    typingIndicator.remove();
}

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
    const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + indicator
            );
        }
    }
    return matrix[b.length][a.length];
}

async function sendMessageCommon() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim().toLowerCase();

    if (!message) return;

    addMessageToChat(`You: ${input.value}`, 'user-message');
    input.value = '';

    await simulateTyping();

    chatState = loadChatState();

    if (chatState.awaitingTrackingId) {
        chatState.awaitingTrackingId = false;
        saveChatState(chatState);
        const trackingResult = await trackOrder(message);
        if (trackingResult.success) {
            const { order } = trackingResult;
            const responseText = `
                Here are the details for your order (Tracking ID: ${order.trackingId}):
                - Status: ${order.status}
                - Total Amount: $${order.totalAmount.toFixed(2)}
                - Order Date: ${new Date(order.orderDate).toLocaleDateString()}
                - Items: ${order.items.map(item => item.title).join(', ')}
                - Shipping Address: ${order.address}
                Does this solve your issue?
            `;
            addMessageToChat(responseText, 'bot-message');
            displayYesNoResolutionButtons();
        } else {
            addMessageToChat(`Sorry, ${trackingResult.message}. Please provide a valid tracking ID.`, 'bot-message');
            chatState.awaitingTrackingId = true;
            saveChatState(chatState);
        }
        return;
    }

    if (message === 'restart') {
        chatState = {
            currentMenu: 'main',
            selectedCategory: null,
            selectedSubTopic: null,
            awaitingTrackingId: false,
            shownProductIds: []
        };
        saveChatState(chatState);
        loadChatMessages();
        return;
    }

    if (chatState.currentMenu === 'main') {
        if (message === 'yes' || message === 'y') {
            handleYesResponse();
        } else if (message === 'no' || message === 'n') {
            handleNoResponse();
        } else {
            handleKeywordInput(message);
        }
    } else if (chatState.currentMenu === 'categories') {
        const categoryId = parseInt(message);
        if (faqCategories.find(c => c.id === categoryId)) {
            handleCategorySelection(categoryId, message);
        } else {
            handleKeywordInput(message);
        }
    } else if (chatState.currentMenu === 'subTopics') {
        if (message === 'back') {
            chatState.currentMenu = 'categories';
            saveChatState(chatState);
            addMessageToChat('You: back', 'user-message');
            await simulateTyping();
            displayCategoryMenu();
        } else {
            const subTopic = chatState.selectedCategory.subTopics.find(s => s.id === message);
            if (subTopic) {
                handleSubTopicSelection(subTopic.id, message);
            } else {
                handleKeywordInput(message);
            }
        }
    } else if (chatState.currentMenu === 'productCategories') {
        if (message === 'back') {
            chatState.currentMenu = 'categories';
            saveChatState(chatState);
            addMessageToChat('You: back', 'user-message');
            await simulateTyping();
            displayCategoryMenu();
        } else {
            const index = parseInt(message) - 1;
            if (index >= 0 && index < productFiles.length) {
                handleProductCategorySelection(productFiles[index], message);
            } else {
                handleKeywordInput(message);
            }
        }
    }
}

function handleKeywordInput(message) {
    const threshold = 3; // Levenshtein distance threshold for fuzzy matching

    // Check for category keywords
    for (const category of faqCategories) {
        if (category.keywords.some(keyword => message.includes(keyword)) ||
            category.name.toLowerCase().includes(message) ||
            levenshtein(message, category.name.toLowerCase()) <= threshold) {
            handleCategorySelection(category.id, message);
            return;
        }
        // Check for sub-topic keywords
        for (const subTopic of category.subTopics) {
            if (subTopic.keywords.some(keyword => message.includes(keyword)) ||
                subTopic.name.toLowerCase().includes(message) ||
                levenshtein(message, subTopic.name.toLowerCase()) <= threshold) {
                chatState.selectedCategory = category;
                chatState.currentMenu = 'subTopics';
                saveChatState(chatState);
                handleSubTopicSelection(subTopic.id, message);
                return;
            }
        }
    }

    // Check for product category keywords
    for (let i = 0; i < productFiles.length; i++) {
        const categoryName = productFiles[i].replace('.json', '').replace('./', '').replace(/_/g, ' ').toLowerCase();
        if (message.includes(categoryName) ||
            productFiles[i].toLowerCase().includes(message) ||
            levenshtein(message, categoryName) <= threshold) {
            chatState.currentMenu = 'productCategories';
            saveChatState(chatState);
            handleProductCategorySelection(productFiles[i], message);
            return;
        }
    }

    // Fallback for unrecognized input
    addMessageToChat('Sorry, I didn’t understand your request. Please select a valid number, keyword, or click a button. You can also type "restart" to start over.', 'bot-message');
    if (chatState.currentMenu === 'categories') {
        displayCategoryMenu();
    } else if (chatState.currentMenu === 'subTopics') {
        displaySubTopicMenu(chatState.selectedCategory);
    } else if (chatState.currentMenu === 'productCategories') {
        displayProductCategories();
    } else {
        displayYesNoButtons();
    }
}

function addMessageToChat(text, className, scroll = true) {
    const chatbotBody = document.getElementById('chatbotBody');
    const newMessage = document.createElement('div');
    newMessage.className = `chatbot-message ${className}`;
    newMessage.innerHTML = text;
    newMessage.style.opacity = '0';
    newMessage.style.transition = 'opacity 0.3s ease-in';
    chatbotBody.appendChild(newMessage);
    setTimeout(() => {
        newMessage.style.opacity = '1';
    }, 10);
    if (scroll) {
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }
    return newMessage;
}

function showProductPopup(product) {
    document.getElementById('popupImage').src = product.imageUrl;
    document.getElementById('popupImage').alt = product.title;
    document.getElementById('popupTitle').textContent = product.title;
    document.getElementById('popupPrice').textContent = `$${parseFloat(product.price || 9).toFixed(2)}`;
    document.getElementById('popupInsight').textContent = `Great choice! This ${product.title} is perfect for your style!`;

    document.getElementById('productPopup').classList.add('active');
    document.getElementById('popupOverlay').classList.add('active');
}

function closePopup() {
    document.getElementById('productPopup').classList.remove('active');
    document.getElementById('popupOverlay').classList.remove('active');
}

async function renderCategoryButtons() {
    const categoryButtons = document.getElementById('categoryButtons');
    categoryButtons.innerHTML = '';

    const categories = productFiles.map(file => ({
        file,
        name: file.replace('.json', '').replace('./', '').replace(/_/g, ' ')
    }));

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category.name;
        button.onclick = () => renderProductsByCategory(category.file);
        categoryButtons.appendChild(button);
    });

    const mixedButton = document.createElement('button');
    mixedButton.className = 'category-button';
    mixedButton.textContent = 'Mixed Products (100)';
    mixedButton.onclick = renderMixedProducts;
    categoryButtons.appendChild(mixedButton);

    categoryButtons.style.transform = 'translateX(0px)';
    document.querySelector('.category-nav-arrow.left').style.display = 'flex';
    document.querySelector('.category-nav-arrow.right').style.display = 'flex';
}

async function updateCartItemCount() {
    let token = localStorage.getItem("token");
    let userId = JSON.parse(localStorage.getItem("user"))?.id;
    let cartItemsCount = document.getElementById("cartItemsCount");
    let cartItemsCountDesktop = document.getElementById("cartItemsCountDesktop");
    try {
        const response = await fetch(`https://fitedit.tooliso.com/cart/count?user_id=${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        if (response.ok) {
            cartItemsCount.textContent = data.count || 0;
            cartItemsCountDesktop.textContent = data.count || 0;
        } else {
            console.error("Failed to fetch cart count:", data.message);
            cartItemsCount.textContent = "0";
            cartItemsCountDesktop.textContent = "0";
        }
    } catch (error) {
        console.error("Error fetching cart count:", error);
        cartItemsCount.textContent = "0";
        cartItemsCountDesktop.textContent = "0";
    }
}

function scrollCategories(direction) {
    const categoryButtons = document.getElementById('categoryButtons');
    const buttonWidth = categoryButtons.querySelector('.category-button')?.offsetWidth + 10 || 100;
    const containerWidth = document.querySelector('.category-buttons-container').offsetWidth;
    const maxScroll = (categoryButtons.children.length * buttonWidth) - containerWidth;

    let currentScroll = 0;
    const transform = categoryButtons.style.transform;
    if (transform && transform.includes('translateX')) {
        const match = transform.match(/translateX\(-?(\d*\.?\d*)px\)/);
        currentScroll = match ? parseFloat(match[1]) : 0;
    }

    currentScroll += direction * buttonWidth * 3;
    currentScroll = Math.max(0, Math.min(currentScroll, maxScroll));

    categoryButtons.style.transform = `translateX(-${currentScroll}px)`;

    document.querySelector('.category-nav-arrow.left').style.display = 'flex';
    document.querySelector('.category-nav-arrow.right').style.display = 'flex';
}

async function renderProductsByCategory(file, limit = Infinity) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '<p>Loading products...</p>';

    try {
        const products = allProductsCache[file];
        productGrid.innerHTML = '';

        const minPrice = 9;
        const maxPrice = 100;

        for (const product of products.slice(0, limit)) {
            const priceGenerated = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
            if (product.price && typeof product.price === 'string' && product.price.includes('$')) {
                product.price = parseFloat(product.price.replace('$', ''));
            }
            const price = product.price ? product.price : priceGenerated;
            const formattedPrice = `$${parseFloat(price).toFixed(2)}`;

            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const img = document.createElement('img');
            img.src = product.imageUrl || 'https://via.placeholder.com/150';
            img.alt = product.title || 'Product Image';
            productCard.appendChild(img);

            const title = document.createElement('p');
            title.textContent = (product.title || 'Untitled Product').slice(0, 100);
            productCard.appendChild(title);

            const priceDiv = document.createElement('div');
            priceDiv.className = 'price';
            priceDiv.textContent = `Price: ${formattedPrice}`;
            productCard.appendChild(priceDiv);

            const button = document.createElement('button');
            button.className = 'add-to-cart';
            button.textContent = 'Add to Cart';
            button.addEventListener('click', () => {
                addToCart({
                    imageUrl: product.imageUrl,
                    title: product.title,
                    price: price,
                    id: product.asin,
                    user_id: JSON.parse(localStorage.getItem('user'))?.id
                });
            });
            productCard.appendChild(button);

            productGrid.appendChild(productCard);
        }
    } catch (error) {
        console.error('Error rendering products:', error);
        productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
}

async function renderMixedProducts(limit = 100) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '<p>Loading products...</p>';

    try {
        let allProducts = [];
        for (const file in allProductsCache) {
            allProducts = allProducts.concat(allProductsCache[file]);
        }

        for (let i = allProducts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
        }

        productGrid.innerHTML = '';

        const minPrice = 9;
        const maxPrice = 100;

        for (const product of allProducts.slice(0, limit)) {
            const priceGenerated = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
            if (product.price && typeof product.price === 'string' && product.price.includes('$')) {
                product.price = parseFloat(product.price.replace('$', ''));
            }
            const price = product.price ? product.price : priceGenerated;
            const formattedPrice = `$${parseFloat(price).toFixed(2)}`;

            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const img = document.createElement('img');
            img.src = product.imageUrl || 'https://via.placeholder.com/150';
            img.alt = product.title || 'Product Image';
            productCard.appendChild(img);

            const title = document.createElement('p');
            title.textContent = (product.title || 'Untitled Product').slice(0, 100);
            productCard.appendChild(title);

            const priceDiv = document.createElement('div');
            priceDiv.className = 'price';
            priceDiv.textContent = `Price: ${formattedPrice}`;
            productCard.appendChild(priceDiv);

            const button = document.createElement('button');
            button.className = 'add-to-cart';
            button.textContent = 'Add to Cart';
            button.addEventListener('click', () => {
                addToCart({
                    imageUrl: product.imageUrl || 'https://via.placeholder.com/150',
                    title: product.title || 'Untitled Product',
                    price: price,
                    id: product.asin,
                    user_id: JSON.parse(localStorage.getItem('user'))?.id
                });
            });
            productCard.appendChild(button);

            productGrid.appendChild(productCard);
        }
    } catch (error) {
        console.error('Error rendering mixed products:', error);
        productGrid.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    await Promise.all(productFiles.map(async file => {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Failed to fetch ${file}`);
            allProductsCache[file] = await response.json();
        } catch (error) {
            console.error(`Error preloading ${file}:`, error);
        }
    }));
    updateCartItemCount();
    renderCategoryButtons();
    renderMixedProducts();
    document.getElementById('popupOverlay').addEventListener('click', closePopup);
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../login.html';
}

let token = localStorage.getItem("token");
if (!token) {
    window.location.href = "../login.html";
}