const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SITE_URL = 'https://alhasibchatgpt.com'; // আপনার সাইটের URL
const SITE_NAME = 'Al Hasib Chat GPT';

// কনভার্সেশন হিস্ট্রি
let conversationHistory = [
    {
        role: 'system',
        content: 'You are Al Hasib Chat GPT, a highly intelligent and conversational AI designed to assist users with accurate and helpful responses. You should respond in a friendly, professional, and natural manner, similar to ChatGPT. If asked about your identity, state that you are "Al Hasib Chat GPT, created by Al Hasib." Always respond in English unless explicitly asked otherwise.'
    }
];

// ইউজার ইনপুট পাঠানোর ফাংশন
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // ইউজার মেসেজ দেখানো
    appendMessage('user', message);
    userInput.value = '';

    // লোডিং মেসেজ
    const loadingMessage = appendMessage('bot', 'Typing...');

    // কনভার্সেশন হিস্ট্রিতে ইউজার মেসেজ যোগ করা
    conversationHistory.push({ role: 'user', content: message });

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
                messages: conversationHistory,
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content;

        // লোডিং মেসেজ রিমুভ করে বটের রিপ্লাই দেখানো
        chatBody.removeChild(loadingMessage);
        appendMessage('bot', botReply);

        // কনভার্সেশন হিস্ট্রিতে বটের রিপ্লাই যোগ করা
        conversationHistory.push({ role: 'assistant', content: botReply });

        // হিস্ট্রি সীমিত রাখা (সর্বোচ্চ 10টি মেসেজ)
        if (conversationHistory.length > 10) {
            conversationHistory = [conversationHistory[0], ...conversationHistory.slice(-9)];
        }
    } catch (error) {
        console.error('Error:', error);
        chatBody.removeChild(loadingMessage);
        appendMessage('bot', 'Sorry, something went wrong. Please try again.');
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