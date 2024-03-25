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
      },
    }

    new Chart("count_time_by_format", {
      type: 'horizontalBar',
      data: {
        labels: ["count", "unique_stations"],
        datasets: [
          {
            label: 'csv',
            backgroundColor: "#FFA726", 
            data: [133.8, 382.2],
          },
          {
            label: 'parquet',
            backgroundColor: "#AED581",
            data: [0.65, 44.33],
          }
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Time of some operations based on source format'
          }
        },
        scales: count_scales,
      }
    });

    new Chart("count_time_by_partition", {
      type: 'horizontalBar',
      data: {
        labels: ["count", "unique_stations"],
        datasets: [
          {
            label: 'Default partition',
            backgroundColor: "#FFA726", 
            data: [0.65, 44.33],
          },
          {
            label: 'By station',
            backgroundColor: "#AED581",
            data: [25.26, 40.21],
          }
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Time of some operations based on partition policy'
          }
        },
        scales: count_scales,
      }
    });


    new Chart("partition_station", {
      type: 'bar',
      data: {
        labels: [
          'U8', 'YL', 'YK', 'V9', 'KE', 'KX', 'YJ', 'MW', 'M6', 'UV', 'YH', 'Y7', 'YG', 'UD', 'YF', 'W2', 'VL', 'YE',
          'DM', 'VJ', 'VF', 'W3', 'VR', 'KP', 'MQ', 'U5', 'MV', 'MS', 'VT', 'WF', 'YD', 'Z4', 'YC', 'Y4', 'XZ', 'YB',
          'X2', 'YA', 'ZD', 'Y6', 'CA', 'XQ', 'XO', 'XW', 'VY', 'W1', 'Y5', 'UO', 'Y9', 'VZ', 'VN', 'UE', 'W8', 'WW',
          'XB', 'WO', 'J5', 'XY', 'XX', 'MR', 'UL', 'VX', 'XV', 'UI', 'XU', 'UK', 'WE', 'XM', 'XR', 'XS', 'XN', 'V4',
          'WJ', 'WK', 'VV', 'XP', 'DD', 'WC', 'ZC', 'WM', 'WA', 'WB', 'W6', 'WN', 'VM', 'WL', 'WI', 'WG', 'WR', 'W4',
          'VH', 'WP', 'VU', 'WD', 'U9', 'WX', 'UQ', 'UN', 'UA', 'V3', 'WY', 'VA', 'U7', 'VB', 'VC', 'UF', 'X6', 'W5',
          'W9', 'VD', 'VO', 'X7', 'UM', 'V8', 'UX', 'U1', 'US', 'VE', 'UG', 'U6', 'V1', 'UC', 'UB', 'XL', 'U3', 'XT',
          'VP', 'UY', 'V5', 'UJ', 'UH', 'U4', 'XH', 'D2', 'CV', 'WV', 'WS', 'XK', 'WQ', 'WT', 'X3', 'XI', 'U2', 'DC',
          'VK', 'X1', 'X4', 'X5', 'UW', 'UU', 'UP', 'X9', 'Z6', 'Z8', 'Z9', 'Z2', 'Z5', 'ZB', 'Z1', 'Z7', 'Z3', 'XJ',
          'D1', 'CI', 'CR', 'CQ', 'C9', 'WU', 'WZ', 'XE', 'XG', 'XF', 'XC', 'H1', 'D6', 'X8', 'D4', 'XD', 'DL', 'DQ',
          'XA', 'DK', 'CT', 'D7', 'DO', 'D5', 'R1', 'DI', 'DN', 'CL', 'CD', 'C8', 'D8', 'DF', 'DB', 'DJ', 'CE', 'D3',
          'CG', 'D9', 'CP', 'CW', 'CY', 'CJ', 'CC', 'C7', 'C6', 'CU', 'VS', 'VQ', 'DG', 'DP'
        ],
        datasets: [
          {
            label: '# rows',
            backgroundColor: "#03A9F4", 
            data: [
              8302, 14047, 43971, 78980, 115589, 118233, 119533, 125088, 128309, 195359, 204755, 273114, 295876, 299588,
              334524, 355640, 377320, 407040, 437913, 444312, 447332, 450006, 454911, 457343, 462987, 487176, 492222,
              505583, 536542, 550395, 586163, 589895, 637879, 653367, 686326, 731001, 787169, 823711, 849075, 895686,
              949247, 1004290, 1004537, 1016008, 1019955, 1027506, 1027986, 1028999, 1029211, 1029362, 1029682, 1032421,
              1038452, 1040681, 1047203, 1048588, 1087079, 1094578, 1099234, 1201727, 1214299, 1264653, 1266921, 1274510,
              1281242, 1287059, 1314390, 1316705, 1338188, 1348602, 1374343, 1413843, 1541054, 1545685, 1559402, 1651047,
              1654652, 1660993, 1662653, 1663632, 1665905, 1666025, 1666732, 1668356, 1669600, 1670027, 1671830, 1671963,
              1674015, 1674381, 1674601, 1674777, 1675598, 1678127, 1678331, 1679158, 1679403, 1679456, 1680665, 1680897,
              1681273, 1681890, 1683243, 1687849, 1691179, 1691337, 1691354, 1691866, 1692330, 1692455, 1692720, 1692959,
              1696619, 1696626, 1698052, 1698514, 1701241, 1702876, 1705894, 1714486, 1798935, 1799445, 1799633, 1809832,
              1820546, 1859426, 1865536, 1878670, 1878970, 1902593, 1907416, 1929974, 1990661, 2001741, 2034221, 2045436,
              2060231, 2060421, 2063041, 2063305, 2066215, 2072389, 2073736, 2078882, 2083687, 2084710, 2094423, 2194022,
              2196493, 2197028, 2200255, 2204796, 2261006, 2265438, 2265966, 2272313, 2274539, 2275871, 2279777, 2286359,
              2287839, 2371506, 2396727, 2632815, 2633255, 2700333, 2735978, 2752211, 2752983, 2785819, 2789858, 2805382,
              2806840, 2807361, 2807618, 2807982, 2808071, 2808273, 2808598, 2809160, 2809512, 2809721, 2809769, 2809836,
              2809860, 2810019, 2810397, 2810937, 2810971, 2811045, 2811265, 2811385, 2811391, 2811477, 2811494, 2811613,
              2811634, 2811696, 2811836, 2811996, 2812046, 2812050, 2812120, 2812962, 2813041, 2813335, 2813885, 2871561,
              2884218, 2933747, 2982555, 2987600
            ],
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Number of rows grouped by station'
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Number of rows'
            }
          },
        }
      }
    });

    // End of the plot code

  })();
};
document.head.appendChild(script);
