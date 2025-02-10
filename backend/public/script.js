/////////////////////////////// CHART COLORS ///////////////////////////////
c_red = "#FF0000";
c_sound = "#FFA500";
c_us1 = "#0000FF";
c_us2 = "#008000";

b_red = "#FF0000";
b_sound = "#FFA500";
b_us1 = ["rgba(36, 69, 219, 0.31)"];
b_us2 = ["rgba(28, 189, 41, 0.31)"];

/////////////////////////////// NOTIFICATIONS ///////////////////////////////

// Function to fetch data from the server
async function fetchData(endpoint) {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
}

// Function to update chart data
function updateChartData(chart, newData) {
    chart.data.labels = newData.labels;
    chart.data.datasets[0].data = newData.datasets[0].data;
    chart.update();
}

// Function to fetch and update all charts
async function fetchAndUpdateCharts() {
    const data = await fetchData('/ocitanja');

    // Update red light chart
    const redLightData = {
        labels: data.map(entry => entry.datum),
        datasets: [{
            label: "Red Light Status",
            data: data.map(entry => entry.red),
            // backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            // borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 1,
        }],
    };
    updateChartData(redLightChart, redLightData);

    // Update sound chart
    const soundData = {
        labels: data.map(entry => entry.datum),
        datasets: [{
            label: "Sound Status",
            data: data.map(entry => entry.buzzer),
            // backgroundColor: ["rgba(54, 162, 235, 0.2)"],
            // borderColor: ["rgba(54, 162, 235, 1)"],
            borderWidth: 1,
        }],
    };
    updateChartData(soundChart, soundData);

    // Update ultrasonic sensor 1 chart
    const ultrasonicData1 = {
        labels: data.map(entry => entry.datum),
        datasets: [{
            label: "Sensor 1",
            data: data.map(entry => entry.us_1),
            // backgroundColor: "rgba(75, 192, 192, 0.2)",
            // borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
        }],
    };
    updateChartData(ultrasonicChart1, ultrasonicData1);

    // Update ultrasonic sensor 2 chart
    const ultrasonicData2 = {
        labels: data.map(entry => entry.datum),
        datasets: [{
            label: "Sensor 2",
            data: data.map(entry => entry.us_2),
            // backgroundColor: "rgba(153, 102, 255, 0.2)",
            // borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
        }],
    };
    updateChartData(ultrasonicChart2, ultrasonicData2);

	 // Update raw data notifications
	 const notificationText = document.getElementById('notification-text');
	 notificationText.innerHTML = JSON.stringify(data[0], null, 2);
}

/////////////////////////////// CREATE CHARTS ///////////////////////////////

// Create the red light chart
const redLightCtx = document.getElementById("redLightChart").getContext("2d");
const redLightChart = new Chart(redLightCtx, {
    type: "bar",
    data: { labels: [], datasets: [{ backgroundColor: c_red, borderColor: b_red, label: "Red Light Status", data: [] }] },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});

// Create the sound chart
const soundCtx = document.getElementById("soundChart").getContext("2d");
const soundChart = new Chart(soundCtx, {
    type: "bar",
    data: { labels: [], datasets: [{ backgroundColor: c_sound, borderColor: b_sound, label: "Sound Status", data: [] }] },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});

// Create the ultrasonic sensor 1 radar chart
const ultrasonicCtx1 = document.getElementById("ultrasonicChart1").getContext("2d");
const ultrasonicChart1 = new Chart(ultrasonicCtx1, {
    type: "line",
    data: { labels: [], datasets: [{ backgroundColor:c_us1, borderColor: b_us1, label: "Sensor 1", data: [] }] },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});

// Create the ultrasonic sensor 2 chart
const ultrasonicCtx2 = document.getElementById("ultrasonicChart2").getContext("2d");
const ultrasonicChart2 = new Chart(ultrasonicCtx2, {
    type: "line",
    data: { labels: [], datasets: [{ backgroundColor:c_us2, borderColor: b_us2, label: "Sensor 2", data: [] }] },
    options: {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    },
});

// Set interval to fetch and update charts every second
setInterval(fetchAndUpdateCharts, 1000);
