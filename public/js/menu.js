document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/menudata")
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data);
        console.log('Data Type:', typeof data);
        console.log('Is Array:', Array.isArray(data));
        console.log('Data:', data);
        const menuContainer = document.getElementById("menuContainer")
        menuContainer.innerHTML = "";
        data.forEach(store => {
            var storePanel = document.createElement("div");
            storePanel.className = "storePanel";
            storePanel.id = store.store

            storeTitle = document.createElement("div")
            storeTitle.className = "storeTitle"
            storeTitle.innerHTML = `${store.store}`;
            storePanel.appendChild(storeTitle)

            storeItemPanelContainer = document.createElement("div");
            storeItemPanelContainer.className = "itemPanelContainer";
            
            for (let item in store.menu) {
                var itemPanel = document.createElement("div");
                itemPanel.className = "itemPanel";
                var ingredients = JSON.stringify(store.menu[item].Ingredients);
                var ingredients = ingredients.replace(/[\[\]{}"]/g, '').replace(/,/g, ', ');
                itemPanel.innerHTML = `
                    <h2 class="item">${item}</h2>
                    <p class="ingredients">${ingredients}</p>
                    <p class="price">${typeof store.menu[item].Price == "object" ? 'From $' + Object.values(store.menu[item].Price)[0] : "$" + JSON.stringify(store.menu[item].Price)}</p>
                `
                storeItemPanelContainer.appendChild(itemPanel);
            }
            storePanel.appendChild(storeItemPanelContainer);
            menuContainer.appendChild(storePanel);
        })
    })
})