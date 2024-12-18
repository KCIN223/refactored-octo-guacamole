document.addEventListener("DOMContentLoaded", async () => {
    const enlargeImagesPath = "/testing%20final%20project/enlarge-images/";
    const extensions = ["jpg", "png"];
    const movieInfo = {}; // Change to an object to map index to data

    // Fetch and map movie information from the CSV file
    const fetchMovieInfo = async () => {
        try {
            const response = await fetch("info/movie-info.csv");
            if (!response.ok) throw new Error("CSV file not found");

            const text = await response.text();
            const rows = text.trim().split("\n").slice(1); // Skip the header row

            rows.forEach((row, index) => {
                const columns = row.split(",");
                if (columns.length >= 5) {
                    movieInfo[index + 1] = {
                        category: columns[0]?.trim() || "NA",
                        movieName: columns[1]?.trim() || "NA",
                        director: columns[2]?.trim() || "NA",
                        year: columns[3]?.trim() || "NA",
                        timestamp: columns[4]?.trim() || "NA",
                    };
                }
            });
        } catch (error) {
            console.error("Error fetching movie information:", error);
        }
    };

    await fetchMovieInfo(); // Load the movie data before proceeding

    // Create modal for enlarged images
    const modal = document.createElement("div");
    modal.id = "enlarged-image-modal";
    modal.className = "enlarged-image-modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span id="modal-close" class="modal-close">&times;</span>
            <img id="enlarged-image" src="" alt="Enlarged View">
            <div id="movie-info" class="movie-info"></div>
            <div class="modal-controls">
                <button id="prev-image">&#8249;</button>
                <button id="next-image">&#8250;</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const enlargedImage = document.getElementById("enlarged-image");
    const movieInfoBox = document.getElementById("movie-info");
    const closeModal = document.getElementById("modal-close");
    const prevButton = document.getElementById("prev-image");
    const nextButton = document.getElementById("next-image");

    let currentImageIndex = null;

    // Helper function to find a valid image path
    const findValidImage = async (index) => {
        for (const ext of extensions) {
            const url = `${enlargeImagesPath}image-enlarge(${index}).${ext}`;
            const exists = await fetch(url, { method: "HEAD" }).then(res => res.ok);
            if (exists) return url;
        }
        return null;
    };

    // Show modal with image and movie info
    const showModal = async (index) => {
        const imgPath = await findValidImage(index);

        if (imgPath) {
            currentImageIndex = index;
            enlargedImage.src = imgPath;

            const info = movieInfo[index] || {
                category: "NA",
                movieName: "NA",
                director: "NA",
                year: "NA",
                timestamp: "NA",
            };

            // Dynamically update modal content
            movieInfoBox.innerHTML = `
                <p><strong>Category:</strong> ${info.category}</p>
                <p><strong>Title:</strong> ${info.movieName}</p>
                <p><strong>Director:</strong> ${info.director}</p>
                <p><strong>Year:</strong> ${info.year}</p>
                <p><strong>Timestamp:</strong> ${info.timestamp}</p>
            `;
            modal.style.display = "flex";
        } else {
            console.error(`Image at index ${index} not found.`);
        }
    };

    // Close the modal
    const closeModalFunction = () => {
        modal.style.display = "none";
        currentImageIndex = null; // Reset index when modal is closed
    };

    // Navigate to the previous image
    const showPrevImage = () => {
        if (currentImageIndex !== null) {
            const totalImages = 74; // Update based on your total images
            const prevIndex = currentImageIndex === 1 ? totalImages : currentImageIndex - 1;
            showModal(prevIndex);
        }
    };

    // Navigate to the next image
    const showNextImage = () => {
        if (currentImageIndex !== null) {
            const totalImages = 74; // Update based on your total images
            const nextIndex = currentImageIndex === totalImages ? 1 : currentImageIndex + 1;
            showModal(nextIndex);
        }
    };

    // Event listeners for navigation and closing
    closeModal.addEventListener("click", closeModalFunction);
    prevButton.addEventListener("click", showPrevImage);
    nextButton.addEventListener("click", showNextImage);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModalFunction();
        if (e.key === "ArrowLeft") showPrevImage();
        if (e.key === "ArrowRight") showNextImage();
    });

    // Initial binding for dynamically created click-layers
    const observeClickLayers = new MutationObserver(() => {
        const clickLayers = document.querySelectorAll(".click-layer");
        clickLayers.forEach((clickLayer, index) => {
            if (!clickLayer.dataset.bound) {
                clickLayer.dataset.bound = "true";
                clickLayer.addEventListener("click", () => {
                    showModal(index + 1);
                });
            }
        });
    });
// Bind event listeners for category items in list.html
const categoryItems = document.querySelectorAll(".category-item");
categoryItems.forEach(item => {
    item.addEventListener("click", () => {
        const startIndex = parseInt(item.getAttribute("data-index"), 10); // Fetch starting index
        if (startIndex) {
            showModal(startIndex); // Open modal at specified index
        } else {
            console.error("Invalid category index");
        }
    });
});

    observeClickLayers.observe(document.body, { childList: true, subtree: true });

    const initialClickLayers = document.querySelectorAll(".click-layer");
    initialClickLayers.forEach((clickLayer, index) => {
        clickLayer.addEventListener("click", () => {
            showModal(index + 1);
        });
    });
});
