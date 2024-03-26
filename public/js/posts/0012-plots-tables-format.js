// Importing Chart.js via CDN instead of module specifier
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
script.type = 'text/javascript';
script.onload = function () {
  // Your Chart.js code here
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
    const scales_MB = {
      legend: {
        display: false
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'File size [MB]'
          }
        }
      }
    }
    const labels_basic = ['csv', 'feather', 'msgpack', 'parquet', 'pickle', 'xlsx']

    new Chart("chart_s0_i100_time", {
      type: 'bar',
      data: {
        labels: labels_basic,
        datasets: [
          {
            label: 'read',
            backgroundColor: "#AED581", 
            data: [0.005766, 0.002291, 0.001909, 0.004744, 0.002504, 0.121258],
          },
          {
            label: 'write',
            backgroundColor: "#FFA726",
            data: [0.027968, 0.006942, 0.005825, 0.008368, 0.007167, 0.221087],
          }
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Read/write average time [s] with small dataframe (56 KB)'
          }
        },
        ...scale_seconds
      }
    });

    new Chart("chart_s1_i10_time", {
      type: 'bar',
      data: {
        labels: labels_basic,
        datasets: [
          {
            label: 'read',
            backgroundColor: "#AED581", 
            data: [3.355233, 0.672547, 0.644967, 0.974831, 0.581298, 39.258066],
          },
          {
            label: 'write',
            backgroundColor: "#FFA726",
            data: [6.443962, 1.004818, 1.486842, 1.969526, 1.476743, 95.992012],
          }
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Read/write average time [s] with medium dataframe (233 MB)'
          }
        },
        ...scale_seconds
      }
    });
    new Chart("chart_s1_i10_size", {
      type: 'bar',
      data: {
        labels: labels_basic,
        datasets: [
          {
            label: 'file size',
            backgroundColor: "#64B5F6", 
            data: [236.1, 213.38, 210.09, 96.37, 207.54, 68.21],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'File size with medium dataframe (233 MB)'
          }
        },
        ...scales_MB 
      }
    });

    const labels_extended = [
      'csv_None', 'csv_bz2', 'csv_gzip', 'csv_infer', 'csv_xz', 'csv_zip',
      'feather', 'msgpack_None', 'msgpack_blosc', 'msgpack_zlib',
      'parquet_None', 'parquet_brotli', 'parquet_gzip', 'parquet_snappy',
      'pickle_None', 'pickle_bz2', 'pickle_gzip', 'pickle_infer', 'pickle_xz',
      'pickle_zip'
    ]

    new Chart("chart_s1_i5_time", {
      type: 'bar',
      data: {
        labels: labels_extended,
        datasets: [
          {
            label: 'read',
            backgroundColor: "#AED581", 
            data: [
              3.052051, 10.516266, 4.25702, 3.094328, 9.920079, 4.052968, 0.60659, 0.493087, 0.476919, 0.51484,
              0.766749, 0.98578, 0.996152,0.809635, 0.465547, 7.775791, 1.48881, 0.476745, 6.258862, 2.065088
            ],
          },
          {
            label: 'write',
            backgroundColor: "#FFA726",
            data: [
              5.898017, 24.439828, 49.018689, 6.003964, 288.619755, 21.263131, 0.99833, 1.324669, 1.367148, 2.049314,
              1.411415, 27.043478, 18.282706, 1.868614, 1.339422, 18.5083, 40.682403, 1.368525, 254.315614, 17.856649
            ],
          }
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Read/write average time [s] with medium dataframe (233 MB)'
          }
        },
        ...scale_seconds
      }
    });
    new Chart("chart_s1_i5_size", {
      type: 'bar',
      data: {
        labels: labels_extended,
        datasets: [
          {
            label: 'file size',
            backgroundColor: "#64B5F6", 
            data: [
              236.1, 47.58, 65.8, 236.1, 43.99, 66.44, 213.38, 210.09, 202.88, 202.9, 209.58,
              50.82, 56.75, 96.37, 207.54, 40.93, 54.85, 207.54, 38.05, 55.43
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'File size with medium dataframe (233 MB)'
          }
        },
        legend: {
          display: false
        },
        ...scales_MB
      }
    });

    const xaxes_mb = {
      x: {
        title: {display: true, text: 'File size [MB]'}
      }
    }
    const xaxes_gb = {
      x: {
        scaleLabel: {display: true, text: 'File size [GB]'}
      }
    }
    const tooltip_s_mb = {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var index = tooltipItem.index;
            var datasetIndex = tooltipItem.datasetIndex;
            
            var dataset = data.datasets[datasetIndex];
            var item = dataset.data[index];

            return item.name + " (Time: " + item.x + " s, File size: " + item.y + " MB)";
          }
        }
      },
    }
    const tooltip_min_gb = {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var index = tooltipItem.index;
            var datasetIndex = tooltipItem.datasetIndex;
            
            var dataset = data.datasets[datasetIndex];
            var item = dataset.data[index];

            return item.name + " (Time: " + item.x + " min, File size: " + item.y + " GB)";
          }
        }
      },
    }
    new Chart("chart_s1_i5_scatter_read", {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'csv',
            backgroundColor: "#4FC3F7", 
            data: [
              {'x': 3.052051, 'y': 236.1, 'name': 'None'},
              {'x': 10.516266, 'y': 47.58, 'name': 'bz2'},
              {'x': 4.25702, 'y': 65.8, 'name': 'gzip'},
              {'x': 3.094328, 'y': 236.1, 'name': 'infer'},
              {'x': 9.920079, 'y': 43.99, 'name': 'xz'},
              {'x': 4.052968, 'y': 66.44, 'name': 'zip'},
            ],
          },
          {
            label: 'feather',
            backgroundColor: "#EF5350", 
            data: [
              {'x': 0.60659, 'y': 213.38, 'name': 'feather'},
            ],
          },
          {
            label: 'msgpack',
            backgroundColor: "#AED581", 
            data: [
              {'x': 0.493087, 'y': 210.09, 'name': 'None'},
              {'x': 0.476919, 'y': 202.88, 'name': 'blosc'},
              {'x': 0.51484, 'y': 202.9, 'name': 'zlib'},
            ],
          },
          {
            label: 'parquet',
            backgroundColor: "#9575CD", 
            data: [
              {'x': 0.766749, 'y': 209.58, 'name': 'None'},
              {'x': 0.98578, 'y': 50.82, 'name': 'brotli'},
              {'x': 0.996152, 'y': 56.75, 'name': 'gzip'},
              {'x': 0.809635, 'y': 96.37, 'name': 'snappy'},
            ],
          },
          {
            label: 'pickle',
            backgroundColor: "#FFB74D", 
            data: [
              {'x': 0.465547, 'y': 207.54, 'name': 'None'},
              {'x': 7.775791, 'y': 40.93, 'name': 'bz2'},
              {'x': 1.48881, 'y': 54.85, 'name': 'gzip'},
              {'x': 0.476745, 'y': 207.54, 'name': 'infer'},
              {'x': 6.258862, 'y': 38.05, 'name': 'xz'},
              {'x': 2.065088, 'y': 55.43, 'name': 'zip'}
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Average reading time vs file size'
          }
        },
        scales: {
          ...xaxes_mb,
          y: {
            title: {
              display: true,
              text: 'Read average time [s]'
            }
          }
        },
        ...tooltip_s_mb
      }
    });
    new Chart("chart_s1_i5_scatter_write", {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'csv',
            backgroundColor: "#4FC3F7", 
            data: [
              {'x': 5.898017, 'y': 236.1, 'name': 'None'},
              {'x': 24.439828, 'y': 47.58, 'name': 'bz2'},
              {'x': 49.018689, 'y': 65.8, 'name': 'gzip'},
              {'x': 6.003964, 'y': 236.1, 'name': 'infer'},
              {'x': 288.619755, 'y': 43.99, 'name': 'xz'},
              {'x': 21.263131, 'y': 66.44, 'name': 'zip'},
            ],
          },
          {
            label: 'feather',
            backgroundColor: "#EF5350", 
            data: [
              {'x': 0.99833, 'y': 213.38, 'name': 'feather'},
            ],
          },
          {
            label: 'msgpack',
            backgroundColor: "#AED581", 
            data: [
              {'x': 1.324669, 'y': 210.09, 'name': 'None'},
              {'x': 1.367148, 'y': 202.88, 'name': 'blosc'},
              {'x': 2.049314, 'y': 202.9, 'name': 'zlib'},
            ],
          },
          {
            label: 'parquet',
            backgroundColor: "#9575CD", 
            data: [
              {'x': 1.411415, 'y': 209.58, 'name': 'None'},
              {'x': 27.043478, 'y': 50.82, 'name': 'brotli'},
              {'x': 18.282706, 'y': 56.75, 'name': 'gzip'},
              {'x': 1.868614, 'y': 96.37, 'name': 'snappy'},
            ],
          },
          {
            label: 'pickle',
            backgroundColor: "#FFB74D", 
            data: [
              {'x': 1.339422, 'y': 207.54, 'name': 'None'},
              {'x': 18.5083, 'y': 40.93, 'name': 'bz2'},
              {'x': 40.682403, 'y': 54.85, 'name': 'gzip'},
              {'x': 1.368525, 'y': 207.54, 'name': 'infer'},
              {'x': 254.315614, 'y': 38.05, 'name': 'xz'},
              {'x': 17.856649, 'y': 55.43, 'name': 'zip'}
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Average writting time vs file size'
          }
        },
        scales: {
          ...xaxes_mb,
          y: {
            title: {
              display: true,
              text: 'Write average time [s]'
            }
          }
        },
        ...tooltip_s_mb
      }
    });

    new Chart("chart_s2_i1_scatter_read", {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'msgpack',
            backgroundColor: "#AED581", 
            data: [
              {'x': 5.861692, 'y': 7.21, 'name': 'None'},
              {'x': 5.454967, 'y': 6.5, 'name': 'blosc'},
              {'x': 5.486474, 'y': 6.5, 'name': 'zlib'},
            ],
          },
          {
            label: 'parquet',
            backgroundColor: "#9575CD", 
            data: [
              {'x': 1.145516, 'y': 5.96, 'name': 'None'},
              {'x': 0.923015, 'y': 1.56, 'name': 'brotli'},
              {'x': 0.966764, 'y': 2.0, 'name': 'gzip'},
              {'x': 0.885568, 'y': 3.3, 'name': 'snappy'},
            ],
          },
          {
            label: 'pickle',
            backgroundColor: "#FFB74D", 
            data: [
              {'x': 1.377571, 'y': 6.25, 'name': 'None'},
              {'x': 5.153998, 'y': 1.24, 'name': 'bz2'},
              {'x': 1.88185, 'y': 1.81, 'name': 'gzip'},
              {'x': 1.455619, 'y': 6.25, 'name': 'infer'},
              {'x': 3.45604, 'y': 0.97, 'name': 'xz'}
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Average reading time vs file size'
          }
        },
        scales: {
          ...xaxes_gb,
          y: {
            title: {
              display: true,
              text: 'Read average time [min]'
            }
          }
        },
        ...tooltip_min_gb
      }
    });
    new Chart("chart_s2_i1_scatter_write", {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'msgpack',
            backgroundColor: "#AED581", 
            data: [
              {'x': 6.323051, 'y': 7.21, 'name': 'None'},
              {'x': 5.013798, 'y': 6.5, 'name': 'blosc'},
              {'x': 5.549751, 'y': 6.5, 'name': 'zlib'},
            ],
          },
          {
            label: 'parquet',
            backgroundColor: "#9575CD", 
            data: [
              {'x': 2.686822, 'y': 5.96, 'name': 'None'},
              {'x': 11.22296, 'y': 1.56, 'name': 'brotli'},
              {'x': 8.98146, 'y': 2.0, 'name': 'gzip'},
              {'x': 2.781936, 'y': 3.3, 'name': 'snappy'},
            ],
          },
          {
            label: 'pickle',
            backgroundColor: "#FFB74D", 
            data: [
              {'x': 7.46794, 'y': 6.25, 'name': 'None'},
              {'x': 17.46643, 'y': 1.24, 'name': 'bz2'},
              {'x': 20.762572, 'y': 1.81, 'name': 'gzip'},
              {'x': 5.799293, 'y': 6.25, 'name': 'infer'},
              {'x': 97.62412, 'y': 0.97, 'name': 'xz'}
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Average writting time vs file size'
          }
        },
        scales: {
          ...xaxes_gb,
          y: {
            title: {
              display: true,
              text: 'Write average time [min]'
            }
          }
        },
        ...tooltip_min_gb
      },
    });

    // End of the plot code
    
  })();
};
document.head.appendChild(script);
