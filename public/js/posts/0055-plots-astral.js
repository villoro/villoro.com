// Importing Chart.js via CDN instead of module specifier
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
script.type = 'text/javascript';
script.onload = function () {
  // Your Chart.js code here
  (async function () {

    // Start of the actual plot code
    new Chart("astral_uv", {
      type: 'bar',
      data: {
        labels: ['uv', 'PDM', 'Poetry', 'pip-sync'],
        datasets: [
          {
            label: 'Warm Resolution',
            backgroundColor: "#FFB74D",
            data: [0.05, 2, 0.6, 1.25],
          },
          {
            label: 'Warm Installation',
            backgroundColor: "#AED581",
            data: [0.1, 1.8, 0.9, 3.8],
          },
          {
            label: 'Cold Resolution',
            backgroundColor: "#EF5350",
            data: [0.4, 3.2, 3.52, 3.95],
          },
          {
            label: 'Cold Installation',
            backgroundColor: "#9575CD",
            data: [1.1, 2.1, 2.5, 7.2],
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          y: {
            title: {
              display: true,
              text: 'Time [seconds]'
            }
          }
        }
      }
    });

    new Chart("astral_ruff", {
      type: 'bar',
      data: {
        labels: ['ruff', 'black', 'yapf', 'autopep8'],
        datasets: [
          {
            backgroundColor: "#3a76ff", 
            data: [0.1, 3.2, 17.77, 19.56],
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          y: {
            title: {
              display: true,
              text: 'Time [seconds]'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
    // End of the plot code
    
  })();
};
document.head.appendChild(script);
