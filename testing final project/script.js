document.addEventListener("DOMContentLoaded", () => {
    const themeToggleSwitch = document.getElementById("theme-toggle");
    const infoBtn = document.getElementById("info-btn");
    const infoContainer = document.getElementById("info-container");

    if (infoBtn && infoContainer) {
        infoBtn.addEventListener("click", () => {
            infoContainer.classList.toggle("visible");
        });
    }

    if (themeToggleSwitch) {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("night-mode");
            themeToggleSwitch.checked = true;
        }

        themeToggleSwitch.addEventListener("change", () => {
            if (themeToggleSwitch.checked) {
                document.body.classList.add("night-mode");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("night-mode");
                localStorage.setItem("theme", "light");
            }
        });
    }
});
