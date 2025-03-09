document.getElementById("professionalForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const professional = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        title: document.getElementById("title").value,
        specialty: document.getElementById("specialty").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch("/api/professional/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(professional)
    });

    const data = await response.json();
    alert(data.message);
});
