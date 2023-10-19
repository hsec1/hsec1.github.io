function themeHolder() {
    // Define an array of themes with their respective months
    const themes = [
        { month: 10, themeMonth: "oct" },
        { month: 11, themeMonth: "nov" },
        { month: 12, themeMonth: "dec" },
        { month: 1, themeMonth: "jan" },
        { month: 2, themeMonth: "feb" },
        { month: 3, themeMonth: "mar" },
        { month: 4, themeMonth: "apr" },
        { month: 5, themeMonth: "may" },
    ];
    return themes;
}

// Called on DOM load to set the theme based on the current month
function setTheme() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const themeOverride = getUrlParameter(urlParams.month); // Check if there is a URL parameter for theme override

    // Get the list of themes
    const themes = themeHolder();
    
    let matchingTheme;
    
    // Override the theme if a 'month' parameter is present in the URL
    if (themeOverride) {
        matchingTheme = themes.find((theme) => theme.themeMonth === themeOverride);
    } else {
        matchingTheme = themes.find((theme) => theme.month === currentMonth);
    }
    
    if (matchingTheme) {
        const themeClass = matchingTheme.themeMonth; // Get the themeMonth class name
        
        document.body.classList.add(themeClass);

        // Apply specific theme-related logic for December and January
        if (matchingTheme.month === 12 || matchingTheme.themeMonth === "dec") {
            setDecExtras();
        }
        if (matchingTheme.month === 3 || matchingTheme.themeMonth === "mar") {
            setMarchExtras();
        }
        if (matchingTheme.month === 4 || matchingTheme.themeMonth === "apr") {
            setAprExtras();
        }
        // You can add more theme-specific logic for other months as needed
    }
}

// Dynamically set the margin for the countdown container based on the button controls width
function setCdownContainerDynaimcally() {
    const btnWidth = document.getElementById("btn_controls").offsetWidth;
    const addedMargin = btnWidth / 2;
    document.querySelector(".countdown-container").style.marginLeft = addedMargin + "px";
}

// Add Christmas-themed extras (e.g., Santa image)
function setDecExtras() {
    const countdownContainer = document.querySelector(".countdown-container");
    const santaImg = document.createElement("img");
    santaImg.src = "./images/santa.png";
    santaImg.id = "santaImg";

    countdownContainer.insertBefore(santaImg, countdownContainer.firstChild);

    const leftPos = countdownContainer.getBoundingClientRect().left;
    const rightPos = leftPos + countdownContainer.offsetWidth;
    const imgElement = document.getElementById("santaImg");
    const imgWidth = imgElement.getBoundingClientRect().width;
    const leftOffset = leftPos - (rightPos - imgWidth);
    const rightOffset = rightPos - imgWidth;

    // Create a dynamic CSS keyframe animation for moving Santa
    const style = document.createElement("style");
    const keyframes = `@keyframes moveSanta {
        0% {
            left: ${rightOffset}px;
        }
        100% {
            left: ${leftOffset}px; // Adjust the percentage based on the width of the bouncing-dates div
        }
    }`;
    style.textContent = keyframes;

    // Append the keyframes to the document's head
    document.head.appendChild(style);
}

function setMarchExtras(){
    let container = document.querySelector(".bouncing-dates");
    const luckyImg = document.createElement("img");
    luckyImg.src = "./images/lucky.png"
    luckyImg.id = "lucky"
    container.insertBefore(luckyImg,container.firstChild)
    const goldImg = document.createElement("img");
    goldImg.id = "gold"
    goldImg.src = "./images/gold.png"
    container.insertBefore(goldImg,container.firstChild)

}

function setAprExtras(){
    let reqImport = document.createElement('script')
    reqImport.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.11/p5.min.js"
    reqImport.async = true
    let parent = document.head
    let refernceElement = parent.children[parent.children.length-4]
    parent.insertBefore(reqImport,refernceElement)
    let rainImport = document.createElement('script')
    rainImport.src = "./js/rain.js"
    parent.insertBefore(rainImport,refernceElement)
    

}
