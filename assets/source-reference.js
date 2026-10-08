(function () {
    "use strict";
    function locateProductSource() {
        if (!location.hash.startsWith("#source-remaining-")) return;
        var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) window.scrollBy({ top: target.getBoundingClientRect().top - 88, behavior: "instant" });
    }
    function ready() { document.fonts.ready.then(locateProductSource); }
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    window.addEventListener("hashchange", ready);
}());
