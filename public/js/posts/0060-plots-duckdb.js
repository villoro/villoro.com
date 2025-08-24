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
    new Chart("speed-by-tools", {
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
            backgroundColor: "#40DE7A",
            data: [5.77, 0],
          },
          {
            label: 'pandas',
            backgroundColor: "#FF764D",
            data: [19.57, 0],
          },
          {
            label: 'chdb',
            backgroundColor: "#639CF8",
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

    const data_duckdb_improvements = {
      labels: [
        "0.2.7", "0.2.8", "0.2.9", "0.3.0", "0.3.1", "0.3.2", "0.3.4", "0.4.0", "0.5.1", "0.6.1", "0.7.1", "0.8.1",
        "0.9.0", "0.9.1", "0.9.2", "0.10.0", "0.10.1", "0.10.2", "0.10.3", "1.0.0"
      ],
      datasets: [
        {
          label: "Window Functions",
          borderColor: "#FF764D",
          backgroundColor: "#FF764D",
          data: [
            342.486, 341.24, 212.113, 211.733, 96.992, 115.474, 112.773, 90.893, 78.449, 184.934, 225.069, 84.328,
            14.237, 14.015, 13.714, 13.692, 13.356, 13.459, 13.934, 13.8
          ],
          pointRadius: 1
        },
        {
          label: "Export",
          borderColor: "#40DE7A",
          backgroundColor: "#40DE7A",
          data: [
            59.395, 49.766, 43.141, 44.423, 43.6, 61.441, 61.148, 63.334, 40.484, 32.054, 34.703, 11.26, 10.798,
            10.873, 10.612, 10.937, 11.119, 5.863, 5.931, 5.986
          ],
          pointRadius: 1
        },
        {
          label: "Analysis - Join",
          borderColor: "#3a76ff",
          backgroundColor: "#3a76ff",
          data: [
            25.18, 23.498, 24.397, 24.429, 24.326, 25.369, 38.16, 41.483, 37.71, 8.785, 5.482, 8.107, 7.752,
            7.692, 7.694, 5.413, 5.419, 5.428, 5.44, 5.429
          ],
          pointRadius: 1
        },
        {
          label: "CSV Import",
          borderColor: "#5E5E5E",
          backgroundColor: "#5E5E5E",
          data: [
            16.32, 15.876, 16.508, 16.925, 18.299, 18.508, 23.037, 25.117, 24.11, 22.983, 22.787, 7.642, 6.505,
            6.128, 6.231, 4.941, 5.03, 5.096, 5.358, 5.42
          ],
          pointRadius: 1
        },
        {
          label: "Scan other formats",
          borderColor: "#BA77F9",
          backgroundColor: "#BA77F9",
          data: [
            0.119, 0.116, 0.098, 0.098, 0.018, 0.016, 0.015, 0.015, 0.018, 0.016, 0.014, 0.015, 0.014, 0.014,
            0.014, 0.015, 0.016, 0.014, 0.014, 0.016
          ],
          pointRadius: 1
        },
        {
          label: "Analysis - Group By",
          borderColor: "#ffc33a",
          backgroundColor: "#ffc33a",
          data: [
            28.189, 26.275, 20.996, 20.642, 8.336, 8.097, 9.082, 7.279, 5.325, 2.652, 2.487, 2.629, 2.423, 2.462,
            2.446, 2.107, 2.092, 2.08, 2.107, 2.147
          ],
          pointRadius: 1
        }
      ]
    };
    new Chart("plot-duckdb-improvements", {
      type: "line",
      data: data_duckdb_improvements,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Duckdb improvements over time'
          }
        }, /*
        scales: {
          y: {type: 'logarithmic'}
        } */
      }
    });

    // End of the plot code

  })();
};
document.head.appendChild(script);
