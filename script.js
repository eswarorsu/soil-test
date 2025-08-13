// script.js

// Function to handle logout
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// Define the recommendations and their associated product links
const recommendationsData = {
    acidic_ph: {
        text: "Your soil pH is too low (acidic). Consider adding agricultural lime to raise the pH.",
        productLink: "https://www.amazon.in/s?k=agricultural+lime+for+garden",
        icon: "fas fa-exclamation-triangle"
    },
    alkaline_ph: {
        text: "Your soil pH is too high (alkaline). Consider adding sulfur or gypsum to lower the pH.",
        productLink: "https://www.amazon.in/s?k=soil+sulfur+and+gypsum",
        icon: "fas fa-exclamation-triangle"
    },
    low_nitrogen: {
        text: "Your soil is low on nitrogen. We recommend a high-nitrogen fertilizer.",
        productLink: "https://www.amazon.in/s?k=high+nitrogen+fertilizer",
        icon: "fas fa-leaf"
    },
    low_phosphorus: {
        text: "Your soil is low on phosphorus. We recommend a high-phosphorus fertilizer.",
        productLink: "https://www.amazon.in/s?k=high+phosphorus+fertilizer",
        icon: "fas fa-seedling"
    },
    low_potassium: {
        text: "Your soil is low on potassium. We recommend a high-potassium fertilizer.",
        productLink: "https://www.amazon.in/s?k=muriate+of+potash",
        icon: "fas fa-gem"
    }
};

const cropData = {
    acidic: ['Potatoes', 'Sweet Potatoes', 'Blueberries', 'Cranberries'],
    neutral: ['Corn', 'Beans', 'Peas', 'Tomatoes', 'Carrots', 'Cucumbers'],
    alkaline: ['Asparagus', 'Beets', 'Spinach', 'Kale', 'Broccoli']
};

document.addEventListener('DOMContentLoaded', () => {
    const soilForm = document.getElementById("soilForm");
    const recommendationOutput = document.getElementById("recommendationOutput");
    const resetButton = document.getElementById("resetButton");

    if (soilForm) {
        soilForm.addEventListener("submit", function(e) {
            e.preventDefault();

            recommendationOutput.innerHTML = '';
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

            const phInput = document.getElementById("ph");
            const ph = parseFloat(phInput.value);
            const nitrogen = parseFloat(document.getElementById("nitrogen").value);
            const phosphorus = parseFloat(document.getElementById("phosphorus").value);
            const potassium = parseFloat(document.getElementById("potassium").value);

            if (isNaN(ph) || ph < 1 || ph > 14) {
                phInput.classList.add('invalid');
                recommendationOutput.innerHTML = '<p class="error-message">Please enter a valid pH value between 1 and 14.</p>';
                return;
            }

            const loadingMessage = document.createElement('p');
            loadingMessage.textContent = 'Analyzing soil data...';
            loadingMessage.classList.add('loading-message');
            recommendationOutput.appendChild(loadingMessage);

            setTimeout(() => {
                recommendationOutput.innerHTML = '';

                let allRecommendations = [];
                let summaryText = 'Optimal Soil Health';
                let summaryIcon = 'fas fa-check-circle';

                if (ph < 6.0) {
                    allRecommendations.push(recommendationsData.acidic_ph);
                    allRecommendations.push({ text: `Crops suitable for acidic soil (pH < 6.0) include: ${cropData.acidic.join(', ')}`, icon: "fas fa-seedling" });
                    summaryText = 'Acidic Soil Detected';
                    summaryIcon = 'fas fa-exclamation-triangle';
                } else if (ph > 7.5) {
                    allRecommendations.push(recommendationsData.alkaline_ph);
                    allRecommendations.push({ text: `Crops suitable for alkaline soil (pH > 7.0) include: ${cropData.alkaline.join(', ')}`, icon: "fas fa-seedling" });
                    summaryText = 'Alkaline Soil Detected';
                    summaryIcon = 'fas fa-exclamation-triangle';
                } else {
                    allRecommendations.push({ text: `Your soil pH is optimal for most crops. Some suitable options include: ${cropData.neutral.join(', ')}`, icon: "fas fa-seedling" });
                }

                if (nitrogen < 50) {
                    allRecommendations.push(recommendationsData.low_nitrogen);
                    summaryIcon = 'fas fa-exclamation-triangle';
                }
                if (phosphorus < 30) {
                    allRecommendations.push(recommendationsData.low_phosphorus);
                    summaryIcon = 'fas fa-exclamation-triangle';
                }
                if (potassium < 100) {
                    allRecommendations.push(recommendationsData.low_potassium);
                    summaryIcon = 'fas fa-exclamation-triangle';
                }

                const summaryCard = document.createElement('div');
                summaryCard.classList.add('summary-card', 'fade-in');
                summaryCard.innerHTML = `
                    <div class="summary-icon"><i class="${summaryIcon}"></i></div>
                    <div class="summary-content">
                        <h3>${summaryText}</h3>
                        <p>${ph >= 6.0 && ph <= 7.5 ? 'Your soil pH is in the ideal range.' : 'Your soil pH requires adjustment.'}</p>
                    </div>
                `;
                recommendationOutput.appendChild(summaryCard);

                if (allRecommendations.length > 0) {
                    const recHeading = document.createElement('h4');
                    recHeading.textContent = 'Recommendations';
                    recHeading.classList.add('recommendations-heading', 'fade-in');
                    recommendationOutput.appendChild(recHeading);
                }

                allRecommendations.forEach((rec, index) => {
                    const recCard = document.createElement('div');
                    recCard.classList.add('recommendation-card');
                    recCard.innerHTML = `
                        <div class="rec-icon"><i class="${rec.icon}"></i></div>
                        <div class="rec-content">
                            <p>${rec.text}</p>
                            ${rec.productLink ? `<a href="${rec.productLink}" target="_blank" class="amazon-link">Buy on Amazon</a>` : ''}
                        </div>
                    `;
                    recommendationOutput.appendChild(recCard);

                    setTimeout(() => {
                        recCard.classList.add('fade-in');
                    }, 50 * (index + 1));
                });
            }, 1000);
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            soilForm.reset();
            recommendationOutput.innerHTML = '';
            document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        });
    }
});