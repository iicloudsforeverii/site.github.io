let details = navigator.userAgent;

let regexp = /android|iphone|kindle|ipad/i;

let isMobileDevice = regexp.test(details);

function Update() {
    if (window.innerWidth/window.innerHeight < 1.4 || isMobileDevice || window.innerWidth < 1080 || window.innerHeight < 720) {
        if (!document.location.href.includes("mobile.html")) {
            document.location.href = "./mobile.html"
        }
    } else {
        if (document.location.href.includes("mobile.html")) {
            document.location.href = "./index.html"
        }
    }
}
Update();
window.addEventListener("resize", (event) => {
    Update();
});