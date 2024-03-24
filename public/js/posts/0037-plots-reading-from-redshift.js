// Importing Chart.js via CDN instead of module specifier
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
script.type = "text/javascript";
script.onload = function () {
  (async function () {
    // Start of the actual plot code
    
    const scale_seconds = {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Time [seconds]'
          }
        }
      }
    }
    const functions = ['pandas_read', 'pyarrow_ds_read', 'pyarrow_parquet_ds_read', 'pyarrow_single_read']
    const datasets = ['dataset_1', 'dataset_2']

    new Chart("dataset_0", {
      type: 'bar',
      data: {
        labels: functions,
        datasets: [
          {
            label: 'no_filter',
            backgroundColor: "#EF5350",
            data: [8.856600, 7.468612, 7.463320, 9.433437, 0],
              /* Adding an extra 0 for setting the min axis to 0 */
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Reading time for dataset 0 (single parquet)'
          }
        },
        legend: {
          display: false
        },
        ...scale_seconds
      }
    });

    new Chart("dataset_2", {
      type: 'bar',
      data: {
        labels: functions,
        datasets: [
          {
            label: 'filter',
            backgroundColor: "#FF9800",
            data: [29.401111, 0.582480, 0.739624, 29.645606],
          },
          {
            label: 'no_filter',
            backgroundColor: "#FFCC80",
            data: [22.709390, 7.273302, 8.621203, 28.806552],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Reading time for dataset 2 (Multiple parquets by month)'
          }
        },
        ...scale_seconds
      }
    });

    new Chart("dataset_1", {
      type: 'bar',
      data: {
        labels: functions,
        datasets: [
          {
            label: 'filter',
            backgroundColor: "#8BC34A",
            data: [7.235872, 0.464466, 0.394429, 7.429504],
          },
          {
            label: 'no_filter',
            backgroundColor: "#C5E1A5",
            data: [5.349147, 4.558274, 4.739228, 5.164837],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Reading time for dataset 1 (One parquet by month)'
          }
        },
        ...scale_seconds
      }
    });

    new Chart("pyarrow_best", {
      type: 'bar',
      data: {
        labels: datasets,
        datasets: [
          {
            label: 'pyarrow_ds_read',
            backgroundColor: "#4FC3F7",
            data: [0.464466, 0.582480],
          },
          {
            label: 'pyarrow_parquet_ds_read',
            backgroundColor: "#9575CD",
            data: [0.394429, 0.739624, 0],
              /* Adding an extra 0 for setting the min axis to 0 */
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Comparison between best reading options'
          }
        },
        ...scale_seconds
      }
    });

    new Chart("row_group", {
      type: 'bar',
      data: {
        labels: datasets,
        datasets: [
          {
            label: 'pyarrow_ds_read',
            backgroundColor: "#29B6F6",
            data: [0.495962, 0.623322],
          },
          {
            label: 'pyarrow_parquet_ds_read',
            backgroundColor: "#7E57C2",
            data: [1.254674, 2.003886, 0],
              /* Adding an extra 0 for setting the min axis to 0 */
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Reading time when using row group filtering'
          }
        },
        ...scale_seconds
      }
    });

    // End of the plot code

  })();
};
document.head.appendChild(script);
