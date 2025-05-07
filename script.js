const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Auto-resize textarea
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const time = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-time">${time}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

async function generateResponse(userMessage) {
    // Simulated API call - Replace with actual ChatGPT API integration
    return new Promise(resolve => {
        setTimeout(() => {
            const responses = {
                hello: "Hello! How can I assist you today? 😊",
                help: "I'm here to help with any questions you have!",
                joke: "Why don't scientists trust atoms? Because they make up everything!",
                bye: "Goodbye! Feel free to ask more questions anytime!",
                default: "That's interesting! Could you please elaborate more?"
            };

            const lowerMsg = userMessage.toLowerCase();
            const response = 
                responses[lowerMsg] || responses.default;
            
            resolve(response);
        }, Math.random() * 1000 + 500);
    });
}

async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    userInput.value = '';
    
    // Show typing indicator
    const typingIndicator = showTypingIndicator();
    
    try {
        const response = await generateResponse(message);
        chatMessages.removeChild(typingIndicator);
        addMessage(response, 'bot');
    } catch (error) {
        chatMessages.removeChild(typingIndicator);
        addMessage("Sorry, I'm having trouble responding. Please try again.", 'bot');
    }
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});

// Initial focus on input
userInput.focus();