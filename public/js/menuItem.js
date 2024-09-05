document.addEventListener("DOMContentLoaded", () => {
    console.log("menuItem loaded");
    const pathParts = window.location.pathname.split("/");
    const store = decodeURIComponent(pathParts[pathParts.length - 2]);
    const item = decodeURIComponent(pathParts.pop());
    console.log("Attempting to fetch", item, "from", store, "from menuItem.js");
    fetch(`/api/menuItem/${encodeURIComponent(store)}/${encodeURIComponent(item)}`)
    .then(response => response.json())
    .then(data => {
        const mainContainer = document.createElement("div");
        mainContainer.textContent = `${data}`;
    })
    .catch(error => console.error("error fetching menu item:". error))
})