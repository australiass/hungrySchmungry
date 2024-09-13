document.addEventListener("DOMContentLoaded", () => {
    console.log("menuItem loaded");
    // collect the url as a string and split it by slashes
    const pathParts = window.location.pathname.split("/");
    // pull the store and item from the url and decode it (removes the %20 in place of spaces)
    const store = decodeURIComponent(pathParts[pathParts.length - 2]);
    const item = decodeURIComponent(pathParts.pop());
    // Fetch the specific item's array of information from the api
    console.log("Attempting to fetch", item, "from", store, "from menuItem.js");
    fetch(`/api/menuData/${encodeURIComponent(store)}/${encodeURIComponent(item)}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Testing purposes


            // Set the image path
            document.getElementById("img").setAttribute("src", `/assets/${store} - ${item.toLowerCase()}.png`);

            // display the title of the item
            document.getElementById("title").textContent = item;

            // display the ingredients of the item
            document.getElementById("ingredients").textContent = (data.Ingredients).toString().replaceAll(",", ", ");

			// display the price of the item
			document.getElementById("price").textContent = `$${data.Price}`;

			//document.getElementById("item").textContent = `Customise the ${item.toLowerCase()} to your liking:`;

            // loop through ingredients, create a dropdown item for each of them
            let ingredientsContent = document.getElementById("ingredientsContent");

            let ingredientData = {};

			ingredients = data.Ingredients;

            ingredients.forEach(ingredient => {
				var container = document.createElement("div");
                var label = document.createElement("label");
				label.textContent = ingredient;
				label.for = "customCheckbox";
				var input = document.createElement("input");
				input.type = "checkbox";
				input.value = ingredient;
				input.checked = true;
				input.id = "customCheckbox";
				input.classList.add("custom-checkbox");
                container.appendChild(label);
				container.appendChild(input);
				ingredientsContent.appendChild(container);
                ingredientData[ingredient] = true;
            })

            data.IngredientData = ingredientData;

            let saveChangesButton = document.createElement("button");
            saveChangesButton.textContent = "Save Changes";
            saveChangesButton.id = "updateChanges";
            ingredientsContent.appendChild(saveChangesButton);

            // all event listeners added below
            // had to be within the promise response as its asynchronous and some of the functions are applied to elements generate above

            // Display/remove the edit dropdown container on clicking the edit button
            document.getElementById('customCheckbox').addEventListener('click', function() {
    			console.log('Checkbox state:', this.checked);
			});

            // Handle save changes button
            document.getElementById("updateChanges").addEventListener("click", () => {
                ingredients = document.getElementById("ingredientsContent").querySelectorAll("input");
                ingredients.forEach(ingredient => {
                    data.IngredientData[ingredient.value] = ingredient.checked;
                })
                document.getElementById("ingredientsContent").style.display = "none";
            })

            // Handle adding to cart
            document.getElementById("addToCart").addEventListener("click", () => {
                console.log("Clicked button");
                fetch("/addItemToCart", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                })
                .then(response => {
					var cart = document.getElementById("cartIcon");
					cart.classList.remove("cartPumpActive");
					void cart.offsetWidth;
					cart.classList.add("cartPumpActive");
                    return response.json();
                })
                .then(data => console.log("Response:", data))
                .catch(error => console.error("Error:", error));
            })

        })
        .catch(error => console.error("Error adding to cart", error));
})