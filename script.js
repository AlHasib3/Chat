const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function botResponse(input) {
    return `You said: ${input}`;
}

sendBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    userInput.value = '';
    setTimeout(() => {
        appendMessage(botResponse(text), 'bot');
    }, 500);
});

userInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendBtn.click();
});
