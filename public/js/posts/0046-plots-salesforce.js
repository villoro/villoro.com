// Importing Chart.js via CDN instead of module specifier
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
script.type = 'text/javascript';
script.onload = function () {
  // Your Chart.js code here
  (async function () {

    // Start of the actual plot code

    new Chart("sf_querying_times", {
      type: 'bar',
      data: {
        labels: ['query_all', 'query_all_iter', 'bulk', 'bulk (lazy)', 'bulk2'],
        datasets: [
          {
            label: 'Query Time',
            backgroundColor: "#3a76ff", 
            data: [305.85, 301.51, 154.44, 183.47, 130.02],
          },
        ],
      },
      options: {
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

    // End of the plot code
    
  })();
};
document.head.appendChild(script);
