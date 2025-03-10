document.getElementById("availabilityForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    
    if (!date || !time) {
        alert("Veuillez entrer une date et une heure.");
        return;
    }

    const list = document.getElementById("availabilityList");
    const newItem = document.createElement("li");
    newItem.classList.add("list-group-item");
    newItem.innerHTML = `${date} à ${time} <button class="btn btn-danger btn-sm float-end" onclick="removeSlot(this)">Supprimer</button>`;
    list.appendChild(newItem);
});

function removeSlot(button) {
    button.parentElement.remove();
}
