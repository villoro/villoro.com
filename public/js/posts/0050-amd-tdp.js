// Importing Chart.js via CDN instead of module specifier
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/chart.js";
script.type = "text/javascript";
script.onload = function () {
  (async function () {
    // Start of the actual plot code
    const scales = {
      scales: {
        x: {
          ticks: {display: false},
          title: {display: false},
          grid: {display: false},
        },
      }
    }

    new Chart("stats_without_limits", {
      type: 'line',
      data: {
        labels: [
          '19:44', '19:45', '19:46', '19:47', '19:48', '19:49', '19:50', '19:51', '19:52', '19:53', '19:54', '19:55', '19:56',
          '19:57', '19:58', '19:59', '20:00', '20:01', '20:02', '20:03', '20:04', '20:05', '20:06', '20:07', '20:08', '20:09',
          '20:10', '20:11', '20:12', '20:13', '20:14', '20:15', '20:16', '20:17', '20:18', '20:19', '20:20', '20:21', '20:22',
          '20:23', '20:24', '20:25', '20:26', '20:27', '20:28', '20:29', '20:30', '20:31', '20:32', '20:33', '20:34', '20:35',
          '20:36', '20:37', '20:38', '20:39', '20:40', '20:41', '20:42', '20:43', '20:44', '20:45', '20:46', '20:47', '20:48',
          '20:49', '20:50', '20:51', '20:52', '20:53', '20:54', '20:55', '20:56', '20:57', '20:58', '20:59', '21:00', '21:01',
          '21:02', '21:03', '21:04', '21:05', '21:06', '21:07', '21:08', '21:09', '21:10', '21:11', '21:12', '21:13', '21:14',
          '21:15', '21:16', '21:17', '21:18', '21:19', '21:20', '21:21', '21:22', '21:23', '21:24', '21:25', '21:26', '21:27',
          '21:28', '21:29', '21:30', '21:31', '21:32', '21:33', '21:34', '21:35', '21:36', '21:37', '21:38', '21:39', '21:40',
          '21:41', '21:42', '21:43', '21:44', '21:45', '21:46', '21:47', '21:48', '21:49', '21:50', '21:51', '21:52', '21:53',
          '21:54', '21:55', '21:56', '21:57', '21:58', '21:59', '22:00', '22:01', '22:02', '22:03', '22:04', '22:05', '22:06',
          '22:07', '22:08', '22:09', '22:10', '22:11', '22:12', '22:13', '22:14', '22:15', '22:16', '22:17', '22:18', '22:19',
          '22:20', '22:21', '22:22', '22:23', '22:24', '22:25', '22:26', '22:27', '22:28', '22:29', '22:30', '22:31', '22:32',
          '22:33', '22:34', '22:35', '22:36', '22:37', '22:38', '22:39', '22:40', '22:41', '22:42', '22:43', '22:44', '22:45',
          '22:46', '22:47', '22:48', '22:49'
        ].map(x => '2024/07/19 17:' + x),
        datasets: [
          {
            label: 'Temperature [ºC]',
            borderColor: "#FF5722",
            backgroundColor: "#FF5722",
            data: [
              67.4, 68.6, 67.5, 67.1, 68.4, 68.2, 67.2, 69.8, 70.9, 73.8, 76.6, 78.5, 79.4, 79.8, 81.1, 81.5, 81.6, 83.8, 81.4,
              79.4, 79.4, 78.5, 79.4, 79.1, 78.4, 79.1, 79.9, 81.8, 84, 84.1, 82.8, 82.1, 81.5, 81.2, 81.9, 82, 82.9, 82.8, 83,
              84.5, 84.9, 86.2, 86.8, 87.8, 87.6, 89.5, 92.9, 95.2, 96.6, 97.4, 96.9, 96.2, 96, 96.1, 96.2, 96.9, 97.1, 96.8, 97.1,
              96.8, 96.6, 95.9, 97.1, 97.1, 96.8, 96.6, 96.6, 96, 97.1, 97.6, 97.4, 97.1, 97, 97, 97, 96.9, 97, 97.2, 97.1, 97.1,
              97.4, 97.4, 97.4, 97.4, 97.5, 97.2, 97.4, 97.5, 97.6, 97.6, 97.8, 97.8, 97.9, 98, 98.1, 98.1, 98.2, 98.2, 97, 97.1,
              96.2, 96, 95.9, 96.8, 97.2, 97.4, 97.4, 97.1, 97.1, 96.9, 97, 97.2, 97.1, 96.6, 96.5, 96.4, 96.9, 96.8, 96.5, 96.5,
              96.6, 96.2, 97, 96.9, 96.5, 96.5, 96.6, 96.8, 96.8, 96.9, 96.9, 97.2, 97, 96.8, 97, 96.8, 96.9, 96.4, 97, 97.6, 97.9,
              98, 98.1, 98.2, 98.1, 97.8, 97.8, 96.6, 95.1, 94.4, 92.4, 92, 89, 89.4, 87, 85.9, 85.4, 86.1, 84.9, 85.5, 84.2, 84.2,
              84.8, 84.6, 86.4, 84.6, 85.2, 84.4, 85.2, 84.6, 83.5, 82.6, 82.4, 83.8, 82.4, 79, 77.2, 74.2, 71.6, 69.6, 68.4, 68.2,
              67, 65.8, 64.8, 63.9
            ],
            fill: false,
            pointRadius: 1
          },
          {
            label: 'Watts [W]',
            borderColor: "#639CF8",
            backgroundColor: "#639CF8",
            data: [
              15.4, 19.2, 16.2, 16.3, 20.7, 17.2, 16.1, 19.8, 20.1, 27.3, 32.1, 34.6, 32.8, 38.3, 38.7, 37.9, 38.2, 36.8, 29.3,
              24.8, 25.7, 21.9, 23.3, 24.9, 21.5, 27.2, 26.9, 41.7, 42.4, 33.7, 27.9, 28.9, 28.5, 29.4, 29.5, 28.9, 35.1, 26.5, 28,
              42.6, 40.9, 49.1, 45.9, 47.3, 44.3, 50.7, 61.5, 64, 63.2, 62.7, 55.2, 54, 54, 54, 52.6, 53.5, 55.7, 53.8, 54.1, 53.9,
              54, 46.2, 59.4, 55.5, 53.6, 54, 53.9, 46.1, 58.4, 56.3, 54.6, 53.6, 53.9, 54, 54, 54, 54, 54, 54, 53.9, 54, 54.1, 54,
              53.8, 54.2, 54, 54, 54, 54, 53.9, 54.2, 54.1, 53.1, 53.6, 52.4, 49.9, 53.1, 48.4, 43.4, 47.1, 52.7, 53.7, 52.8, 57,
              56.9, 55.5, 55.3, 52.8, 54.3, 53.6, 53.7, 55.8, 53.5, 54.6, 53.8, 53.4, 54.8, 53.8, 53.9, 53.6, 54.6, 52.4, 55.6,
              54.1, 53, 54.7, 54, 54.1, 53.4, 53.8, 54.3, 54.7, 53.6, 54, 54.2, 52.5, 55.7, 53.7, 47.1, 48.1, 51.2, 50.1, 50.9,
              49.7, 47.8, 43.2, 45.7, 35.9, 26.2, 30.1, 25.6, 28.5, 22.9, 26.1, 22.6, 24.5, 25.9, 25.8, 22.1, 27.5, 24.9, 26.8,
              34.9, 37.4, 39.8, 25.9, 30, 31.9, 27.5, 28.7, 24.8, 26, 28.6, 42.4, 32.6, 19.3, 17, 14.2, 12.6, 11.9, 12.2, 13.9,
              10.5, 9.4, 8.8, 8.7
            ],
            fill: false,
            pointRadius: 1
          },
          {
            label: 'Load [%]',
            borderColor: "#40DE7A",
            backgroundColor: "#40DE7A",
            data: [
              0.6, 0.5, 1.1, 1, 0.8, 0.9, 0.8, 2.4, 1.5, 4.3, 5.9, 8.3, 5.4, 3.8, 6.1, 4.8, 4, 8.3, 1.8, 2.1, 2.8, 2.5, 3.5, 2.8,
              2.9, 3.7, 3.3, 7.7, 9.2, 6.9, 3.4, 3.7, 4.3, 3.3, 3.8, 3.9, 4.7, 4.6, 4.4, 7.1, 6.4, 4.4, 4.4, 5.5, 5.3, 11.5, 24.4,
              26.2, 29.6, 25, 24.3, 25.4, 29.2, 27.7, 28, 24.7, 26.5, 29.8, 26, 30.5, 27.7, 22.3, 25.3, 30.1, 32.1, 32.9, 28, 22.1,
              34.4, 31.9, 31.2, 30.3, 29.5, 30.9, 27.3, 36, 33.5, 33.3, 33.2, 31.5, 32.6, 32.7, 27.3, 24.6, 33.2, 31.1, 33.7, 30.2,
              31.4, 29.9, 29.1, 28.6, 21.5, 23.5, 21.3, 23, 26, 22.5, 16.6, 16.1, 9.5, 4.8, 4.3, 5.7, 10.3, 4.1, 4.1, 3.8, 8.1,
              4.4, 4.6, 5.1, 9.2, 3.9, 5.1, 4.7, 5.1, 7.2, 5.6, 5.7, 4, 4, 3.4, 11.1, 4.4, 3.7, 5.5, 8.8, 3.7, 4.3, 3.7, 4.7, 9,
              4.4, 4.3, 3.5, 12.4, 5.5, 9.6, 20.6, 20.3, 21.1, 21.9, 21.9, 16.5, 14.4, 13.4, 5.5, 6, 5.8, 3.6, 4.6, 2.9, 4.7, 2.2,
              3.9, 5.3, 4.2, 2.7, 6.1, 3.3, 5.5, 7.8, 5.1, 5.9, 4.1, 6.3, 4.7, 6.1, 5.4, 3.4, 3.3, 4.7, 6.7, 2.8, 0.7, 1.7, 0.9,
              0.1, 0.5, 0.2, 0.6, 0.4, 0.1, 0.2, 0.2
            ],
            fill: false,
            pointRadius: 1
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'CPU Temperatures [ºC], Watts [W] and Usage [%] - No limits'
          }
        },
        ...scales
      }
    });

    new Chart("stats_with_limits", {
      type: 'line',
      data: {
        labels: [
          '15:29', '15:30', '15:31', '15:32', '15:33', '15:34', '15:35', '15:36', '15:37', '15:51', '15:53', '15:55', '15:55',
          '15:56', '15:57', '15:58', '15:59', '16:00', '16:01', '16:04', '16:06', '16:06', '16:08', '16:11', '16:12', '16:12',
          '16:13', '16:14', '16:15', '16:16', '16:17', '16:18', '16:19', '16:20', '16:21', '16:22', '16:23', '16:24', '16:25',
          '16:26', '16:27', '16:28', '16:30', '16:31', '16:33', '16:35', '16:35', '16:36', '16:37', '16:38', '16:39', '16:40',
          '16:41', '16:42', '16:43', '16:44', '16:45', '16:46', '16:47', '16:48', '16:49', '16:50', '16:51', '16:52', '16:53',
          '16:54', '16:55', '16:56', '16:57', '17:00', '17:03', '17:04', '17:05', '17:06', '17:07', '17:08', '17:09', '17:10',
          '17:12', '17:13', '17:13', '17:14', '17:15', '17:16', '17:17', '17:18', '17:20', '17:21', '17:22', '17:23', '17:24',
          '17:25', '17:26', '17:27', '17:28', '17:29', '17:30', '17:31', '17:32', '17:34', '17:35', '17:36', '17:38', '17:38',
          '17:39', '17:40', '17:41', '17:42', '17:43', '17:44', '17:45', '17:46', '17:47', '17:48', '17:49', '17:51', '17:52',
          '17:53', '17:54', '17:55', '17:56', '17:57', '17:58', '17:59', '18:01', '18:02', '18:02', '18:03', '18:04', '18:05',
          '18:06', '18:07', '18:08', '18:09', '18:10', '18:11', '18:12', '18:13', '18:14', '18:15', '18:16', '18:17', '18:18',
          '18:19', '18:20', '18:21', '18:23', '18:29', '18:30', '18:32', '18:32', '18:33', '18:34', '18:35', '18:36', '18:37',
          '18:39', '18:40', '18:41', '18:42', '18:43', '18:44', '18:47', '18:47', '18:48', '18:49', '18:50', '18:51', '18:52',
          '18:53', '18:54', '18:55', '18:56', '18:58', '18:58', '18:59', '19:00', '19:01', '19:02', '19:03', '19:04', '19:05',
          '19:06', '19:07', '19:08', '19:09', '19:10', '19:11', '19:12', '19:13', '19:14', '19:15', '19:16', '19:17', '19:18',
          '19:19', '19:20', '19:21', '19:22', '19:23', '19:24', '19:25', '19:26', '19:27', '19:28', '19:29', '19:30', '19:31',
          '19:32', '19:33', '19:34', '19:35', '19:36', '19:37', '19:38', '19:39', '19:40', '19:41', '19:42', '19:43', '19:44',
          '19:45', '19:46', '19:47', '19:48', '19:49', '19:50', '19:51', '19:52', '19:53', '19:54', '19:55', '19:56', '19:57',
          '19:58', '19:59', '20:00', '20:01', '20:02', '20:03', '20:04', '20:05', '20:06', '20:07', '20:08', '20:09', '20:10',
          '20:11', '20:12', '20:13', '20:14', '20:15', '20:16', '20:17', '20:18', '20:19', '20:20', '20:21', '20:22', '20:23',
          '20:24', '20:25', '20:26', '20:27', '20:28', '20:29', '20:30', '20:31', '20:32', '20:33', '20:34', '20:38', '20:39',
          '20:40', '20:41', '20:42', '20:43', '20:44', '20:45', '20:46', '20:47', '20:48', '20:49', '20:50', '20:51', '20:52',
          '20:53', '20:54', '20:55', '20:56', '20:57', '20:58', '20:59', '21:00', '21:01', '21:02', '21:03', '21:04', '21:05',
          '21:06', '21:07', '21:08', '21:09', '21:10', '21:11', '21:12', '21:13', '21:14', '21:15', '21:16', '21:17', '21:18',
          '21:19', '21:20', '21:21', '21:22', '21:23', '21:24', '21:25', '21:26', '21:27', '21:28', '21:29'
        ],
        datasets: [
          {
            label: 'Temperature [ºC]',
            borderColor: "#FF5722",
            backgroundColor: "#FF5722",
            data: [
              49.9, 50, 50, 49.9, 56.1, 62, 65.1, 64.9, 64.4, 65.1, 72, 72.2, 72.5, 72.8, 73, 73.4, 73.5, 73.8, 74.6, 76.2, 76.5,
              77.1, 76.4, 76, 76, 76.2, 76.2, 76.4, 76.4, 76.5, 77, 77, 76.9, 76.9, 77, 77.2, 77.6, 77.6, 77.8, 77.6, 77.6, 77.6,
              77.6, 77.6, 77.6, 77.9, 78, 78, 78.1, 78.2, 78.5, 78.4, 78.5, 78.5, 78.6, 78.9, 79, 79, 79, 79, 78.9, 79, 79.1, 79.1,
              79.1, 79.1, 79.5, 79.4, 80.1, 81, 80.2, 79.8, 79.9, 80, 79.9, 80, 80, 80.4, 81.1, 81.4, 81.4, 80.9, 80.6, 80.6, 80.4,
              80.4, 80.2, 80.2, 80.5, 80.5, 80.5, 80.5, 80.5, 80.5, 80.4, 80.4, 80.8, 80.8, 80.6, 80.8, 80.8, 80.9, 80.9, 80.9, 81,
              81.2, 81.1, 81, 81, 81, 81.4, 81.8, 81.8, 81.5, 82, 82.4, 81.9, 81.6, 81.4, 81.2, 81.4, 81.5, 81.4, 81.8, 82.5, 82.6,
              82.2, 82.1, 81.8, 81.8, 81.9, 81.9, 81.8, 81.8, 81.8, 81.8, 81.8, 81.8, 82, 82.4, 82.1, 82.2, 82.8, 83, 83, 83.5,
              83.5, 83.5, 82.8, 82.4, 82.2, 82.2, 82.2, 82.2, 82.6, 82.9, 83.2, 83.9, 83, 82.8, 82.6, 83.1, 83.8, 84, 83.8, 83.2,
              83, 82.8, 82.8, 82.9, 82.6, 82.6, 82.9, 83.4, 83.4, 83, 83, 83.2, 83, 83.2, 83.2, 82.9, 82.8, 82.8, 83.1, 83, 82.9,
              82.9, 82.9, 83.1, 83, 83, 83, 83, 83, 83.1, 83, 82.9, 82.8, 83, 83.1, 83.2, 83.1, 83, 83.2, 83.4, 83.2, 83.2, 83.4,
              83.4, 83.4, 83.2, 83.5, 83.2, 83.2, 83.1, 83.2, 83, 83.1, 83.4, 83.5, 83.4, 83.2, 83.2, 83.5, 83.4, 83.4, 83.5, 83.6,
              83.4, 83.2, 83.2, 83.2, 83.5, 83.6, 83.5, 83.4, 83.4, 83.4, 83.5, 83.8, 83.6, 83.8, 83.6, 83.8, 83.5, 83.5, 83.6,
              83.6, 83.6, 83.6, 83.6, 83.6, 83.5, 83.9, 83.9, 84, 83.8, 83.6, 83.6, 83.6, 83.6, 83.8, 83.8, 83.9, 83.9, 83.8, 83.6,
              83.6, 83.9, 83.9, 84, 84.2, 84.1, 84, 84, 84.4, 84.1, 85.1, 90.4, 92.5, 91.9, 87.2, 83.2, 80.4, 78.4, 76.4, 74.5,
              72.9, 71.8, 70.5, 69.4, 68.5, 67.6, 67, 66.1, 65.4, 64.8, 64.1, 63.8, 63.4, 62.9, 62.2, 61.8, 61.6, 61.1, 60.9, 60.5,
              60.5, 60.5, 60, 59.8, 59.4, 63.5, 63.8, 61.9, 60.5, 59.9, 59.2, 59, 58.8, 58.4, 58.1
            ],
            fill: false,
            pointRadius: 1
          },
          {
            label: 'Watts [W]',
            borderColor: "#639CF8",
            backgroundColor: "#639CF8",
            data: [
              6.4, 7.7, 8.5, 6.6, 19.8, 43.2, 45.3, 44.7, 45, 45, 41.4, 39.5, 39.9, 40.1, 40, 39.9, 40.1, 39.8, 40, 40.1, 39.9,
              40.2, 39.8, 40.4, 39.2, 40.2, 40, 40, 40, 40, 40, 40, 39.9, 40, 40, 40, 40, 40, 39.9, 40, 40, 40, 39.9, 40, 40, 40,
              40, 40, 40, 40.1, 39.9, 39.9, 40.1, 40.1, 40, 39.9, 40.1, 40, 40, 40, 39.9, 40.1, 40, 40, 40, 40, 40.1, 39.8, 40.1,
              40, 39.9, 39.9, 40, 40, 39.8, 40.2, 40, 39.9, 40.1, 39.8, 40.3, 40.1, 39.9, 39.9, 40, 40, 40, 40, 40, 39.9, 40, 40,
              40.1, 40, 40, 40, 40.1, 39.9, 40, 40, 40, 40, 40, 40, 40, 39.8, 40.2, 40, 40, 39.7, 40.3, 40, 39.9, 40, 40, 40, 40.1,
              40, 40, 40.1, 39.9, 40, 40, 39.9, 40, 39.9, 40.2, 40, 39.9, 40, 39.8, 40.1, 40, 40, 40, 39.9, 39.9, 40.1, 40, 39.9,
              39.9, 40.1, 39.9, 40, 40, 40.1, 39.9, 40, 40.1, 40, 40, 40, 40, 40, 40, 39.9, 40, 40.2, 39.9, 40, 40, 39.9, 39.9,
              40.4, 40, 40, 40, 40, 39.9, 40.1, 40, 40, 39.9, 40, 40.2, 39.9, 40, 40, 40, 40, 40, 40, 40.1, 40, 40, 39.9, 40, 40,
              40, 39.9, 39.9, 40, 40, 40, 40, 40, 40, 39.9, 40.1, 40, 40.1, 39.9, 40.1, 40, 40, 39.8, 40.1, 40, 40, 39.8, 40.2, 40,
              40, 40, 40, 40, 40.4, 39.5, 40, 40, 40, 39.9, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 39.9, 40.2, 40, 40, 39.9,
              40.1, 40, 40, 39.7, 40.3, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 39.8, 40.1, 40.1, 40, 40, 39.9, 39.9, 40.1, 39.9,
              40.1, 40, 40, 39.8, 40.3, 40, 39.9, 39.9, 40.1, 40, 40.1, 40, 40, 40, 39.9, 40, 39, 35.3, 34.1, 22.5, 16.5, 12.1,
              11.8, 13.6, 9.2, 7.4, 7.8, 7, 5.2, 5.1, 5.3, 5.5, 6, 4.7, 5, 5, 5.2, 5.6, 7.1, 5.2, 4.9, 5, 6, 4.9, 6.7, 5, 9.5, 7.9,
              5.3, 5.1, 5.8, 14.5, 9.4, 5, 4.9, 7.8, 5.8, 7.4, 7.8, 5.9, 7.7
            ],
            fill: false,
            pointRadius: 1
          },
          {
            label: 'Load [%]',
            borderColor: "#40DE7A",
            backgroundColor: "#40DE7A",
            data: [
              0.1, 0.3, 0.1, 0.1, 3.1, 84.3, 99.3, 100, 100, 100, 98.9, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              100, 100, 49.8, 16.8, 11, 6.2, 4.9, 2.2, 2.9, 3.8, 1.5, 0.9, 0.8, 0.2, 0.2, 0.1, 0.1, 0.2, 0, 0, 0.2, 0.1, 0, 0.1,
              0.7, 0.1, 0, 0.1, 0.2, 0, 0.6, 0, 1.3, 0.9, 0.3, 0, 0.3, 1.8, 0.7, 0, 0.1, 0.8, 0.4, 0.8, 1, 0.5, 1
            ],
            fill: false,
            pointRadius: 1
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'CPU Temperatures [ºC], Watts [W] and Usage [%] - With limits'
          }
        },
        ...scales
      }
    });

    // End of the plot code

  })();
};
document.head.appendChild(script);
