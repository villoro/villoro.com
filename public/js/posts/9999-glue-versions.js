// Importing Chart.js via CDN instead of module specifier
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
script.type = "text/javascript";
script.onload = function () {
  (async function () {
    // Start of the actual plot code
    const data = {
      labels: [
        "2025-03-02", "2025-03-03", "2025-03-04", "2025-03-05", "2025-03-06", "2025-03-07", "2025-03-08", "2025-03-09", "2025-03-10",
        "2025-03-11", "2025-03-12", "2025-03-13", "2025-03-14", "2025-03-15", "2025-03-16", "2025-03-17", "2025-03-18", "2025-03-19",
        "2025-03-20", "2025-03-21", "2025-03-22", "2025-03-23", "2025-03-24", "2025-03-25", "2025-03-26", "2025-03-27", "2025-03-28",
        "2025-03-29", "2025-03-30", "2025-03-31", "2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04", "2025-04-05", "2025-04-06",
        "2025-04-07", "2025-04-08"
      ],
      datasets: [
        {
          label: "daily",
          borderColor: "#3a76ff",
          backgroundColor: "#3a76ff",
          data: [
            111.63, 119.69, 116.13, 108.73, 126.4, 110.7, 106.92, 102.81, 114.2, 115.77, 108.99, 109.8, 118.63, 120.35, 111.56,
            124.91, 120.9, 116.31, 129.99, 118.94, 121.23, 127.56, 131.78, 124.82, 131.55, 132.46, 129.75, 124.65, 129.6, 130.05,
            134.9, 127.59, 59.99, 60.3, 61.96, 60.38, 58.07, 57.01
          ],
          pointRadius: 1
        },
        {
          label: "hourly",
          borderColor: "#ffc33a",
          backgroundColor: "#ffc33a",
          data: [
            58.06, 58.73, 60.42, 59.96, 62.3, 60.87, 60.26, 58.66, 59.23, 58.82, 59.48, 63.97, 64.4, 62.88, 62.03, 62.53, 63.68,
            64.73, 67.06, 66.78, 63.87, 66.12, 68.07, 66.9, 68.48, 68.98, 67.94, 65.3, 68.78, 69.56, 71.75, 34.55, 16.51, 16.82,
            16.99, 16.12, 15.6, 15.06
          ],
          pointRadius: 1
        }
      ]
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'DBT execution time [mins]'
        }
      }
    }

    new Chart("plot-dbt-execution-time", {
      type: "line",
      data: data,
      options: options
    });

    // End of the plot code

  })();
};
document.head.appendChild(script);
