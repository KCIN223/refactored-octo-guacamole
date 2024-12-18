document.addEventListener("DOMContentLoaded", () => {
    const gridItems = document.querySelectorAll(".grid-item");
    const detailView = document.querySelector(".detail-view");
    const exitBtn = document.querySelector(".exit");
  
    // Check if elements exist
    if (exitBtn) {
      exitBtn.addEventListener("click", () => {
        detailView.classList.add("hidden");
      });
    }
  
    gridItems.forEach((item) => {
      item.addEventListener("click", () => {
        detailView.classList.remove("hidden");
      });
    });
  });
  