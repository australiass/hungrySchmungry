document.addEventListener("DOMContentLoaded", () => {
    console.log("menuItem loaded");
    const pathParts = window.location.pathname.split("/");
    const store = decodeURIComponent(pathParts[pathParts.length - 2]);
    const item = decodeURIComponent(pathParts.pop());
    console.log("Attempting to fetch", item, "from", store, "from menuItem.js");
    fetch(`/api/menuData/${encodeURIComponent(store)}/${encodeURIComponent(item)}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        document.getElementById("img").setAttribute("src", `/assets/${store} - ${item.toLowerCase()}.png`);

        var container = document.getElementById("infoContainer");
        container.textContent = `${data.Ingredients}`;
    })
    .catch(error => console.error("Error fetching menu item:". error))
})