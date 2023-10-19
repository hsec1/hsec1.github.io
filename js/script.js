let targetDate = new Date("2024-05-13T00:00:00");
const maxBounceSpeed = 2000;
let maxBouncingDays;
const currentDate = new Date();
let bounceSpeed = 100;
let overLoad = false;
let pauseTracker;
let bouncingDates = [];
let bouncingDatesContainer;
let countdownInterval;
let countUnits=0;
const timeUnits = {dayUnits: "days",weekUnits:"weeks",monthUnits:"months"}
const urlParams = {month:"month",pickDate:"pickDate",maxBounce: "maxBounce"}
let bouncingUnits = timeUnits.dayUnits;
let pickDateVal = getUrlParameter(urlParams.pickDate)
let datePickerIsShowing = false ? pickDateVal : true;
const speedIncrements = {slow: 25,increase:25}

function setTimeUnitBtnCounters() {
    const daySpan = document.getElementById("daysCounter");
    const weekSpan = document.getElementById("weeksCounter");
    const monthSpan = document.getElementById("monthsCounter");
    daySpan.textContent = countUnits;
    weekSpan.textContent = countUnits;
    monthSpan.textContent = countUnits;

    if(bouncingUnits == timeUnits.dayUnits){
        showElement(daySpan.id);
        hideElement(weekSpan.id);
        hideElement(monthSpan.id);

    }
    else if(bouncingUnits == timeUnits.weekUnits){
        showElement(weekSpan.id);
        hideElement(daySpan.id);
        hideElement(monthSpan.id);

    }
    else if(bouncingUnits == timeUnits.monthUnits){
        showElement(monthSpan.id);
        hideElement(daySpan.id);
        hideElement(weekSpan.id);
    }
}


function setCountDown() {
    // Clear any existing intervals to avoid duplicates
    clearInterval(countdownInterval);
    // Update the countdown every second (1000 milliseconds)
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const timeDifference = targetDate - new Date();
    if (timeDifference <= 0) {
        // Stop the countdown when the target time is reached
        document.querySelector(".countdown").textContent = "00:00:00:00";
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Update the countdown display
    document.getElementById("days").textContent = days.toString().padStart(2, "0");
    document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");
}

function createBouncingDates() {
    const timeDifference = targetDate - currentDate;
    if (timeDifference <= 0) {
        return;
    }

    const fragment = document.createDocumentFragment();

    function createNextBouncingDate() {
         if (bouncingDates.length >= maxBouncingDays) {
            return;
        }
        let formattedDate; // Declare formattedDate here

        if (bouncingUnits === timeUnits.dayUnits) {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            countUnits = days
            if (bouncingDates.length >= days) {
                return;
            }
            
            const day = new Date(currentDate);
            day.setDate(currentDate.getDate() + bouncingDates.length + 1);
            formattedDate = `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear().toString().slice(-2)}`;
        } else if (bouncingUnits === timeUnits.monthUnits) {
            const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
            countUnits=months
            if (bouncingDates.length >= months) {
                return;
            }
            
            const month = new Date(currentDate);
            month.setMonth(currentDate.getMonth() + bouncingDates.length + 1);
            formattedDate = (month.getMonth() + 1).toString();
        } else if (bouncingUnits === timeUnits.weekUnits) {
            const weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
            countUnits = weeks
            if (bouncingDates.length >= weeks) {
                return;
            }
            const weekStartDate = new Date(currentDate);
            weekStartDate.setDate(currentDate.getDate() + bouncingDates.length * 7);
            const weekEndDate = new Date(weekStartDate);
            weekEndDate.setDate(weekStartDate.getDate() + 6);
            formattedDate = `${weekStartDate.getMonth() + 1}/${weekStartDate.getDate()}-${weekEndDate.getMonth() + 1}/${weekEndDate.getDate()}/${weekEndDate.getFullYear()}`;
        }

        const dayElement = document.createElement('span');
        dayElement.className = 'bounce';
        dayElement.textContent = formattedDate;

        let dateObject = {
            element: dayElement,
            x: randomIntFromInterval(0, bouncingDatesContainer.offsetWidth - dayElement.offsetWidth),
            y: randomIntFromInterval(0, bouncingDatesContainer.offsetHeight - dayElement.offsetHeight),
            angle: Math.random() * Math.PI * 2,
        };

        dayElement.style.left = `${dateObject.x}px`;
        dayElement.style.top = `${dateObject.y}px`;
        bouncingDates.push(dateObject);
        fragment.appendChild(dayElement);
        //countUnits +=1
        createNextBouncingDate();
    }
    createNextBouncingDate();
    //console.log(bouncingDates.length)
    bouncingDatesContainer.appendChild(fragment);
    addQtyClass(bouncingDates.length);
}


function addQtyClass(qtty) {
    if (qtty < 10 && bouncingUnits != "weeks") {
        for (const element of document.querySelectorAll(".bounce")) {
            element.classList.add("small-amount");
            element.style.width = "40px";
        }
    } else if (qtty < 70) {
        for (const element of document.querySelectorAll(".bounce")) {
            element.classList.add("med-amount");
            //element.style.width = "200px";
        }
    }
    // large amount is default
}

function startBounceAnimation(dateObject) {
    let lastTimestamp = null;

    function animate(timestamp) {
        if (!lastTimestamp) {
            lastTimestamp = timestamp;
        }

        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        let currentX = dateObject.x;
        let currentY = dateObject.y;

        currentX += Math.cos(dateObject.angle) * bounceSpeed * deltaTime / 1000;
        currentY += Math.sin(dateObject.angle) * bounceSpeed * deltaTime / 1000;

        const containerWidth = bouncingDatesContainer.offsetWidth - dateObject.element.offsetWidth;
        const containerHeight = bouncingDatesContainer.offsetHeight - dateObject.element.offsetHeight -40;

        if (currentX < 1 || currentX > containerWidth) {
            dateObject.angle = Math.PI - dateObject.angle;
        }

        if (currentY < 1 || currentY > containerHeight) {
            dateObject.angle = -dateObject.angle;
        }

        currentX = Math.max(1, Math.min(containerWidth, currentX));
        currentY = Math.max(1, Math.min(containerHeight, currentY));

        dateObject.element.style.left = `${currentX}px`;
        dateObject.element.style.top = `${currentY}px`;
        dateObject.x = currentX;
        dateObject.y = currentY;

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function setDatePickerHandler() {
    const datePickerElements = document.querySelectorAll(".date-picker");

    function handleDatePickerChange() {
        const selectedDate = this.value;
        targetDate = new Date(`${selectedDate}T00:00:00`); // Update the global targetDate
        updateBouncingDates();

    }

    datePickerElements.forEach((element) => {
        element.addEventListener("change", handleDatePickerChange);
    });
}

function setDatePickerMin() {
    let formatNow = formattedNow();
    let min = dateAddition("day", 1, formatNow);
    // Set the minimum date for the date picker
    console.log(document.getElementById("datePicker"))
    document.getElementById("datePicker").setAttribute("min", min);
}

function updateBouncingDates(){
    bouncingDates.forEach((dateObject) => {
        const parentElement = dateObject.element.parentElement;
        if (parentElement) {
            parentElement.removeChild(dateObject.element);
        }
    });
    bouncingDates = [];
    countUnits = 0;
    // Create new bouncing dates using the updated bouncingDatesContainer
    createBouncingDates();
    
    bouncingDates.forEach((dateObject) => {
        startBounceAnimation(dateObject);
    });
    setTimeUnitBtnCounters()
}


function setBtnHandlers() {
    const speedUpBtn = document.getElementById("speedUpBtn");
    const slowDownBtn = document.getElementById("slowDownBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const daysUnitBtn = document.getElementById("dayUnitBtn");
    const weekUnitBtn = document.getElementById("weekUnitBtn");
    const monthUnitBtn = document.getElementById("monthUnitBtn");
    const showDayPickerBtn = document.getElementById("datePickerBtn")

    let speedUpInterval;
    let slowDownInterval;
    let pauseTracker = 0;
    let overLoad = false;
    let actionInProgress = {
        speedUp: false,
        slowDown: false,
        pause: false,
    };
    const holdInterval = 100;

    // Function to handle speeding up
    function handleSpeedUp() {
        if (!actionInProgress.speedUp) {
            actionInProgress.speedUp = true;
            speedUpInterval = setInterval(function () {
                if (bounceSpeed < maxBounceSpeed) {
                    bounceSpeed += speedIncrements.increase;
                }
            }, holdInterval);
        }
    }

    // Function to handle slowing down
    function handleSlowDown() {
        if (!actionInProgress.slowDown) {
            actionInProgress.slowDown = true;
            slowDownInterval = setInterval(function () {
                if (bounceSpeed > 0) {
                    bounceSpeed -= speedIncrements.slow;
                } else {
                    document.querySelector("body").classList.add("spin-joke")
                    bounceSpeed = 0;
                }
            }, holdInterval);
        }
    }

    // Function to handle pausing
    function handlePause() {
        if (!actionInProgress.pause) {
            if (bounceSpeed !== 0) {
                pauseTracker = bounceSpeed;
                bounceSpeed = 0;
            } else {
                bounceSpeed = pauseTracker;
            }
        }
    }

    // Function to handle stopping speeding up and slowing down
    function handleStop() {
        clearInterval(speedUpInterval);
        clearInterval(slowDownInterval);
        actionInProgress.speedUp = false;
        actionInProgress.slowDown = false;
        if (bounceSpeed >= maxBounceSpeed && !overLoad) {
            showJokeOverload();
            setTimeout(function () {
                hideJokeOverload();
            }, 6000);
            bounceSpeed = maxBounceSpeed;
        }
    }

    // Add event listeners for both click and touch events
    speedUpBtn.addEventListener("mousedown", handleSpeedUp);
    speedUpBtn.addEventListener("touchstart", function (event) {
        event.preventDefault();
        handleSpeedUp();
    });
    speedUpBtn.addEventListener("mouseup", handleStop);
    speedUpBtn.addEventListener("touchend", handleStop);

    slowDownBtn.addEventListener("mousedown", handleSlowDown);
    slowDownBtn.addEventListener("touchstart", function (event) {
        event.preventDefault();
        handleSlowDown();
    });
    slowDownBtn.addEventListener("mouseup", handleStop);
    slowDownBtn.addEventListener("touchend", handleStop);

    pauseBtn.addEventListener("click", handlePause);
    pauseBtn.addEventListener("touchstart", function (event) {
        event.preventDefault();
        handlePause();
    });

/* Beginning buttons for unit selection*/ 
    daysUnitBtn.addEventListener("click",function(){
        if(bouncingUnits != timeUnits.dayUnits){
            bouncingUnits = timeUnits.dayUnits
            updateBouncingDates();
            setTimeUnitBtnCounters();

        }
    });
    weekUnitBtn.addEventListener("click",function(){
        if(bouncingUnits != timeUnits.weekUnits){
            bouncingUnits = timeUnits.weekUnits;
            updateBouncingDates();
            setTimeUnitBtnCounters();
        }
    });
    monthUnitBtn.addEventListener("click",function(){
        if(bouncingUnits != timeUnits.monthUnits){
            bouncingUnits = timeUnits.monthUnits;
            updateBouncingDates();
            setTimeUnitBtnCounters();
        }
    });

    showDayPickerBtn.addEventListener("click",handleShowDayPickerClick)
    showDayPickerBtn.addEventListener("touchstart", function (event) {
        event.preventDefault();
        handleShowDayPickerClick();
    });
}

function handleShowDayPickerClick(){
    if (datePickerIsShowing == false ){
        showDatePicker()
        datePickerIsShowing = true
    }
    else if(datePickerIsShowing == true){
        showDatePicker()
        datePickerIsShowing = false
    }

}

function changeBouncingUnit(unitType){
    bouncingUnits = unitType

}

function showJokeOverload() {
    // Check if the body element exists
    const bodyElement = document.body;
    if (!bodyElement) {
        console.error("The body element does not exist.");
        return;
    }

    // Add the 'overload' class to the body
    bodyElement.classList.add("overload");

    // Create and append the style element
    const styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.id = "overloadStyle";
    styleElement.textContent = "body.overload { background: white !important; }";
    document.head.appendChild(styleElement);

    // Select and hide all elements within 'body.overload'
    const bodyOverloadElements = document.querySelectorAll("body.overload > *");
    bodyOverloadElements.forEach((element) => {
        element.style.display = "none";
    });

    // Create and append the fake crash div
    const fakeCrashDiv = getFakeCrashDiv();
    const overloadElement = document.querySelector(".overload")
    if (overloadElement) {
        overloadElement.appendChild(fakeCrashDiv);
    } else {
        console.error("Could not find 'body.overload' for appending the fake crash div.");
    }

    // Set a timeout to add a timed note
    setTimeout(function () {
        if (fakeCrashDiv) {
            fakeCrashDiv.innerHTML += "<div style='font-size: x-large' id='timedNote'>Just Kidding &#128540;</div>";
        } else {
            console.error("Fake crash div is missing.");
        }
    }, 3000);

    overLoad = true;
}

function hideJokeOverload() {
    const bodyOverloadElements = document.querySelectorAll("body.overload > *");
    bodyOverloadElements.forEach((element) => {
        element.style.display = "";
    });

    document.body.classList.remove("overload");

    const overloadStyleElement = document.getElementById("overloadStyle");
    if (overloadStyleElement) {
        overloadStyleElement.remove();
    }

    const crashDiv = document.getElementById("crashDiv");
    if (crashDiv) {
        crashDiv.remove();
    }

    const timedNote = document.getElementById("timedNote");
    if (timedNote) {
        timedNote.remove();
    }
}

function getFakeCrashDiv() {
    const crashDiv = document.createElement("div");
    crashDiv.id = "crashDiv";
    crashDiv.textContent = "{fatal error: 720, webserver has crashed. Contact the admin for further assistance}";
    return crashDiv;
}

function showDatePicker() {
    if (datePickerIsShowing == false || pickDateVal) {
        datePicker.classList.remove("hidden");
        setDatePickerMin();
        setDatePickerHandler();
    } else {
        const datePicker = document.getElementById("datePicker");
        if (datePicker) {
            datePicker.classList.add("hidden");
        }
    }
}

function setMaxBouncing() {
    let newMaxBounce = getUrlParameter(urlParams.maxBounce)
    if(newMaxBounce){
        if (newMaxBounce < 500 || newMaxBounce > 0){
            maxBouncingDays = parseInt(newMaxBounce)
        }
    }
    else{
        maxBouncingDays = 100;
    }
}

function setHandleResizeEvent(){
    window.addEventListener("resize", handleResize);

}

document.addEventListener("DOMContentLoaded", function () {
    setBtnHandlers();
    showDatePicker();
    setMaxBouncing();
    setHandleResizeEvent();
    handleResize();
    bouncingDatesContainer = document.querySelector(".bouncing-dates");
    setCountDown();
    createBouncingDates();
    setTimeUnitBtnCounters();
    // Set theme and start animations
    setTheme();

    bouncingDates.forEach((dateObject) => {
        startBounceAnimation(dateObject);
    });
});
