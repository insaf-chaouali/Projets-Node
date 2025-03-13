document.addEventListener("DOMContentLoaded", function () {
    fetchStats();
});

function fetchStats() {
    fetch("/api/stats")
        .then(response => response.json())
        .then(data => {
            document.getElementById("clientCount").innerText = data.clients;
            document.getElementById("proCount").innerText = data.professionnels;
            document.getElementById("reservationCount").innerText = data.reservations;
            
            renderDoughnutChart(data);
            renderLineChart(data);
        })
        .catch(error => console.error("Erreur lors du chargement des statistiques:", error));
}

// ✅ 1. CHART EN ANNEAU (DOUGHNUT)
function renderDoughnutChart(data) {
    const ctx = document.getElementById("doughnutChart").getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Clients", "Professionnels", "Réservations"],
            datasets: [{
                label: "Répartition des Utilisateurs",
                data: [data.clients, data.professionnels, data.reservations],
                backgroundColor: [
                    'rgb(255, 99, 132)',  // Rouge pour les clients
                    'rgb(54, 162, 235)',  // Bleu pour les professionnels
                    'rgb(255, 205, 86)'   // Jaune pour les réservations
                ],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                customCanvasBackgroundColor: {
                    color: 'lightGreen',
                }
            }
        },
        plugins: [{
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart, args, options) => {
                const { ctx } = chart;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = options.color || '#99ffff';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }]
    });
}

// ✅ 2. CHART EN LIGNE (LINE)
function renderLineChart(data) {
    const ctx = document.getElementById("lineChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"],
            datasets: [{
                label: "Évolution des Clients",
                data: data.clientStats || [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
    });
}