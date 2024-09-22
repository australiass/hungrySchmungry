document.addEventListener("DOMContentLoaded", async () => {

	// Define an asynchronous function so I can ensure the data is loaded before I begin generating HTML or adding eventlisteners to elements
	// When I just fetched the data first, the elements were being generated before I even had the data and major errors were happening
    async function fetchMenuData() {
        try {
			// Make an api request for the backend to upload the menu data, and then parse it and return it as the function output
            const response = await fetch("/api/menudata");
            const data = await response.json();
            return JSON.parse(data);
        } catch (error) {
            console.error("Error fetching menu data:", error);
			return;
        }
    }

    const menuData = await fetchMenuData(); // Pull menu data

	// Did a dodgy thing here, since I couldn't manage to get the user's data here without making major changes to everything, so when the page first loads,-
	// it puts the user's data in the cartDataContainer and I just read that, and parse it as json, and then delete it from the page
    const cartDataContainer = document.getElementById("cartDataContainer")
    const userData = cartDataContainer.textContent;
    cartDataContainer.textContent = "";
    let data = JSON.parse(userData);

    let totalCost = 0;
    for (let store in data['cart']) { // Loop each store in the user's cart
        // Create a new element which will hold the menu items of each store, add class/ID to it for css manipulation
        let storePanel = document.createElement("div");
        storePanel.className = "storePanel";
        storePanel.id = store

        // Get the store's menu data
        for (let newStore in menuData) {
            if (menuData[newStore]["store"] == store) {
                storeMenuData = menuData[newStore]["menu"]
                break;
            }
        }

		// !----
		// There is a lot of HTML generation below, it's not really important to understand why I did what I did. All you need to know is that it builds up the cart page based on the user's cart data
		// ! ----

        // Create a store title element, needed to make this seperately because I wanted it to sit above all of the item panels below it.
        let storeTitle = document.createElement("div");
        storeTitle.className = "storeTitle";
        storeTitle.innerHTML = `${store}`;
        // Append the title element to the store panel
        storePanel.appendChild(storeTitle);

        // Create a container for the menu items to sit in
        let storeItemPanelContainer = document.createElement("div");
        storeItemPanelContainer.className = "itemPanelContainer";

        // Loop through each item in the store
        for (let item in data['cart'][store]) {
            let itemPanel = document.createElement("div");
            itemPanel.className = "itemPanel";

            let ingredientPanel = document.createElement("div");
            ingredientPanel.className = "ingredientContainer";
            for (let variation in data['cart'][store][item]) { // For each variation of the item in the user's cart
                let variationDiv = document.createElement("div");
                variationDiv.className = "variationContainer";
				//
                let itemLabel = document.createElement("div");
                itemLabel.className = "variationLabel"
                itemLabel.textContent = `${item} [x${data['cart'][store][item][variation]["amount"]}]`;
                //
                let variationDivLeft = document.createElement("div");
                variationDivLeft.className = "variationDivLeft";
                variationDivLeft.appendChild(itemLabel);
				//
                let variationDivRight = document.createElement("div");
                variationDivRight.className = "variationDivRight";
                variationDivRight.id = store;
                totalCost+=data['cart'][store][item][variation]["amount"] * storeMenuData[item].Price; // Add the (amount of this variation * the item's price) to the total price
                variationDivRight.innerHTML = `<div class="price">$${parseFloat(data['cart'][store][item][variation]["amount"] * storeMenuData[item].Price).toFixed(2)}</div><i class="fa-solid fa-x remove" id="${item}"></i>`;
				//
                for (let ingredient in data['cart'][store][item][variation]) { // For each ingredient in the variation
                    if (data['cart'][store][item][variation][ingredient] == true && data['cart'][store][item][variation][ingredient] !== 1) { // If the ingredient has been customised & the ingredient != 1. != 1 is there because if amount = 1, it calls true. boolean logic came in handy
                        var ingredientDiv = document.createElement("div");
                        ingredientDiv.textContent = ` - ${ingredient}`;
                        variationDivLeft.appendChild(ingredientDiv);
                    }
                }
				//
                variationDiv.appendChild(variationDivLeft);
                variationDiv.appendChild(variationDivRight);
				//
                ingredientPanel.appendChild(variationDiv);
				// Below, I did this because I couldn't get this data without being extremely elaborate due to how I'd set up the json data, so I just create an element that contains the json data for this variation to be read from the front end when removing an item from the cart, and then hide it. the user could still see it if they wanted to but there's no sensitive data there
                var hiddenJSON = document.createElement("div");
                hiddenJSON.style.display = "none";
                hiddenJSON.id = "json";
                hiddenJSON.textContent = JSON.stringify(data['cart'][store][item][variation]);
				//
                variationDivRight.appendChild(hiddenJSON);
            }
            itemPanel.appendChild(ingredientPanel);
            storeItemPanelContainer.appendChild(itemPanel);
        }
        storePanel.appendChild(storeItemPanelContainer);
        cartDataContainer.appendChild(storePanel);
    }

	// Adding a click listener to all of the remove buttons on all of the variations
    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", () => {

            let element = button.parentElement;
            let item = button.id;
            let store = button.parentElement.id;
            let variation = JSON.parse(element.querySelector("#json").textContent); // Gets the hidden data mentioned on line 93

			// Tell the backend to remove this variation from the user's cart
            fetch("/removeItemFromCart", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ variation: variation, store: store, item: item })
            })
            .then(response => {
                if (response.status == 200) {
                    window.location.href = "/cart"; // Reload the page if it's successful
                }
                return response.json();
            })
            .then(data => console.log("Response:", data))
            .catch(error => console.error("Error:", error));
        })
    })

	// Calculate delivery fee
	let deliveryFee = Math.round(totalCost/15);
	deliveryFee = (deliveryFee < 1.99 && totalCost !== 0) ? 1.99 : deliveryFee;

	// Create the checkoutContent element
	document.getElementById("checkoutContent").innerHTML = `<div id="orderTotals">
																<div><div style="font-size: 1.2vw; font-weight: bold;">Order Total</div></div>
																<div><div>Subtotal</div><div id="subtotal">$${totalCost}</div></div>
																<div><div>Delivery Fee</div><div id="delivery">$${deliveryFee}</div></div>
																<div><div style="font-size: 1.1vw; font-weight: bold;">Total</div><div id="total" style="font-size: 1.1vw; font-weight: bold;">$${totalCost + deliveryFee}</div></div>
															</div>
															<div id="address"><div>Standard Delivery</div><div>2 Argyle St, Schmobart</div></div>`
	
	// On click event listener for the 'place order' button
	document.getElementById("order").addEventListener("click", () => {
		let elements = ["cardNumberInput1", "cardNumberInput2", "cardNumberInput3", "cardNumberInput4", "csvInput"];
		let empty = false;
		for (let el in elements) {
			if (document.getElementById(elements[el]).value !== undefined) { // If the input field has data in it
				if (document.getElementById(elements[el]).maxLength !== document.getElementById(elements[el]).value.length) { // If it's the correct length (4 for each card number element, and 3 for the csv)
					empty = true; 
					break;
				}
			}
		}
		empty = (document.getElementById("expiryInput").value == "") ? (empty ? true : false) : false; // If the expiry has been set, set empty to what it was before, otherwise false
		if (!empty && totalCost > 0) { // If all of the card fields have been input, and the cart isn't empty
			// Empty the cart
			fetch("/resetCart", {
				method: "POST",
				headers: {"Content-Type": "application/json"}
			})
			.then(response => {
				window.location.href = "/menu"; // Reload the page
				return response.json();
			})
		}
	})

})