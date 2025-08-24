// Importing Chart.js via CDN instead of module specifier
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
script.type = "text/javascript";
script.onload = function () {
  (async function () {
    // Start of the actual plot code

    var count_scales = {
      x: {
        title: {
          display: true,
          text: 'time [s]'
        }
      }
    }

    new Chart("speed_by_tools", {
      type: 'bar',
      data: {
        labels: ["Benchmark 1", "Benchmark 2"],
        datasets: [
          {
            label: 'duckdb',
            backgroundColor: "#FFEB3B", 
            data: [3.84, 3.99],
          },
          {
            label: 'polars',
            backgroundColor: "#639CF8",
            data: [5.77, 0],
          },
          {
            label: 'pandas',
            backgroundColor: "#FF764D",
            data: [19.57, 0],
          },
          {
            label: 'chdb',
            backgroundColor: "#40DE7A",
            data: [0, 9.3],
          },
          {
            label: 'spark',
            backgroundColor: "#AE78C4",
            data: [0, 16.39],
          }
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Processing time (lower is better)'
          }
        },
        scales: count_scales,
      }
    });

    // End of the plot code

  })();
};
document.head.appendChild(script);
