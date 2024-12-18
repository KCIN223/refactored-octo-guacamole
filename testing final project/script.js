document.addEventListener("DOMContentLoaded", () => {
    const infoButton = document.getElementById("info-btn");
    const infoContainer = document.getElementById("info-container");
    const gridButton = document.getElementById("grid-view");
    const listButton = document.getElementById("list-view");
    const themeToggleSwitch = document.getElementById("theme-toggle");

    const toggleInfoContainer = () => {
        infoContainer.classList.toggle("visible");
        if (infoContainer.classList.contains("visible")) {
            infoContainer.style.maxHeight = "500px";
            infoContainer.style.opacity = "1";
        } else {
            infoContainer.style.maxHeight = "0";
            infoContainer.style.opacity = "0";
        }
    };

    const disableGridButton = () => {
        if (window.location.pathname.endsWith("index.html")) {
            gridButton.disabled = true;
            gridButton.classList.add("inactive");
        } else {
            gridButton.disabled = false;
            gridButton.classList.remove("inactive");
        }
    };

    const applyDarkModeOnLoad = () => {
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("night-mode");
            themeToggleSwitch.checked = true;
            applyDarkMode();
        }
    };

    const applyDarkMode = () => {
        document.querySelectorAll(".grid-image").forEach((img) => {
            img.src = img.dataset.dark || img.dataset.default;
        });
    };

    const applyLightMode = () => {
        document.querySelectorAll(".grid-image").forEach((img) => {
            img.src = img.dataset.default;
        });
    };

    themeToggleSwitch.addEventListener("change", () => {
        if (themeToggleSwitch.checked) {
            document.body.classList.add("night-mode");
            localStorage.setItem("theme", "dark");
            applyDarkMode();
        } else {
            document.body.classList.remove("night-mode");
            localStorage.setItem("theme", "light");
            applyLightMode();
        }
    });

    infoButton.addEventListener("click", toggleInfoContainer);
    disableGridButton();
    applyDarkModeOnLoad();
});
