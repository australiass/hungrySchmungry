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
        document.getElementById("ingredients").textContent = data.Ingredients;

        // loop through ingredients, create a dropdown item for each of them
        let dropdown = document.getElementById("dropdownContent");
        (data.Ingredients).forEach(ingredient => {
            var label = document.createElement("label");
            label.innerHTML = `
                <input type="checkbox" value="${ingredient}" checked> ${ingredient}
            `;
            dropdown.appendChild(label);
        })
        let saveChangesButton = document.createElement("button");
        saveChangesButton.textContent = "Save Changes";
        saveChangesButton.id = "updateChanges";
        dropdown.appendChild(saveChangesButton);

        // all event listeners added below
        // had to be within the promise response as its asynchronous and some of the functions are applied to elements generate above

        // Display/remove the edit dropdown container on clicking the edit button
        document.getElementById("editButton").addEventListener("click", () => {
            let editDropdown = document.getElementById("dropdownContent");
						console.log(editDropdown.style.display);
            (editDropdown.style.display != "flex") ? editDropdown.style.display = "flex" : editDropdown.style.display = "none";
        })

        document.getElementById("updateChanges").addEventListener("click", () => {
            ingredients = document.getElementById("dropdownContent").querySelectorAll("input");
            ingredients.forEach(ingredient => {
                console.log(ingredient, ingredient.checked);
            })
        })
    })
    .catch(error => console.error("Error fetching menu item:". error))

    
})