

function getUrlParameter(sParam) {
    const searchParams = new URLSearchParams(window.location.search);
    
    if (searchParams.has(sParam)) {
        const paramValue = searchParams.get(sParam);
        return paramValue !== null && paramValue !== "" ? decodeURIComponent(paramValue) : true;
    }
    
    return false;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function formattedNow() {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = now.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function dateAddition(unit, amount, inputDate) {
    const now = new Date(`${inputDate}T00:00:00`);

    if (unit === 'month') {
        now.setMonth(now.getMonth() + amount);
    } else if (unit === 'day') {
        now.setDate(now.getDate() + amount);
    } else if (unit === 'year') {
        now.setFullYear(now.getFullYear() + amount);
    }

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = now.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function handleResize() {
    const currentWidth = window.innerWidth;
    console.log(currentWidth)
    // Check the current width and take action based on the condition
    if (currentWidth < 850) {
        document.querySelectorAll(".small-screen")
        
    } 
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);

    if (element) {
        element.classList.add("hidden")
    }
}

function showElement(elementId) {
    const element = document.getElementById(elementId);

    if (element) {
        element.classList.remove("hidden")
    }
}
