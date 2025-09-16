// API configuration
const API_KEY = 'AIzaSyB1w_mkC6aGf_wn6j8xlh-zPwxvgmHdYe0';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');
const errorMessage = document.getElementById('error-message');

// Function to add a message to the chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show/hide typing indicator
function showTypingIndicator(show) {
    typingIndicator.style.display = show ? 'block' : 'none';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Function to send message to Gemini API
async function sendMessageToGemini(message) {
    showTypingIndicator(true);
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to get response from Gemini API');
        }
        
        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text;
        
        showTypingIndicator(false);
        addMessage(responseText, false);
    } catch (error) {
        showTypingIndicator(false);
        showError(`Error: ${error.message}`);
        console.error('Error:', error);
    }
}

// Function to handle user input
function handleUserInput() {
    const message = userInput.value.trim();
    
    if (message) {
        // Add user message to chat
        addMessage(message, true);
        
        // Clear input
        userInput.value = '';
        
        // Send message to Gemini API
        sendMessageToGemini(message);
    }
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Focus input on load
userInput.focus();