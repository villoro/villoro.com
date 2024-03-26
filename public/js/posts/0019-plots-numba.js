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
    new Chart("chart_sum", {
      type: 'line',
      data: {
        labels: ['10^4', '10^5', '10^6', '10^7', '10^8', '10^9'],
        datasets: [
          {
            label: 'iter_and_sum',
            borderColor: "#F44336",
            backgroundColor: "#F44336",
            data: [0.000926, 0.009162, 0.092395, 0.9362, 9.335412, 96.134125],
            fill: false
          },
          {
            label: 'sum',
            borderColor: "#FF9800",
            backgroundColor: "#FF9800",
            data: [0.00075, 0.007408, 0.075894, 0.76689, 7.549756, 76.537118],
            fill: false
          },
          {
            label: 'np.sum',
            borderColor: "#03A9F4",
            backgroundColor: "#03A9F4",
            data: [0.000008, 0.000042, 0.000408, 0.004393, 0.042701, 0.433185],
            fill: false
          },
          {
            label: 'jit',
            borderColor: "#8BC34A",
            backgroundColor: "#8BC34A",
            data: [0.000001, 0.000009, 0.000106, 0.002313, 0.021232, 0.238718],
            fill: false
          },
          {
            label: 'njit',
            borderColor: "#4CAF50",
            backgroundColor: "#4CAF50",
            data: [0.000001, 0.000010, 0.00012, 0.002345, 0.020506, 0.225308],
            fill: false
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Time of different sum functions'
          }
        },
        ...scales
      }
    });


    new Chart("chart_fix_time", {
      type: 'line',
      data: {
        labels: ['10^2', '10^3', '10^4', '10^5', '10^6', '10^7', '10^8'],
        datasets: [
          {
            label: 'zfill',
            borderColor: "#616161",
            backgroundColor: "#616161",
            data: [0.004388, 0.00716, 0.030412, 0.29548, 3.424938, 37.434941, 721.881598],
            fill: false
          },
          {
            label: 'fix_time_individual',
            borderColor: "#FF9800",
            backgroundColor: "#FF9800",
            data: [0.213377, 0.223842, 0.265528, 0.711711, 5.112963, 50.304211, 508.880023],
            fill: false
          },
          {
            label: 'fix_time_np_string',
            borderColor: "#2196F3",
            backgroundColor: "#2196F3",
            data: [0.434647, 0.443458, 0.483543, 0.7359, 3.425526, 30.280986, 310.148904],
            fill: false
          },
          {
            label: 'fix_time_np_datetime',
            borderColor: "#9C27B0",
            backgroundColor: "#9C27B0",
            data: [0.535352, 0.518424, 0.558784, 0.838042, 3.527455, 32.378085, 326.442289],
            fill: false
          },
          {
            label: 'np_divmod_jit',
            borderColor: "#F44336",
            backgroundColor: "#F44336",
            data: [0.428438, 0.437135, 0.536995, 1.435995, 10.157285, 97.415906, 973.317809],
            fill: false
          },
          {
            label: 'divmod_njit',
            borderColor: "#8BC34A",
            backgroundColor: "#8BC34A",
            data: [0.132344, 0.131134, 0.142893, 0.168305, 0.419848, 2.916234, 31.491899],
            fill: false
          },
          {
            label: 'divmod_vectorize',
            borderColor: "#4CAF50",
            backgroundColor: "#4CAF50",
            data: [0.088566, 0.090028, 0.10128, 0.127379, 0.384422, 2.804018, 31.602522],
            fill: false
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Time of different fix_time functions'
          }
        },
        ...scales
      }
    });

    new Chart("chart_fix_time_comparison", {
      type: 'line',
      data: {
        labels: ['10^2', '10^3', '10^4', '10^5', '10^6', '10^7'],
        datasets: [
          {
            label: 'zfill azure',
            borderColor: "#616161",
            backgroundColor: "#616161",
            data: [0.004388, 0.00716, 0.030412, 0.29548, 3.424938, 37.434941],
            fill: false
          },
          {
            label: 'divmod_vectorize azure',
            borderColor: "#4CAF50",
            backgroundColor: "#4CAF50",
            data: [0.088566, 0.090028, 0.10128, 0.127379, 0.384422, 2.804018],
            fill: false
          },
          {
            label: 'zfill i5',
            borderColor: "#BDBDBD",
            backgroundColor: "#BDBDBD",
            data: [0.00289, 0.00744, 0.036504, 0.304326, 3.294064, 35.19163],
            fill: false
          },
          {
            label: 'divmod_vectorize i5',
            borderColor: "#A5D6A7",
            backgroundColor: "#A5D6A7",
            data: [0.090219, 0.09166, 0.100109, 0.191021, 1.051343, 9.71132],
            fill: false
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Time of different fix_time functions with different machines'
          }
        },
        ...scales
      }
    });
    // End of the plot code

  })();
};
document.head.appendChild(script);
