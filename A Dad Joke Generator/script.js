const jokeButton = document.getElementById('jokeButton');
const jokeDisplay = document.getElementById('jokeDisplay');

// Function to fetch a joke from the API
async function getDadJoke() {
    // The API requires a specific header to return JSON
    const apiUrl = 'https://icanhazdadjoke.com/';
    const headers = { 
        'Accept': 'application/json'
    };

    try {
        // Show a loading state for better user experience
        jokeDisplay.textContent = 'Fetching a fresh groaner...';
        jokeButton.disabled = true;

        const response = await fetch(apiUrl, { headers: headers });
        
        if (!response.ok) {
            throw new Error(`API error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display the joke
        displayJoke(data.joke);
        
    } catch (error) {
        // Handle any errors gracefully
        console.error("Could not fetch joke:", error);
        jokeDisplay.textContent = "Oops! I seem to have misplaced my joke book. Try again?";
    } finally {
        // Re-enable the button whether the request succeeded or failed
        jokeButton.disabled = false;
    }
}

// Function to display the joke (with optional punchline delay)
function displayJoke(jokeText) {
    // Check if the joke has a clear setup/punchline structure (e.g., contains a question mark or colon)
    if (jokeText.includes('?') || jokeText.includes(':') || jokeText.includes('-')) {
        // For jokes with a clear setup, we can add a dramatic pause
        const jokeParts = jokeText.split(/\?|:| - /);
        
        if (jokeParts.length > 1) {
            // Display the setup immediately
            jokeDisplay.innerHTML = `${jokeParts[0]}?<br><span class="punchline">...</span>`;
            
            // Reveal the punchline after a delay
            setTimeout(() => {
                jokeDisplay.innerHTML = `${jokeParts[0]}?<br><span class="punchline">${jokeParts[1]}</span>`;
            }, 1500); // 1.5 second delay for the punchline
            return;
        }
    }
    
    // For one-liners or jokes without a clear split, just display it
    jokeDisplay.textContent = jokeText;
}

// Event listener for the button
jokeButton.addEventListener('click', getDadJoke);

// Optional: Get a joke as soon as the page loads
// getDadJoke();