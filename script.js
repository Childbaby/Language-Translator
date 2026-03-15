// script.js - WITH DEBOUNCE AND DARK MODE

//GET ALL ELEMENTS
const sourceSelect = document.getElementById('source-lang');
const targetSelect = document.getElementById('target-lang');
const swapBtn = document.getElementById('swap-btn');
const userInput = document.getElementById('user-input');
const charCount = document.getElementById('char-count');
const translateBtn = document.getElementById('translate-btn');
const outputDiv = document.getElementById('output');
const speakOriginal = document.getElementById('speak-original');
const copyOriginal = document.getElementById('copy-original');
const speakTranslated = document.getElementById('speak-translated');
const copyTranslated = document.getElementById('copy-translated');
const darkModeBtn = document.getElementById('dark-mode-btn');

//VARIABLES
let translatedText = '';
let debounceTimer;

//Functions
// Update character count
function updateCharCount() {
    charCount.textContent = userInput.value.length;
}

// Translate function
function translateText() {
    let text = userInput.value;
    
    if(text === '') {
        alert('Please enter text to translate');
        return;
    }
    
    let sourceLang = sourceSelect.value;
    let targetLang = targetSelect.value;
    
    // Check if same language
    if(sourceLang === targetLang) {
        outputDiv.textContent = 'Please select different languages';
        return;
    }
    
    // Build URL
    let encodedText = encodeURIComponent(text);
    let url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`;
    
    outputDiv.textContent = 'Translating...';
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
            
            if(data.responseData && data.responseData.translatedText) {
                translatedText = data.responseData.translatedText;
                outputDiv.textContent = translatedText;
            } else {
                outputDiv.textContent = 'Translation failed';
            }
        })
        .catch(error => {
            console.log('Error:', error);
            outputDiv.textContent = 'Network error';
        });
}

// Debounced translate (for real-time translation)
function debouncedTranslate() {
    // Clear the previous timer
    clearTimeout(debounceTimer);
    
    // Set a new timer
    debounceTimer = setTimeout(() => {
        // Only translate if there's text
        if(userInput.value.trim() !== '') {
            translateText();
        }
    }, 1000); // Wait 1 second after user stops typing
}

// Swap languages
function swapLanguages() {
    let tempSource = sourceSelect.value;
    let tempTarget = targetSelect.value;
    
    sourceSelect.value = tempTarget;
    targetSelect.value = tempSource;
    
    if(userInput.value !== '') {
        translateText();
    }
}

// Copy text
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('Copied to clipboard!'))
        .catch(() => alert('Failed to copy'));
}

// Speak text
function speakText(text, lang) {
    window.speechSynthesis.cancel();
    
    let utterance = new SpeechSynthesisUtterance(text);
    
    if(lang === 'en') {
        utterance.lang = 'en-US';
    } else if(lang === 'fr') {
        utterance.lang = 'fr-FR';
    }
    
    window.speechSynthesis.speak(utterance);
}

//EVENT LISTENERS 

window.addEventListener('load', function() {
    updateCharCount();
    translateText();
});

// Input event - update character count AND trigger debounced translate
userInput.addEventListener('input', function() {
    updateCharCount(); // Update character count immediately
    debouncedTranslate(); // Wait then translate
});

// Translate button click - clear any pending debounce and translate immediately
translateBtn.addEventListener('click', function() {
    clearTimeout(debounceTimer);
    translateText();
});

swapBtn.addEventListener('click', swapLanguages);

copyOriginal.addEventListener('click', function() {
    copyToClipboard(userInput.value);
});

copyTranslated.addEventListener('click', function() {
    if(translatedText) {
        copyToClipboard(translatedText);
    } else {
        alert('No translated text yet');
    }
});

speakOriginal.addEventListener('click', function() {
    if(userInput.value) {
        speakText(userInput.value, sourceSelect.value);
    } else {
        alert('No text to speak');
    }
});

speakTranslated.addEventListener('click', function() {
    if(translatedText) {
        speakText(translatedText, targetSelect.value);
    } else {
        alert('No translated text yet');
    }
});

// Dark Mode Toggle
darkModeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    // Change button text based on mode
    if(document.body.classList.contains('dark-mode')) {
        darkModeBtn.textContent = '☀️ Light Mode';
    } else {
        darkModeBtn.textContent = '🌙 Dark Mode';
    }
});