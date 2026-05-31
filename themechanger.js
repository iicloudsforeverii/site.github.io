const colors = [
    ["#11151c","#212d40","#364156","#7d4e57","#f6fff8"],
    ["#fffcf2","#ccc5b9","#403d39","#eb5e28","#252422"],
    ["#e2e4e0","#cfc6c6","#1d1e2c","#030301","#342d4a"],
    ["#22223b","#4a4e69","#9a8c98","#c9ada7","#f2e9e4"],
    ["#111723","#070e16","#415a77","#778da9","#e0e1dd"],
];

const button = document.getElementById("logo");
const btnImg = button.querySelector("img")
const root = document.querySelector(':root');

var currentColor = document.cookie || 0;

btnImg.animate(
    [
        {filter: "drop-shadow(0px 0px 3px var(--font-color)"},
        {filter: "drop-shadow(0px 0px 9px var(--font-color)"},
        {filter: "drop-shadow(0px 0px 3px var(--font-color)"},
    ],
    {
        duration: 2000,
        iterations: Infinity,
        easing: "ease-in-out"
    }
)

function Update() {
    root.style.setProperty('--background-color', colors[currentColor][0]);
    root.style.setProperty('--alt-background-color', colors[currentColor][1]);
    root.style.setProperty('--detail-color', colors[currentColor][2]);
    root.style.setProperty('--inactive-color', colors[currentColor][3]);
    root.style.setProperty('--font-color', colors[currentColor][4]);
}

Update();

document.cookie = currentColor;

button.onclick = function() {
    currentColor ++;
    if (currentColor >= colors.length) {
        currentColor = 0;
    }
    document.cookie = currentColor;
    Update();
}