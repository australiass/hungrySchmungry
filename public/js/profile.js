document.addEventListener("DOMContentLoaded", () => {
	// Logout function, very straightforward
    document.getElementById("logout").addEventListener("click", () => {
        fetch("/logout", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        })
        .then(response => {
            window.location.href = "/login";
            return response.json();
        })
        .then(data => console.log("Response:", data))
        .catch(error => console.error("Error:", error));
    })
});