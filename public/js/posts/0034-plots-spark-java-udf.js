// Importing Chart.js via CDN instead of module specifier
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
script.type = "text/javascript";
script.onload = function () {
  (async function () {
    // Start of the actual plot code
    const scales = {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Time [s]',
          },
          type: 'logarithmic',
        },
        x: {
          title: {
            display: true,
            text: 'Number of rows'
          },
        },
      }
    }
      
    new Chart("chart_times", {
      type: 'line',
      data: {
        labels: ['10^3', '10^4', '10^5', '10^6', '10^7', '10^8'],
        datasets: [
          {
            label: 'python_udf',
            borderColor: "#FFA726",
            backgroundColor: "#FFA726",
            data: [2.348551, 3.140185, 3.876405, 5.552880, 24.151182, 195.032587],
            fill: false
          },
          {
            label: 'java_udf',
            borderColor: "#AED581",
            backgroundColor: "#AED581",
            data: [0.492574, 0.579370, 0.795821, 1.958956, 11.507726, 88.875919],
            fill: false
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Time with different UDFs'
          }
        },
        ...scales
      }
    });

    // End of the plot code

  })();
};
document.head.appendChild(script);
