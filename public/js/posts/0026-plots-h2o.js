// Importing Chart.js via CDN instead of module specifier
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
script.type = "text/javascript";
script.onload = function () {
  (async function () {
    // Start of the actual plot code
    const xaxes = {
      x: {
        title: {
          display: true,
          text: 'AUC'
        }
      }
    }

    const tooltips = {
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var index = tooltipItem.index;
            var datasetIndex = tooltipItem.datasetIndex;
            
            var dataset = data.datasets[datasetIndex];
            var item = dataset.data[index];

            return item.name + " (AUC: " + item.x + ", time: " + item.y + "s)";
          }
        }
      }
    }

    var data_auc_predict_time = {
      datasets: [
        {
          label: 'sklearn',
          backgroundColor: "#FF9800", 
          data: [
            {'x': 0.642, 'y': 1.5882, 'name': 'SVC_sklearn'},
            {'x': 0.7015, 'y': 0.0974, 'name': 'RFC_sklearn'},
            {'x': 0.7081, 'y': 0.203, 'name': 'RFC_GS_sklearn'}
          ],
        },
        {
          label: 'AutoML_2min',
          backgroundColor: "#2196F3", 
          data: [
            {'x': 0.6867, 'y': 0.668, 'name': 'StackedEnsemble_AllModels_AutoML'},
            {'x': 0.6797, 'y': 0.4454, 'name': 'StackedEnsemble_BestOfFamily_AutoML'},
            {'x': 0.703, 'y': 0.0952, 'name': 'GBM_5_AutoML'},
            {'x': 0.7066, 'y': 0.084, 'name': 'GBM_1_AutoML'},
            {'x': 0.6981, 'y': 0.1359, 'name': 'GBM_grid__1_AutoML_model_2'},
            {'x': 0.7072, 'y': 0.0852, 'name': 'GBM_2_AutoML'},
            {'x': 0.7004, 'y': 0.0868, 'name': 'GBM_3_AutoML'},
            {'x': 0.7138, 'y': 0.089, 'name': 'GBM_4_AutoML'},
            {'x': 0.6349, 'y': 0.1039, 'name': 'DRF_1_AutoML'},
            {'x': 0.6328, 'y': 0.1095, 'name': 'XRT_1_AutoML'},
            {'x': 0.665, 'y': 0.0504, 'name': 'GBM_grid__1_AutoML_model_3'},
            {'x': 0.6512, 'y': 0.0547, 'name': 'DeepLearning_1_AutoML'},
            {'x': 0.6134, 'y': 0.0458, 'name': 'GLM_1_AutoML'}
          ],
        },
        {
          label: 'AutoML_120min',
          backgroundColor: "#AED581", 
          data: [
            {'x': 0.7153, 'y': 0.2199, 'name': 'XGBoost_grid__1_AutoML_model_5'},
            {'x': 0.7139, 'y': 0.2218, 'name': 'XGBoost_grid__1_AutoML_model_1'},
            {'x': 0.712, 'y': 0.2189, 'name': 'XGBoost_1_AutoML'},
            {'x': 0.7119, 'y': 0.2273, 'name': 'XGBoost_2_AutoML'},
            {'x': 0.7101, 'y': 0.2188, 'name': 'XGBoost_grid__1_AutoML_model_2'},
            {'x': 0.708, 'y': 0.2184, 'name': 'GBM_4_AutoML'},
            {'x': 0.7075, 'y': 0.218, 'name': 'XGBoost_grid__1_AutoML_model_6'},
            {'x': 0.7048, 'y': 0.2264, 'name': 'XGBoost_grid__1_AutoML_model_7'},
            {'x': 0.7046, 'y': 0.2191, 'name': 'GBM_5_AutoML'},
            {'x': 0.7031, 'y': 0.2182, 'name': 'XGBoost_grid__1_AutoML_model_3'},
            {'x': 0.7022, 'y': 0.2192, 'name': 'GBM_3_AutoML'},
            {'x': 0.7011, 'y': 2.1576, 'name': 'StackedEnsemble_AllModels_AutoML'},
            {'x': 0.7011, 'y': 0.2189, 'name': 'GBM_2_AutoML'},
            {'x': 0.7002, 'y': 0.2271, 'name': 'XGBoost_grid__1_AutoML_model_8'},
            {'x': 0.7002, 'y': 0.2187, 'name': 'GBM_1_AutoML'},
            {'x': 0.6966, 'y': 0.218, 'name': 'GBM_grid__1_AutoML_model_6'},
            {'x': 0.6948, 'y': 0.2293, 'name': 'GBM_grid__1_AutoML_model_4'},
            {'x': 0.6942, 'y': 0.2183, 'name': 'GBM_grid__1_AutoML_model_9'},
            {'x': 0.6937, 'y': 0.2183, 'name': 'GBM_grid__1_AutoML_model_5'},
            {'x': 0.6911, 'y': 0.2198, 'name': 'XGBoost_3_AutoML'},
            {'x': 0.6883, 'y': 0.2189, 'name': 'GBM_grid__1_AutoML_model_7'},
            {'x': 0.6879, 'y': 0.2178, 'name': 'GBM_grid__1_AutoML_model_11'},
            {'x': 0.6839, 'y': 0.2191, 'name': 'DeepLearning_grid__1_AutoML_model_1'},
            {'x': 0.6838, 'y': 0.2196, 'name': 'GBM_grid__1_AutoML_model_10'},
            {'x': 0.6822, 'y': 0.2183, 'name': 'GBM_grid__1_AutoML_model_2'},
            {'x': 0.6789, 'y': 0.2184, 'name': 'DeepLearning_grid__3_AutoML_model_3'},
            {'x': 0.6773, 'y': 0.218, 'name': 'XGBoost_grid__1_AutoML_model_4'},
            {'x': 0.6733, 'y': 0.2193, 'name': 'DeepLearning_grid__1_AutoML_model_2'},
            {'x': 0.6712, 'y': 0.2191, 'name': 'DeepLearning_grid__2_AutoML_model_8'},
            {'x': 0.6711, 'y': 0.2193, 'name': 'StackedEnsemble_BestOfFamily_AutoML'},
            {'x': 0.6709, 'y': 0.2186, 'name': 'GBM_grid__1_AutoML_model_8'},
            {'x': 0.6683, 'y': 0.2194, 'name': 'DeepLearning_grid__1_AutoML_model_6'},
            {'x': 0.6652, 'y': 0.2183, 'name': 'DeepLearning_grid__2_AutoML_model_1'},
            {'x': 0.6649, 'y': 0.222, 'name': 'DeepLearning_grid__3_AutoML_model_4'},
            {'x': 0.6645, 'y': 0.2197, 'name': 'DeepLearning_grid__1_AutoML_model_8'},
            {'x': 0.6641, 'y': 0.219, 'name': 'DeepLearning_grid__3_AutoML_model_2'},
            {'x': 0.6638, 'y': 0.2211, 'name': 'DeepLearning_grid__1_AutoML_model_9'},
            {'x': 0.6633, 'y': 0.2202, 'name': 'DRF_1_AutoML'},
            {'x': 0.6628, 'y': 0.2197, 'name': 'DeepLearning_grid__2_AutoML_model_3'},
            {'x': 0.6607, 'y': 0.2197, 'name': 'DeepLearning_grid__2_AutoML_model_4'},
            {'x': 0.6588, 'y': 0.2185, 'name': 'DeepLearning_grid__1_AutoML_model_5'},
            {'x': 0.6585, 'y': 0.0217, 'name': 'DeepLearning_grid__2_AutoML_model_9'},
            {'x': 0.654, 'y': 0.2331, 'name': 'GBM_grid__1_AutoML_model_3'},
            {'x': 0.6534, 'y': 0.4215, 'name': 'DeepLearning_grid__3_AutoML_model_5'},
            {'x': 0.6478, 'y': 0.2225, 'name': 'DeepLearning_1_AutoML'},
            {'x': 0.6468, 'y': 0.2192, 'name': 'DeepLearning_grid__1_AutoML_model_4'},
            {'x': 0.6402, 'y': 0.2185, 'name': 'DeepLearning_grid__2_AutoML_model_6'},
            {'x': 0.6382, 'y': 0.218, 'name': 'DeepLearning_grid__1_AutoML_model_3'},
            {'x': 0.6332, 'y': 0.2176, 'name': 'XRT_1_AutoML'},
            {'x': 0.6319, 'y': 0.2183, 'name': 'DeepLearning_grid__2_AutoML_model_5'},
            {'x': 0.6313, 'y': 0.2185, 'name': 'DeepLearning_grid__3_AutoML_model_1'},
            {'x': 0.631, 'y': 0.2315, 'name': 'DeepLearning_grid__2_AutoML_model_2'},
            {'x': 0.6258, 'y': 0.2249, 'name': 'DeepLearning_grid__2_AutoML_model_7'},
            {'x': 0.6245, 'y': 0.2192, 'name': 'DeepLearning_grid__1_AutoML_model_7'},
            {'x': 0.6134, 'y': 0.0135, 'name': 'GLM_1_AutoML'},
            {'x': 0.6018, 'y': 0.2188, 'name': 'GBM_grid__1_AutoML_model_1'}
          ],
        },
      ]
    }

    new Chart("auc_predict_time", {
      type: 'scatter',
      data: data_auc_predict_time,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'AUC vs predict time [s]'
          }
        },
        scales: {
          ...xaxes,
          y: {
            title: {
              display: true,
              text: 'Predict time [seconds]'
            }
          }
        },
        ...tooltips
      }
    });

    var data_auc_train_time = {
      datasets: [
        {
          label: 'sklearn',
          backgroundColor: "#FF9800", 
          data: [
            {'x': 0.642, 'y': 5.1965, 'name': 'SVC_sklearn'},
            {'x': 0.7015, 'y': 3.6673, 'name': 'RFC_sklearn'},
            {'x': 0.7081, 'y': 60.3997, 'name': 'RFC_GS_sklearn'}
          ],
        },
        {
          label: 'AutoML_2min',
          backgroundColor: "#2196F3", 
          data: [
            {'x': 0.6867, 'y': 1.393, 'name': 'StackedEnsemble_AllModels_AutoML'},
            {'x': 0.6797, 'y': 0.743, 'name': 'StackedEnsemble_BestOfFamily_AutoML'},
            {'x': 0.703, 'y': 1.092, 'name': 'GBM_5_AutoML'},
            {'x': 0.7066, 'y': 0.804, 'name': 'GBM_1_AutoML'},
            {'x': 0.6981, 'y': 2.936, 'name': 'GBM_grid__1_AutoML_model_2'},
            {'x': 0.7072, 'y': 0.813, 'name': 'GBM_2_AutoML'},
            {'x': 0.7004, 'y': 0.895, 'name': 'GBM_3_AutoML'},
            {'x': 0.7138, 'y': 1.165, 'name': 'GBM_4_AutoML'},
            {'x': 0.6349, 'y': 1.815, 'name': 'DRF_1_AutoML'},
            {'x': 0.6328, 'y': 2.541, 'name': 'XRT_1_AutoML'},
            {'x': 0.665, 'y': 0.166, 'name': 'GBM_grid__1_AutoML_model_3'},
            {'x': 0.6512, 'y': 0.893, 'name': 'DeepLearning_1_AutoML'},
            {'x': 0.6134, 'y': 0.235, 'name': 'GLM_1_AutoML'}
          ],
        },
        {
          label: 'AutoML_120min',
          backgroundColor: "#AED581", 
          data: [
            {'x': 0.7153, 'y': 4.779, 'name': 'XGBoost_grid__1_AutoML_model_5'},
            {'x': 0.7139, 'y': 8.805, 'name': 'XGBoost_grid__1_AutoML_model_1'},
            {'x': 0.712, 'y': 3.72, 'name': 'XGBoost_1_AutoML'},
            {'x': 0.7119, 'y': 3.96, 'name': 'XGBoost_2_AutoML'},
            {'x': 0.7101, 'y': 4.295, 'name': 'XGBoost_grid__1_AutoML_model_2'},
            {'x': 0.708, 'y': 1.017, 'name': 'GBM_4_AutoML'},
            {'x': 0.7075, 'y': 6.963, 'name': 'XGBoost_grid__1_AutoML_model_6'},
            {'x': 0.7048, 'y': 2.96, 'name': 'XGBoost_grid__1_AutoML_model_7'},
            {'x': 0.7046, 'y': 0.965, 'name': 'GBM_5_AutoML'},
            {'x': 0.7031, 'y': 6.051, 'name': 'XGBoost_grid__1_AutoML_model_3'},
            {'x': 0.7022, 'y': 0.797, 'name': 'GBM_3_AutoML'},
            {'x': 0.7011, 'y': 4.287, 'name': 'StackedEnsemble_AllModels_AutoML'},
            {'x': 0.7011, 'y': 0.759, 'name': 'GBM_2_AutoML'},
            {'x': 0.7002, 'y': 5.605, 'name': 'XGBoost_grid__1_AutoML_model_8'},
            {'x': 0.7002, 'y': 0.699, 'name': 'GBM_1_AutoML'},
            {'x': 0.6966, 'y': 15.856, 'name': 'GBM_grid__1_AutoML_model_6'},
            {'x': 0.6948, 'y': 0.669, 'name': 'GBM_grid__1_AutoML_model_4'},
            {'x': 0.6942, 'y': 0.865, 'name': 'GBM_grid__1_AutoML_model_9'},
            {'x': 0.6937, 'y': 0.666, 'name': 'GBM_grid__1_AutoML_model_5'},
            {'x': 0.6911, 'y': 2.562, 'name': 'XGBoost_3_AutoML'},
            {'x': 0.6883, 'y': 0.754, 'name': 'GBM_grid__1_AutoML_model_7'},
            {'x': 0.6879, 'y': 0.596, 'name': 'GBM_grid__1_AutoML_model_11'},
            {'x': 0.6839, 'y': 32.089, 'name': 'DeepLearning_grid__1_AutoML_model_1'},
            {'x': 0.6838, 'y': 0.939, 'name': 'GBM_grid__1_AutoML_model_10'},
            {'x': 0.6822, 'y': 1.293, 'name': 'GBM_grid__1_AutoML_model_2'},
            {'x': 0.6789, 'y': 63.112, 'name': 'DeepLearning_grid__3_AutoML_model_3'},
            {'x': 0.6773, 'y': 10.173, 'name': 'XGBoost_grid__1_AutoML_model_4'},
            {'x': 0.6733, 'y': 50.833, 'name': 'DeepLearning_grid__1_AutoML_model_2'},
            {'x': 0.6712, 'y': 49.496, 'name': 'DeepLearning_grid__2_AutoML_model_8'},
            {'x': 0.6711, 'y': 0.509, 'name': 'StackedEnsemble_BestOfFamily_AutoML'},
            {'x': 0.6709, 'y': 0.244, 'name': 'GBM_grid__1_AutoML_model_8'},
            {'x': 0.6683, 'y': 37.454, 'name': 'DeepLearning_grid__1_AutoML_model_6'},
            {'x': 0.6652, 'y': 37.206, 'name': 'DeepLearning_grid__2_AutoML_model_1'},
            {'x': 0.6649, 'y': 88.002, 'name': 'DeepLearning_grid__3_AutoML_model_4'},
            {'x': 0.6645, 'y': 35.047, 'name': 'DeepLearning_grid__1_AutoML_model_8'},
            {'x': 0.6641, 'y': 41.749, 'name': 'DeepLearning_grid__3_AutoML_model_2'},
            {'x': 0.6638, 'y': 25.755, 'name': 'DeepLearning_grid__1_AutoML_model_9'},
            {'x': 0.6633, 'y': 1.635, 'name': 'DRF_1_AutoML'},
            {'x': 0.6628, 'y': 37.858, 'name': 'DeepLearning_grid__2_AutoML_model_3'},
            {'x': 0.6607, 'y': 42.04, 'name': 'DeepLearning_grid__2_AutoML_model_4'},
            {'x': 0.6588, 'y': 30.614, 'name': 'DeepLearning_grid__1_AutoML_model_5'},
            {'x': 0.6585, 'y': 4.938, 'name': 'DeepLearning_grid__2_AutoML_model_9'},
            {'x': 0.654, 'y': 3.276, 'name': 'GBM_grid__1_AutoML_model_3'},
            {'x': 0.6534, 'y': 97.24, 'name': 'DeepLearning_grid__3_AutoML_model_5'},
            {'x': 0.6478, 'y': 0.502, 'name': 'DeepLearning_1_AutoML'},
            {'x': 0.6468, 'y': 32.494, 'name': 'DeepLearning_grid__1_AutoML_model_4'},
            {'x': 0.6402, 'y': 35.467, 'name': 'DeepLearning_grid__2_AutoML_model_6'},
            {'x': 0.6382, 'y': 35.494, 'name': 'DeepLearning_grid__1_AutoML_model_3'},
            {'x': 0.6332, 'y': 1.838, 'name': 'XRT_1_AutoML'},
            {'x': 0.6319, 'y': 39.215, 'name': 'DeepLearning_grid__2_AutoML_model_5'},
            {'x': 0.6313, 'y': 41.801, 'name': 'DeepLearning_grid__3_AutoML_model_1'},
            {'x': 0.631, 'y': 45.112, 'name': 'DeepLearning_grid__2_AutoML_model_2'},
            {'x': 0.6258, 'y': 32.514, 'name': 'DeepLearning_grid__2_AutoML_model_7'},
            {'x': 0.6245, 'y': 44.494, 'name': 'DeepLearning_grid__1_AutoML_model_7'},
            {'x': 0.6134, 'y': 0.165, 'name': 'GLM_1_AutoML'},
            {'x': 0.6018, 'y': 0.202, 'name': 'GBM_grid__1_AutoML_model_1'}
          ],
        },
      ]
    }

    new Chart("auc_train_time", {
      type: 'scatter',
      data: data_auc_train_time,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'AUC vs training time [s]'
          }
        },
        scales: {
          ...xaxes,
          y: {
            title: {
              display: true,
              text: 'Training time [seconds]'
            }
          }
        },
        ...tooltips
      }
    });

    // End of the plot code

  })();
};
document.head.appendChild(script);
