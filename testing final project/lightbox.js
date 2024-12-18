document.addEventListener("DOMContentLoaded", () => {
    const enlargeImagesPath = "./enlarge-images/";
    const totalImages = 50; // Update to reflect the total number of images
    const extensions = ["jpg", "png"];

    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.classList.add("lightbox-hidden");
    document.body.appendChild(lightbox);

    let currentImageIndex = 0;

    // Create lightbox content
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span id="lightbox-close">&times;</span>
            <img id="lightbox-image" src="" alt="Enlarged Image">
            <div id="lightbox-nav-prev" class="lightbox-nav lightbox-nav-prev">&lt;</div>
            <div id="lightbox-nav-next" class="lightbox-nav lightbox-nav-next">&gt;</div>
        </div>
    `;

    const lightboxImage = document.getElementById("lightbox-image");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-nav-prev");
    const nextBtn = document.getElementById("lightbox-nav-next");

    /**
     * Helper function to determine a valid image path.
     * @param {number} index - The image index to check.
     * @returns {Promise<string|null>}
     */
    const findValidImagePath = async (index) => {
        for (const ext of extensions) {
            const url = `${enlargeImagesPath}image-enlarge(${index}).${ext}`;
            const exists = await imageExists(url);
            if (exists) return url;
        }
        return null;
    };

    /**
     * Check if an image exists.
     * @param {string} url - URL to check.
     * @returns {Promise<boolean>}
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
     * Display an image in the lightbox.
     * @param {number} index - The image number to display.
     */
    const displayImageInLightbox = async (index) => {
        if (index < 1 || index > totalImages) return;

        const validImagePath = await findValidImagePath(index);

        if (validImagePath) {
            lightboxImage.src = validImagePath;
            currentImageIndex = index;
            lightbox.classList.remove("lightbox-hidden");
        } else {
            console.warn(`Image not found for index ${index}`);
        }
    };

    /**
     * Close the lightbox.
     */
    const closeLightbox = () => {
        lightbox.classList.add("lightbox-hidden");
        lightboxImage.src = "";
    };

    /**
     * Navigate to the next image.
     */
    const showNextImage = () => {
        const nextIndex = currentImageIndex + 1 > totalImages ? 1 : currentImageIndex + 1;
        displayImageInLightbox(nextIndex);
    };

    /**
     * Navigate to the previous image.
     */
    const showPreviousImage = () => {
        const prevIndex = currentImageIndex - 1 < 1 ? totalImages : currentImageIndex - 1;
        displayImageInLightbox(prevIndex);
    };

    /**
     * Attach click event to grid items.
     */
    const attachGridItemClickEvents = () => {
        const gridItems = document.querySelectorAll(".grid-item");
        gridItems.forEach((item, index) => {
            const clickLayer = item.querySelector(".click-layer");
            if (clickLayer) {
                clickLayer.addEventListener("click", () => {
                    displayImageInLightbox(index + 1); // Numbering starts at 1
                });
            }
        });
    };

    // Event Listeners
    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", showNextImage);
    prevBtn.addEventListener("click", showPreviousImage);

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("lightbox-hidden")) {
            if (e.key === "ArrowRight") showNextImage();
            if (e.key === "ArrowLeft") showPreviousImage();
            if (e.key === "Escape") closeLightbox();
        }
    });

    // Initialize
    attachGridItemClickEvents();
});
