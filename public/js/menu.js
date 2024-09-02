// Runs this code block when the page loads fully, ensures that all elements are accessible before trying to manipulate them.
document.addEventListener("DOMContentLoaded", () => {
    // Fetch the menudata uploaded to this api url by the backend, in JSON format, although it's only a string currently
    fetch("/api/menudata")
    .then(response => response.json())
    .then(data => {
        // Parse the "string" of JSON as actual JSON data
        data = JSON.parse(data);
        // Create new element which will hold all of the stores
        const menuContainer = document.getElementById("menuContainer")
        menuContainer.innerHTML = "";
        // Loop through every store in the menudata json file.
        data.forEach(store => {
            // Create a new element which will hold the menu items of each store, add class/ID to it for css manipulation
            var storePanel = document.createElement("div");
            storePanel.className = "storePanel";
            storePanel.id = store.store

            // Create a store title element, needed to make this seperately because I wanted it to sit above all of the item panels below it.
            storeTitle = document.createElement("div")
            storeTitle.className = "storeTitle"
            storeTitle.innerHTML = `${store.store}`;
            // Append the title element to the store panel
            storePanel.appendChild(storeTitle)

            // Create a container for the menu items to sit in
            storeItemPanelContainer = document.createElement("div");
            storeItemPanelContainer.className = "itemPanelContainer";
            
            // Loop through each item in the store
            for (let item in store.menu) {
                var itemPanel = document.createElement("div");
                itemPanel.className = "itemPanel";
                // Since JSON is a pain, and partly because of how I formatted it, I had to turn the JSON array containing the ingredients into a string, and then used a regex to get rid of the brackets and put commas between each element  
                var ingredients = JSON.stringify(store.menu[item].Ingredients);
                var ingredients = ingredients.replace(/[\[\]{}"]/g, '').replace(/,/g, ', ');
                // Create the html 
                itemPanel.innerHTML = `
                    <h2 class="item">${item}</h2>
                    <p class="ingredients">${ingredients}</p>
                    <div class="bottom">
                        <p class="price">${typeof store.menu[item].Price == "object" ? 'From $' + Object.values(store.menu[item].Price)[0] : "$" + JSON.stringify(store.menu[item].Price)}</p>
                        <button class="view">View Item</button>
                    </div>
                `
                storeItemPanelContainer.appendChild(itemPanel);
            }
            storePanel.appendChild(storeItemPanelContainer);
            menuContainer.appendChild(storePanel);
        })
    })
})