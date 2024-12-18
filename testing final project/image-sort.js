document.addEventListener("DOMContentLoaded", () => {
    const catalog = document.getElementById("catalog");
    const themeToggleSwitch = document.getElementById("theme-toggle");

    const treatedImagesPath = "./treated-images/";
    const folders = ["i-will-always-love-you", "nothing-lasts-forever", "what-doesn't-kill-you-makes-you-stronger", "it-is-time-to-move-on", "have-a-good-day", "everything-happens-for-a-reason"];
    const totalImagesPerFolder = {}; // Define total images dynamically per folder
    const extensions = ["jpg", "png"];

    // Total images configuration for each folder
    totalImagesPerFolder["i-will-always-love-you"] = 17;
    totalImagesPerFolder["nothing-lasts-forever"] = 11;
    totalImagesPerFolder["what-doesn't-kill-you-makes-you-stronger"] = 10;
    totalImagesPerFolder["it-is-time-to-move-on"] = 16;
    totalImagesPerFolder["have-a-good-day"] = 14;
    totalImagesPerFolder["everything-happens-for-a-reason"] = 6;
    /**
     * Helper function to check if an image file exists.
     * @param {string} url - URL of the image.
     * @returns {Promise<boolean>} - Resolves to true if image exists, false otherwise.
     */
    const imageExists = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    /**
     * Helper function to find a valid image path given a base path and possible extensions.
     * @param {string} basePath - Base path of the image without extension.
     * @returns {Promise<string|null>} - Resolves to the valid image path or null.
     */
    const findValidImage = async (basePath) => {
        for (const ext of extensions) {
            const url = `${basePath}.${ext}`;
            if (await imageExists(url)) return url;
        }
        return null;
    };

    /**
     * Add corner boxes to a grid item for aesthetics.
     * @param {HTMLElement} gridItem - The grid item element.
     */
    const addCornerBoxes = (gridItem) => {
        const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];
        corners.forEach((corner) => {
            const cornerElem = document.createElement("div");
            cornerElem.classList.add("corner", corner);
            gridItem.appendChild(cornerElem);
        });
    };

    /**
     * Create grid items for a specific folder.
     * @param {string} folder - Folder name containing images.
     */
    const createGridItemsForFolder = async (folder) => {
        const folderPath = `${treatedImagesPath}${folder}/`;

        for (let i = 1; i <= totalImagesPerFolder[folder]; i++) {
            // Find valid image paths
            const imgPaths = {
                default: await findValidImage(`${folderPath}image-default(${i})`),
                hover: await findValidImage(`${folderPath}image-hover(${i})`),
                dark: await findValidImage(`${folderPath}image-dark(${i})`),
            };

            if (!imgPaths.default) continue; // Skip if no default image exists

            // Create grid item
            const gridItem = document.createElement("div");
            gridItem.className = "grid-item";
            gridItem.style.position = "relative"; // Ensure grid item positioning

            // Create image element
            const img = document.createElement("img");
            img.src = imgPaths.default;
            img.alt = `Image ${i}`;
            img.classList.add("grid-image");

            // Store paths and cache flags
            img.dataset.default = imgPaths.default;
            img.dataset.hover = imgPaths.hover || imgPaths.default; // Fallback
            img.dataset.dark = imgPaths.dark || imgPaths.default;   // Fallback
            img.dataset.hoverChecked = "false";
            img.dataset.darkChecked = "false";

            // Append image and corners
            gridItem.appendChild(img);
            addCornerBoxes(gridItem);

            // Add click layer
            const clickLayer = document.createElement("div");
            clickLayer.classList.add("click-layer");
            clickLayer.style.position = "absolute";
            clickLayer.style.top = "0";
            clickLayer.style.left = "0";
            clickLayer.style.width = "100%";
            clickLayer.style.height = "100%";
            clickLayer.style.pointerEvents = "auto"; // Allow click handling
            gridItem.appendChild(clickLayer);

            // Attach click event to click layer
            clickLayer.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent interference with other event listeners
                console.log(`Click-layer clicked for image ${i}`);
                showModal(i); // Integrate enlarge.js showModal function
            });

            // Hover logic
            gridItem.addEventListener("mouseenter", async () => {
                if (img.dataset.hoverChecked === "false") {
                    const hoverExists = await imageExists(img.dataset.hover);
                    img.dataset.hoverChecked = "true";
                    if (!hoverExists) img.dataset.hover = img.dataset.default;
                }
                img.src = img.dataset.hover;
            });

            gridItem.addEventListener("mouseleave", async () => {
                if (document.body.classList.contains("night-mode")) {
                    if (img.dataset.darkChecked === "false") {
                        const darkExists = await imageExists(img.dataset.dark);
                        img.dataset.darkChecked = "true";
                        if (!darkExists) img.dataset.dark = img.dataset.default;
                    }
                    img.src = img.dataset.dark;
                } else {
                    img.src = img.dataset.default;
                }
            });

            // Append grid item to catalog
            catalog.appendChild(gridItem);
        }
    };

    /**
     * Initialize grid with all images from all folders.
     */
    const initializeGrid = async () => {
        for (const folder of folders) {
            await createGridItemsForFolder(folder);
        }
    };

    /**
     * Handle theme toggle (night mode).
     */
    const initializeThemeToggle = () => {
        if (!themeToggleSwitch) return;

        const applyNightMode = () => {
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
                applyNightMode();
            } else {
                document.body.classList.remove("night-mode");
                applyLightMode();
            }
        });

        if (localStorage.getItem("theme") === "dark") {
            themeToggleSwitch.checked = true;
            document.body.classList.add("night-mode");
            applyNightMode();
        } else {
            applyLightMode();
        }
    };

    // Initialize the grid and theme toggle on page load
    initializeGrid();
    initializeThemeToggle();

    /**
     * Enlarge.js compatibility: Attach modal logic for enlarged images.
     */
    const showModal = (index) => {
        const imgPath = `/testing%20final%20project/enlarge-images/image-enlarge(${index}).jpg`;
        const modal = document.getElementById("enlarged-image-modal");
        const enlargedImage = document.getElementById("enlarged-image");

        if (modal && enlargedImage) {
            enlargedImage.src = imgPath;
            modal.style.display = "flex";
        }
    };

    const closeModal = () => {
        const modal = document.getElementById("enlarged-image-modal");
        if (modal) modal.style.display = "none";
    };

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
});
