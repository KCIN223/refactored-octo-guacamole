document.addEventListener("DOMContentLoaded", () => {
    const infoFolderPath = "./info/";
    const csvFileNames = ["categories(1).csv", "categories(2).csv", "categories(3).csv"];

    /**
     * Parse a CSV file into an array of objects.
     * @param {string} csvText - Raw CSV content.
     * @returns {Array<Object>} - Array of metadata objects.
     */
    const parseCSV = (csvText) => {
        const lines = csvText.trim().split("\n");
        const headers = lines[0].split(",");
        return lines.slice(1).map((line) => {
            const values = line.split(",");
            return headers.reduce((obj, header, index) => {
                obj[header.trim()] = values[index]?.trim();
                return obj;
            }, {});
        });
    };

    /**
     * Link metadata to images in the grid.
     */
    const linkAllMetadata = async () => {
        for (const fileName of csvFileNames) {
            const filePath = `${infoFolderPath}${fileName}`;
            console.log(`Fetching metadata from: ${filePath}`); // Debugging

            try {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`Failed to load ${filePath}`);
                const csvText = await response.text();
                const metadata = parseCSV(csvText);

                // Loop through metadata and link to images
                metadata.forEach((item) => {
                    const hoverImage = `./treated-images/${item.category}/${item.imageHover}`;
                    const img = document.querySelector(`img[data-hover="${hoverImage}"]`);
                    if (img) {
                        img.dataset.movieName = item.movieName || "Unknown";
                        img.dataset.director = item.director || "Unknown";
                        img.dataset.year = item.year || "Unknown";
                        img.dataset.timestamp = item.timestamp || "N/A";
                        console.log(`Linked metadata to image: ${hoverImage}`); // Debugging
                    } else {
                        console.warn(`Image not found in DOM for hoverImage: ${hoverImage}`);
                    }
                });
            } catch (error) {
                console.error(`Error linking metadata for ${fileName}:`, error);
            }
        }
    };

    // Fetch and link metadata on page load
    linkAllMetadata();
});
