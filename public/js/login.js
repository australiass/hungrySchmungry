document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("switch-form").addEventListener("click", () => {
        if (window.location.href.includes("/login"))  {
            window.location.href = "/register";
        } else {
            window.location.href = "/login";
        }
    })

    document.getElementById("submit-form").addEventListener("click", () => {
        const email = document.getElementById("input-email").value;
        const password = document.getElementById("input-password").value;
        if (window.location.href.includes("/register")) {

            const name = document.getElementById("input-name").value;

            data = { name, email, password } 

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
            data = {email, password};
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

});
});