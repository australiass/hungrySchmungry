document.addEventListener("DOMContentLoaded", async () => {

    async function fetchMenuData() {
        try {
            const response = await fetch("/api/menudata")
            const data = await response.json();
            return JSON.parse(data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    }

    const menuData = await fetchMenuData();

    const cartDataContainer = document.getElementById("cartDataContainer")
    const userData = cartDataContainer.textContent;
    cartDataContainer.textContent = "";
    let data = JSON.parse(userData);
    let totalCost = 0;
    for (let store in data['cart']) {
        // Create a new element which will hold the menu items of each store, add class/ID to it for css manipulation
        var storePanel = document.createElement("div");
        storePanel.className = "storePanel";
        storePanel.id = store

        // Get the store's menu data
        for (let newStore in menuData) {
            if (menuData[newStore]["store"] == store) {
                storeMenuData = menuData[newStore]["menu"]
                break;
            }
        }

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
            var itemPanel = document.createElement("div");
            itemPanel.className = "itemPanel";
            //
            
            //
            var ingredientPanel = document.createElement("div");
            ingredientPanel.className = "ingredientContainer";
            //
            for (let variation in data['cart'][store][item]) { // For each variation in the item
                var variationDiv = document.createElement("div");
                variationDiv.className = "variationContainer";
                var itemLabel = document.createElement("div");
                itemLabel.className = "variationLabel"
                itemLabel.textContent = `${item} [x${data['cart'][store][item][variation]["amount"]}]`;
                //
                var variationDivLeft = document.createElement("div");
                variationDivLeft.className = "variationDivLeft";
                variationDivLeft.appendChild(itemLabel);
                var variationDivRight = document.createElement("div");
                variationDivRight.className = "variationDivRight";
                variationDivRight.id = store;
                totalCost+=data['cart'][store][item][variation]["amount"] * storeMenuData[item].Price;
                variationDivRight.innerHTML = `<div class="price">$${parseFloat(data['cart'][store][item][variation]["amount"] * storeMenuData[item].Price).toFixed(2)}</div><i class="fa-solid fa-x remove" id="${item}"></i>`;

                //variationDiv.textContent = JSON.stringify(data['cart'][store][item][variation]);
                for (let ingredient in data['cart'][store][item][variation]) { // For each ingredient in the variation
                    if (data['cart'][store][item][variation][ingredient] == true && data['cart'][store][item][variation][ingredient] !== 1) {
                        var ingredientDiv = document.createElement("div");
                        ingredientDiv.textContent = ` - ${ingredient}`
                        variationDivLeft.appendChild(ingredientDiv);
                    }
                }
                variationDiv.appendChild(variationDivLeft);
                variationDiv.appendChild(variationDivRight);
                ingredientPanel.appendChild(variationDiv);
                var hiddenJSON = document.createElement("div");
                hiddenJSON.style.display = "none";
                hiddenJSON.id = "json";
                hiddenJSON.textContent = JSON.stringify(data['cart'][store][item][variation]);
                variationDivRight.appendChild(hiddenJSON);
            }
            itemPanel.appendChild(ingredientPanel);
            storeItemPanelContainer.appendChild(itemPanel);
        }
        storePanel.appendChild(storeItemPanelContainer);
        cartDataContainer.appendChild(storePanel);
    }

    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", () => {
            let element = button.parentElement;

            let item = button.id;
            let store = button.parentElement.id;
            let variation = JSON.parse(element.querySelector("#json").textContent);

            fetch("/removeItemFromCart", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ variation: variation, store: store, item: item })
            })
            .then(response => {
                if (response.status == 200) {
                    window.location.href = "/cart";
                }
                return response.json();
            })
            .then(data => console.log("Response:", data))
            .catch(error => console.error("Error:", error));
        })
    })
})