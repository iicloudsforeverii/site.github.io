const menubar = document.getElementById("menubar");
const menubutton = document.getElementById("menubutton");
const menubuttons = document.getElementById("menubuttons");
const menucontainer = document.getElementById("menucontainer");

const categoryControls = document.getElementById("categoryControls");
const listbutton = document.getElementById("listbutton");
const categorylist = document.getElementById("categorylist");
const displaycontainer = document.getElementById("displaycontainer");
const details = document.getElementById("details");
const categoryControlButtons = categorylist.children
const timelineScroller = document.getElementById("timelineScroller");
const timelineScrollerContainer = document.getElementById("timelineScrollerContainer");

const imageDisplay = document.getElementById("imageDisplay");
const contactSites = document.getElementById("contactSites");

const transitioncontainer = document.getElementById("transitioncontainer");
const displayTransition = document.getElementById("displayTransition");

const reviews = document.getElementById("reviewscontainer")

const homeContainer = document.getElementById("home");
const infoContainer = document.getElementById("info");
const projectContainer = document.getElementById("projects");
const reviewsContainer = document.getElementById("reviews");

const root = document.querySelector(':root');

var buttonConnections = new Map();
buttonConnections.set(menubuttons.children[0], homeContainer);
buttonConnections.set(menubuttons.children[1], projectContainer);
buttonConnections.set(menubuttons.children[2], reviewsContainer);
buttonConnections.set(menubuttons.children[3], infoContainer);

var menuOpen = false;
var categoriesOpen = false;
var categoryDebounce = false;
var menuDebounce = false;
var pagedebounce = false;

var currentCategory = "Games";
var index = 1;
var currentopenimageIndex = 0;

var debounce = false;
var pagedebounce = false;
var itemsInTimeline = [];

const decoy = {
    "Description": "A template image. All credits go to Umar Farooq on unsplash.com.",
    "Timestamp": "May, 2026.",
    "Images": {
        "1": {"type": "img", "src": "Assets/background.webp", "alt": "Snowy hills of Pakistan."},
    },
    "Order": 1
}

import informationTable from './data.js';
import timezones from './timezone.js';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getDataTable() {
    if (informationTable[currentCategory] && informationTable[currentCategory][index]) {
        return informationTable[currentCategory][index];
    } else {
        return decoy;
    }
}

function getCurrentImage() {
    return getDataTable().Images[currentopenimageIndex] || decoy.Images[1];
}

function UpdateDisplay() { // Zoomed Display Update
    const dataTable = getDataTable();
    const image = getCurrentImage();

    imageDisplay.style.display = "flex"
    imageDisplay.style.opacity = "0"
    imageDisplay.style.transform = "translateY(20px)"
    setTimeout(() => {
            imageDisplay.style.opacity = "1"
            imageDisplay.style.transform = "translateY(0%)"
        if (image.type == "img") {
            imageDisplay.querySelector(".img").src = image.src;
            imageDisplay.querySelector(".img").style.display = "block";
            imageDisplay.querySelector(".iframe").style.display = "none";
        } else if (image.type == "video") {
            imageDisplay.querySelector(".iframe").src = "https://www.youtube.com/embed/"+image.src;
            imageDisplay.querySelector(".iframe").style.display = "block";
            imageDisplay.querySelector(".img").style.display = "none";
        }
    }, 10);
}

function UpdateTimelineScroller() {
    itemsInTimeline.forEach((value,idx) => {
        const diff = Math.abs((idx+1 - index));
        if (diff > 0) {
            timelineScroller.querySelector(".itemcontainer").children[idx].style.transform = "scale(0.9)"
            timelineScroller.querySelector(".itemcontainer").children[idx].style.filter = "blur(3px)"
        };
    })
    timelineScroller.querySelector(".itemcontainer").children[index-1].style.transform = "scale(1.1)"
        timelineScroller.querySelector(".itemcontainer").children[index-1].style.filter = "blur(0px)"
}

async function RefreshTimelineScroller() {
    const dataTable = informationTable[currentCategory];
    const height = window.innerHeight * 0.75*0.2*0.8
    for (const img of timelineScroller.querySelector(".itemcontainer").children) {
        img.style.bottom = "-200px";
        setTimeout(() => {
            img.remove();
        }, 300);
    }

    itemsInTimeline = [];

    var left = height/9;

    for (const [idx, project] of Object.entries(dataTable)) {
        const image = project.Images[1];
        const img = document.createElement("img");
        timelineScrollerContainer.querySelector(".itemcontainer").appendChild(img);
        img.style.left = "-300px";
        img.style.filter = "blur(6px)"
        await sleep(20);
        img.style.left = left+"px";
        if ((idx-1)%2 == 0) {
            img.style.bottom = "auto";
            img.style.top = "0";
        } else {
            // img.style.left = ((idx-1-Math.floor(idx/2)) * height*20/9 + height/9) + "px";
            left += height*16/9 + root.getAttribute("--padding")
        }
        itemsInTimeline.push(img)
        img.onclick = function() {
            index = idx;
            Update();
        };
        if (image.type == "video") {
            img.src = "https://img.youtube.com/vi/"+image.src+"/hqdefault.jpg";
        } else {
            img.src = image.src;
        }
        img.alt = image.alt;
    }
}

async function Update() { // Projects Update
    if (debounce) {return};
    debounce = true;
    var dataTable = getDataTable();

    for (const button of categoryControlButtons) {
        if (currentCategory == button.id) {
            button.className = "active"
        } else {
            button.className = ""
        }
    }

    details.querySelector(".timestamp").style.opacity = "0";
    details.querySelector(".description").style.opacity = "0";``

    displayTransition.querySelector(".title").textContent = currentCategory;
    displayTransition.style.transform = "rotate3d(1, 1, 0, 90deg) scale(0.5)";
    displayTransition.style.opacity = "1";
    displayTransition.style.display = "flex";
    await sleep(10);
    displayTransition.style.transform = "rotate3d(1, 1, 0, 0deg) scale(1)";

    await sleep(500);
    displayTransition.style.transform = "rotate3d(-1, 1, 0, -90deg) scale(0.5)";
    displayTransition.style.opacity = "0"; 
    details.querySelector(".description").style.opacity = "1";
    details.querySelector(".timestamp").style.opacity = "1";

    displaycontainer.replaceChildren();
    details.querySelector(".description").textContent = dataTable.Description;
    details.querySelector(".timestamp").textContent = dataTable.Timestamp;

    for (const [index, image] of Object.entries(dataTable.Images)) {
        const containerDiv = document.createElement("div");
        const imageContainer = document.createElement("img");
        containerDiv.className = image.type;
        imageContainer.src = image.src;
        if (image.type == "img") {
            imageContainer.onclick = function() {
                currentopenimageIndex = index;
                UpdateDisplay()
            }
        } else if (image.type == "link") {
            imageContainer.onclick = function() {
                window.open(image.href,"_blank");
            }
        } else if (image.type == "video") {
            const videoIndicator = document.createElement("img")
            videoIndicator.src = "Assets/videoIndicator.webp"
            videoIndicator.className = "indicator"
            if (imageContainer.src != "https://img.youtube.com/vi/"+image.src+"/hqdefault.jpg") {
                imageContainer.src = "https://img.youtube.com/vi/"+image.src+"/hqdefault.jpg";
            }
            containerDiv.appendChild(videoIndicator);
            imageContainer.onclick = function() {
                currentopenimageIndex = index;
                UpdateDisplay()
            }
        }
        imageContainer.alt = image.alt;
        containerDiv.appendChild(imageContainer);
        displaycontainer.appendChild(containerDiv);
    }
    setTimeout(async () => {
        displayTransition.style.display = "none";
        debounce = false;
    }, 500);
    UpdateTimelineScroller();
}

// || Key Assignments

contactSites.querySelector(".email").onclick = function() {
    window.open("https://mail.google.com/mail/u/0/?fs=1&to=umarslp3z9y@gmail.com&su=Let%27s%20work&body=Hi%21%20Let%27s%20work%20together%20and%20make%20something%20truly%20amazing%21&tf=cm")
}
contactSites.querySelector(".discord").onclick = function() {
    window.open("https://discordapp.com/users/1504411606761603112")
}
contactSites.querySelector(".roblox").onclick = function() {
    window.open("https://www.roblox.com/users/1745107903/profile")
}
contactSites.querySelector(".forum").onclick = function() {
    window.open("https://devforum.roblox.com/u/jackmraow/summary")
}

imageDisplay.querySelector(".close").onclick = function() {
    imageDisplay.style.opacity = "0"
    imageDisplay.style.transform = "translateY(-20px)"
    setTimeout(() => {
        imageDisplay.style.display = "none"
    }, 300);
}
imageDisplay.querySelector(".next").onclick = function() {
    if (debounce) {return};
    currentopenimageIndex = currentopenimageIndex % Math.max(Object.keys(getDataTable().Images).length,1) + 1;
    UpdateDisplay();
}
imageDisplay.querySelector(".back").onclick = function() {
    if (debounce) {return};
    if (currentopenimageIndex <= 1) {
        currentopenimageIndex = Math.max(Object.keys(getDataTable().Images).length,1)
    } else {
        currentopenimageIndex --;
    };
    UpdateDisplay();
}

for (const button of categoryControlButtons) {
    button.onclick = function() {
        if (debounce || currentCategory == button.id) {return};
        currentCategory = button.id;
        index = 1;
        RefreshTimelineScroller();
        Update();
    }
}

listbutton.onclick = function() {
    if (categoryDebounce) {return};
    categoryDebounce = true;
    if (categoriesOpen) {
        categorylist.style = "transform: translateX(-100%);";
        categoryControls.style = "backdrop-filter: blur(0px); display: block;"
        setTimeout(() => {
            categoryControls.style = "display: none;"
            categoryDebounce = false;
        }, 500);
        categoriesOpen = false;
        listbutton.className = "listbutton"
    } else {
        categorylist.style.transform = "translateX(-100%)"
        categoryControls.style.display = "block";
        setTimeout(async () => {
            categoryControls.style = "backdrop-filter: blur(8px); display: block;"
            categorylist.style = "transform: translateX(0%);";
            await sleep(500);
                categoryDebounce = false;
        }, 20);
        categoriesOpen = true;
        listbutton.className = "listbutton active"
    }
}

menubutton.onclick = function() {
    if (menuDebounce) {return};
    menuDebounce = true;
    if (menuOpen) {
        menucontainer.style = "transform: translateX(100%);";
        menubar.style = "backdrop-filter: blur(0px); display: block;"
        setTimeout(() => {
            menubar.style = "display: none;"
            menuDebounce = false;
        }, 500);
        menuOpen = false;
        menubutton.className = "menuButton"
    } else {
        menucontainer.style = "transform: translateX(100%);";
        menubar.style.display = "block";
        setTimeout(async () => {
            menubar.style = "backdrop-filter: blur(8px); display: block;"
            menucontainer.style = "transform: translateX(0%);";
            await sleep(500);
            menuDebounce = false;
        }, 20);
        menuOpen = true;
        menubutton.className = "menuButton active"
    }
};

// || Review Adder

for (const [index, reviewData] of Object.entries(informationTable.ReviewData)) {
    const sec = document.createElement("div");
    const user = document.createElement("h3");
    const game = document.createElement("h4");
    const review = document.createElement("h5");
    user.className = "user";
    game.className = "game";
    review.className = "review";
    user.textContent = reviewData.User
    game.textContent = reviewData.Game
    review.textContent = reviewData.Review
    sec.className = "sec"+index;
    sec.appendChild(user);
    sec.appendChild(game);
    sec.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" viewBox="0 0 24 24" class="quote"><path fill="currentColor" d="M11.192 15.757q0-1.32-.69-2.217q-.489-.618-1.327-.812c-.55-.128-1.07-.137-1.54-.028c-.16-.95.1-1.956.76-3.022q.992-1.598 2.558-2.403L9.372 5c-.8.396-1.56.898-2.26 1.505c-.71.607-1.34 1.305-1.9 2.094s-.98 1.68-1.25 2.69s-.345 2.04-.216 3.1c.168 1.4.62 2.52 1.356 3.35Q6.205 19 7.85 19c.965 0 1.766-.29 2.4-.878q.941-.864.94-2.368zm9.124 0q0-1.32-.69-2.217q-.49-.63-1.327-.817q-.84-.185-1.54-.022c-.16-.94.09-1.95.752-3.02q.99-1.59 2.556-2.4L18.49 5q-1.201.594-2.26 1.505a11.3 11.3 0 0 0-1.894 2.094c-.556.79-.97 1.68-1.24 2.69a8 8 0 0 0-.217 3.1c.166 1.4.616 2.52 1.35 3.35q1.1 1.252 2.743 1.252q1.45.002 2.402-.877q.941-.864.942-2.368z"></path></svg>`
    sec.appendChild(review);
    reviews.appendChild(sec);
}

// || Transition

async function ChangePage(frame,button,immediate) {
    if (pagedebounce) {return};
    pagedebounce = true;
    for (const [button2, frame2] of buttonConnections) {
        if (frame == frame2) {
            button2.className = "active"
        } else {
            button2.className = ""
        }
    };
    if (!immediate) {
        for (const section of transitioncontainer.children) {
            section.style.transform = "rotate3d(1, 1, 0, 90deg) scale(0.8)";
            section.style.opacity = "1";
        }
        transitioncontainer.style.display = "grid"
        await sleep(10);
        for (const section of transitioncontainer.children) {
            section.style.transform = "rotate3d(1, 1, 0, 0deg) scale(1.1)";
            setTimeout(() => {
                section.style.transform = "rotate3d(-1, 1, 0, -90deg) scale(0.5)";
                section.style.opacity = "0";
            }, 700);
            await sleep(100);
        }
        await sleep(400);
    } else {
        for (const section of transitioncontainer.children) {
            section.style.transform = "rotate3d(1, 1, 0, 0deg) scale(1.1)";
            section.style.opacity = "1";
        }
        transitioncontainer.style.display = "grid"
        setTimeout(async () => {
            for (const section of transitioncontainer.children) {
                section.style.transform = "rotate3d(-1, 1, 0, -90deg) scale(0.5)";
                section.style.opacity = "0";
                await sleep(100);
            }
        }, 50)
    }
    for (const [button2, frame2] of buttonConnections) {
        if (frame == frame2) {
            frame2.style.display = "grid";
        } else {
            frame2.style.display = "none";
        }
    };
    await sleep(500);
    transitioncontainer.style.display = "none"
    pagedebounce = false;
}

ChangePage(homeContainer,menubuttons.children[0],true)

// || Button Connections

for (const [button, frame] of buttonConnections) {
    button.onclick = function(){
        if (pagedebounce) {return};
        ChangePage(frame,button);
        if (frame == projectContainer) {
            RefreshTimelineScroller();
            Update();
        }
    };
}