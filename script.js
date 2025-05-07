const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SITE_URL = 'https://hasibchatgpt.com'; // আপনার সাইটের URL
const SITE_NAME = 'হাসিব চ্যাট জিপিটি';

// ইউজার ইনপুট পাঠানোর ফাংশন
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // ইউজার মেসেজ দেখানো
    appendMessage('user', message);
    userInput.value = '';
    
    // লোডিং মেসেজ
    const loadingMessage = appendMessage('bot', 'টাইপ করছে...');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': SITE_URL,
                'X-Title': SITE_NAME,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-4-1106-preview',
                messages: [
                    { role: 'user', content: message }
                ]
            })
        });

        const data = await response.json();
        const botReply = data.choices[0].message.content;

        // লোডিং মেসেজ রিমুভ করে বটের রিপ্লাই দেখানো
        chatBody.removeChild(loadingMessage);
        appendMessage('bot', botReply);
    } catch (error) {
        console.error('Error:', error);
        chatBody.removeChild(loadingMessage);
        appendMessage('bot', 'দুঃখিত, কিছু ভুল হয়েছে। আবার চেষ্টা করুন।');
    }

    // স্ক্রল নিচে নিয়ে যাওয়া
    chatBody.scrollTop = chatBody.scrollHeight;
}

// মেসেজ যোগ করার ফাংশন
function appendMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${role}-message`);
    messageDiv.innerHTML = `<p>${content}</p>`;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return messageDiv;
}

// বাটনে ক্লিক করলে মেসেজ পাঠানো
sendButton.addEventListener('click', sendMessage);

// এন্টার প্রেস করলে মেসেজ পাঠানো
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});