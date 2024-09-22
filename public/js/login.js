document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("switch-form").addEventListener("click", () => { // the 'don't have an account? Register' and 'Already have an account? login' buttons
        if (window.location.href.includes("/login"))  { // If the user is on the login page
            window.location.href = "/register";
        } else {
            window.location.href = "/login";
        }
    })

	// Submit form event listener
    document.getElementById("submit-form").addEventListener("click", () => {
		// Pull the values from the input fields
        const email = document.getElementById("input-email").value;
        const password = document.getElementById("input-password").value;
        if (window.location.href.includes("/register")) { // If on the register page

            const name = document.getElementById("input-name").value; // Get the name field that wouldn't be on the login page

            let data = { name, email, password }; // set the map which will be the user's data

			// Register the user 
            fetch("/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })

            .then(response => {
                if (response.ok) {
                    window.location.href = "/login";
                } else {
                    document.getElementById("errorMessage").style.display = "block";
                }
                return response.json();
            })
            .then(data => console.log("Response:", data))
            .catch(error => console.error("Error:", error));

        } else if (window.location.href.includes("/login")) {
            let data = { email, password };
            fetch("/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/menu";
                } else {
                    document.getElementById("errorMessage").style.display = "block";
                }
                return response.json();
            })
            .then(data => console.log("Response:", data))
            .catch(error => console.error("Error:", error));
        }
	})
})