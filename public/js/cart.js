document.addEventListener("DOMContentLoaded", () => {

    const cartDataContainer = document.getElementById("cartDataContainer")
    const userData = cartDataContainer.textContent;
    cartDataContainer.textContent = "";
    let data = JSON.parse(userData);
    console.log(data);
    for (let store in data['cart']) {
        console.log(store);
        // Create a new element which will hold the menu items of each store, add class/ID to it for css manipulation
        var storePanel = document.createElement("div");
        storePanel.className = "storePanel";
        storePanel.id = store

        // Create a store title element, needed to make this seperately because I wanted it to sit above all of the item panels below it.
        storeTitle = document.createElement("div")
        storeTitle.className = "storeTitle"
        storeTitle.innerHTML = `${store}`;
        // Append the title element to the store panel
        storePanel.appendChild(storeTitle)

        // Create a container for the menu items to sit in
        storeItemPanelContainer = document.createElement("div");
        storeItemPanelContainer.className = "itemPanelContainer";

        // Loop through each item in the store
        for (let item in data['cart'][store]) {
            console.log(item);
            var itemPanel = document.createElement("div");
            itemPanel.className = "itemPanel";
            var ingredientPanel = document.createElement("div");
            ingredientPanel.className = "ingredientPanel";
            itemPanel.appendChild(ingredientPanel);
            for (let ingredient in data['cart'][store][item]) {
                var ingredientt = document.createElement("div");
                ingredientt.className = "ingredient";
                ingredientt.textContent = ingredient;
                ingredientPanel.appendChild(ingredientt);
            }
            storeItemPanelContainer.appendChild(itemPanel);
        }
        storePanel.appendChild(storeItemPanelContainer);
        cartDataContainer.appendChild(storePanel);
    }})