// Importing Chart.js via CDN instead of module specifier
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
script.type = "text/javascript";
script.onload = function () {
  (async function () {
    // Peak memory of one write, measured locally on the same Salesforce-like rows
    new Chart("memory-by-rows", {
      type: "line",
      data: {
        datasets: [
          {
            label: "pandas + awswrangler",
            borderColor: "#FF764D",
            backgroundColor: "#FF764D",
            data: [
              { x: 50, y: 0.74 },
              { x: 200, y: 2.45 },
              { x: 500, y: 5.64 },
            ],
          },
          {
            label: "Arrow + DuckDB",
            borderColor: "#639CF8",
            backgroundColor: "#639CF8",
            data: [
              { x: 50, y: 0.69 },
              { x: 200, y: 1.01 },
              { x: 500, y: 1.57 },
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "Peak memory of one write (lower is better)",
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} GB`,
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: 500,
            ticks: { stepSize: 100 },
            title: { display: true, text: "rows in the write [thousands]" },
          },
          y: {
            min: 0,
            title: { display: true, text: "peak memory [GB]" },
          },
        },
      },
    });
    // End of the actual plot code
  })();
};
document.head.appendChild(script);
