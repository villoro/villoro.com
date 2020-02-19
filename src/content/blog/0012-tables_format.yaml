# --------------------------------------------------------------------------------------------------
# Basic metadata
# --------------------------------------------------------------------------------------------------
code: tables_format
title: Storing tables efficiently
date: "2019-04-03"
image: tables_format_square.jpg
highlight: True

tags:
  - Python
  - Performance
  - Benchmark

tags_filter:
  - Python
  - Performance

# --------------------------------------------------------------------------------------------------
# Extra info. This will add a button with href to the url
# --------------------------------------------------------------------------------------------------
link: 
  text: Github
  url: https://github.com/villoro/villoro_posts/tree/master/0012-tables_format


# --------------------------------------------------------------------------------------------------
# Content
# --------------------------------------------------------------------------------------------------
brief_markdown: |
  When working with **pandas** people usually need to store one or more tables. There are a lot of different formats to do that. In this post I am going to compare the performance between them.

# image_head:
#   filename: 
#   caption: 

use_chartjs: True

content_markdown: |

  When working with **pandas** people usually need to store one or more tables. There are a lot of different formats to do that. In this post I am going to compare the performance between them.

  ## Table of Contents

  [TOC]

  ## How test will be done
  To do the tests I downloaded 3 datasets of different sizes:

  * [Small](https://www.kaggle.com/contactprad/bike-share-daily-data) (56 KB)
  * [Medium](https://www.kaggle.com/safegraph/visit-patterns-by-census-block-group) (233 MB)
  * [Large](https://www.kaggle.com/city-of-seattle/seattle-checkouts-by-title) (6.62 GB)

  I downloaded them from kaggle, one of the best places to find datasets.

  The formats that I will test are:

  * csv
  * feather
  * msgpack
  * parquet
  * pickle
  * xlsx

  ## Test 1: Simple test
  First of all I will check how they perform without changing any parameters. I will do 100 iterations with the small dataset and 10 with the medium one.

  ### Size small and iterations 100 with all extensions

  First of all the average reading/writing times for each format.

  <canvas id="chart_s0_i100_time" style="width:100%;height:300px;"></canvas>

  > It seems that `xlsx` is a slow option

  ### Size medium and iterations 10 with all extensions

  <canvas id="chart_s1_i10_time" style="width:100%;height:300px;"></canvas>

  With the medium dataframe the results are very similar.

  > `xlsx` is a slow solution. I would only recommend it for small dataframes.

  <canvas id="chart_s1_i10_size" style="width:100%;height:300px;"></canvas>

  Regarding the file size both `xlsx` and `parquet` outperform the rest. If you look the pandas documentation you will see that **all extensions except `xlsx` and `feather` allow different types of compression.** Also `parquet` uses a more agresive compression by default. We need to test the formats and the different compressions.

  ## Test 2: Include compressions

  This time each extensions will be tested using all posible compressions. The results are:

  <table class="v-table v-table-right" align="center">
    <tr class="v-table-center">
      <th class="v-table-header">format</th>
      <th class="v-table-header">compression</th>
      <th class="v-table-header">read [s]</th>
      <th class="v-table-header">write [s]</th>
      <th class="v-table-header">size [MB]</th>
    </tr>
    <tr>
      <td rowspan="6" class="v-table-center"><b>csv</b></td>
      <td class="v-table-center">None</td>
      <td>3.05</td>
      <td>5.90</td>
      <td>236.10</td>
    </tr>
    <tr>
      <td class="v-table-center">bz2</td>
      <td>10.52</td>
      <td>24.44</td>
      <td>47.58</td>
    </tr>
    <tr>
      <td class="v-table-center">gzip</td>
      <td>4.26</td>
      <td>49.02</td>
      <td>65.80</td>
    </tr>
    <tr>
      <td class="v-table-center">infer</td>
      <td>3.09</td>
      <td>6.00</td>
      <td>236.10</td>
    </tr>
    <tr>
      <td class="v-table-center">xz</td>
      <td>9.92</td>
      <td>288.62</td>
      <td>43.99</td>
    </tr>
    <tr>
      <td class="v-table-center">zip</td>
      <td>4.05</td>
      <td>21.26</td>
      <td>66.44</td>
    </tr>
    <tr>
      <td class="v-table-center"><b>feather</b></td>
      <td class="v-table-center">feather</td>
      <td>0.61</td>
      <td>1.00</td>
      <td>213.38</td>
    </tr>
    <tr>
      <td rowspan="3"  class="v-table-center"><b>msgpack</b></td>
      <td class="v-table-center">None</td>
      <td>0.49</td>
      <td>1.32</td>
      <td>210.09</td>
    </tr>
    <tr>
      <td class="v-table-center">blosc</td>
      <td>0.48</td>
      <td>1.37</td>
      <td>202.88</td>
    </tr>
    <tr>
      <td class="v-table-center">zlib</td>
      <td>0.51</td>
      <td>2.05</td>
      <td>202.90</td>
    </tr>
    <tr>
      <td rowspan="4" class="v-table-center"><b>parquet</b></td>
      <td class="v-table-center">None</td>
      <td>0.77</td>
      <td>1.41</td>
      <td>209.58</td>
    </tr>
    <tr>
      <td class="v-table-center">brotli</td>
      <td>0.99</td>
      <td>27.04</td>
      <td>50.82</td>
    </tr>
    <tr>
      <td class="v-table-center">gzip</td>
      <td>1.00</td>
      <td>18.28</td>
      <td>56.75</td>
    </tr>
    <tr>
      <td class="v-table-center">snappy</td>
      <td>0.81</td>
      <td>1.87</td>
      <td>96.37</td>
    </tr>
    <tr>
      <td rowspan="6" class="v-table-center"><b>pickle</b></td>
      <td class="v-table-center">None</td>
      <td>0.47</td>
      <td>1.34</td>
      <td>207.54</td>
    </tr>
    <tr>
      <td class="v-table-center">bz2</td>
      <td>7.78</td>
      <td>18.51</td>
      <td>40.93</td>
    </tr>
    <tr>
      <td class="v-table-center">gzip</td>
      <td>1.49</td>
      <td>40.68</td>
      <td>54.85</td>
    </tr>
    <tr>
      <td class="v-table-center">infer</td>
      <td>0.48</td>
      <td>1.37</td>
      <td>207.54</td>
    </tr>
    <tr>
      <td class="v-table-center">xz</td>
      <td>6.26</td>
      <td>254.32</td>
      <td>38.05</td>
    </tr>
    <tr>
      <td class="v-table-center">zip</td>
      <td>2.07</td>
      <td>17.86</td>
      <td>55.43</td>
    </tr>
  </table>

  By plotting both reading and writing time is easier to se that writing times for `xz` compression are really slow.

  <canvas id="chart_s1_i5_time" style="width:100%;height:300px;"></canvas>
  <canvas id="chart_s1_i5_size" style="width:100%;height:300px;"></canvas>

  It is not clear which formats and compressions work best. Let's plot reading/writing time vs file size.

  <canvas id="chart_s1_i5_scatter_read" style="width:100%;height:300px;"></canvas>
  <canvas id="chart_s1_i5_scatter_write" style="width:100%;height:300px;"></canvas>

  > **csv** underperforms compared to the other formats

  ## Test 3: Using the big table

  For this test I will only use the best formats from the previous test. Those are:

  * feather
  * msgpack
  * parquet
  * pickle

  <table class="v-table v-table-right" align="center">
    <tr class="v-table-center">
      <th class="v-table-header">format</th>
      <th class="v-table-header">compression</th>
      <th class="v-table-header">read [min]</th>
      <th class="v-table-header">write [min]</th>
      <th class="v-table-header">size [GB]</th>
    </tr>
    <tr>
      <td class="v-table-center"><b>feather</b></td>
      <td class="v-table-center">feather</td>
      <td>-</td>
      <td>-</td>
      <td>4.24</td>
    </tr>
    <tr>
      <td rowspan="3"  class="v-table-center"><b>msgpack</b></td>
      <td class="v-table-center">None</td>
      <td>5.86</td>
      <td>6.32</td>
      <td>7.21</td>
    </tr>
    <tr>
      <td class="v-table-center">blosc</td>
      <td>5.45</td>
      <td>5.01</td>
      <td>6.50</td>
    </tr>
    <tr>
      <td class="v-table-center">zlib</td>
      <td>5.49</td>
      <td>5.55</td>
      <td>6.50</td>
    </tr>
    <tr>
      <td rowspan="4" class="v-table-center"><b>parquet</b></td>
      <td class="v-table-center">None</td>
      <td>1.15</td>
      <td>2.69</td>
      <td>5.96</td>
    </tr>
    <tr>
      <td class="v-table-center">brotli</td>
      <td>0.92</td>
      <td>11.22</td>
      <td>1.56</td>
    </tr>
    <tr>
      <td class="v-table-center">gzip</td>
      <td>0.97</td>
      <td>8.98</td>
      <td>2.00</td>
    </tr>
    <tr>
      <td class="v-table-center">snappy</td>
      <td>0.89</td>
      <td>2.78</td>
      <td>3.30</td>
    </tr>
    <tr>
      <td rowspan="6" class="v-table-center"><b>pickle</b></td>
      <td class="v-table-center">None</td>
      <td>1.38</td>
      <td>7.47</td>
      <td>6.25</td>
    </tr>
    <tr>
      <td class="v-table-center">bz2</td>
      <td>5.15</td>
      <td>17.47</td>
      <td>1.24</td>
    </tr>
    <tr>
      <td class="v-table-center">gzip</td>
      <td>1.88</td>
      <td>20.76</td>
      <td>1.81</td>
    </tr>
    <tr>
      <td class="v-table-center">infer</td>
      <td>1.46</td>
      <td>5.80</td>
      <td>6.25</td>
    </tr>
    <tr>
      <td class="v-table-center">xz</td>
      <td>3.46</td>
      <td>97.62</td>
      <td>0.97</td>
    </tr>
  </table>

  > **feather** did not work since it has a restriction of 2 GB per column and it was exceeded.

  <canvas id="chart_s2_i1_scatter_read" style="width:100%;height:300px;"></canvas>
  <canvas id="chart_s2_i1_scatter_write" style="width:100%;height:300px;"></canvas>

  With a file of this size it is clear that **parquet** is the best option. For compression it depends if your priority is file size or Input/Output time. For fast writing/reading use **parquet** without compression, for minimum file size `blosc` and `zlib` is a solution that is between the other two.

  > `parquet` is the best for big tables.

  ## Conlusions

  1. `Excel` is only useful for **small** files when you are planning to open with an Excel program.
  2. `csv` performs poorly
  3. `pickle`, `msgpack` and `parquet` are good options
  4. `feather` is another option when the table is not big
  5. `parquet` is a good option in general and the best one for **big files**.
  6. `parquet without compression` is the **fastest solution for big files** and `parquet with blosc` the **best at compressing big files**.


scripts: |
  <script>
    const scale_seconds = {
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time [seconds]'
          }
        }]
      }
    }
    const scales_MB = {
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'File size [MB]'
          }
        }]
      }
    }
    const labels_basic = ['csv', 'feather', 'msgpack', 'parquet', 'pickle', 'xlsx']

    var chart_s0_i100_time = new Chart("chart_s0_i100_time", {
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
        title: {
          display: true,
          text: 'Read/write average time [s] with small dataframe (56 KB)'
        },
        ...scale_seconds
      }
    });

    var chart_s1_i10_time = new Chart("chart_s1_i10_time", {
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
        title: {
          display: true,
          text: 'Read/write average time [s] with medium dataframe (233 MB)'
        },
        ...scale_seconds
      }
    });
    var chart_s1_i10_size = new Chart("chart_s1_i10_size", {
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
        title: {
          display: true,
          text: 'File size with medium dataframe (233 MB)'
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

    var chart_s1_i5_time = new Chart("chart_s1_i5_time", {
      type: 'bar',
      data: {
        labels: labels_extended,
        datasets: [
          {
            label: 'read',
            backgroundColor: "#AED581", 
            data: [3.052051, 10.516266, 4.25702, 3.094328, 9.920079, 4.052968, 0.60659, 0.493087, 0.476919, 0.51484, 0.766749, 0.98578, 0.996152, 0.809635, 0.465547, 7.775791, 1.48881, 0.476745, 6.258862, 2.065088],
          },
          {
            label: 'write',
            backgroundColor: "#FFA726",
            data: [5.898017, 24.439828, 49.018689, 6.003964, 288.619755, 21.263131, 0.99833, 1.324669, 1.367148, 2.049314, 1.411415, 27.043478, 18.282706, 1.868614, 1.339422, 18.5083, 40.682403, 1.368525, 254.315614, 17.856649],
          }
        ],
      },
      options: {
        title: {
          display: true,
          text: 'Read/write average time [s] with medium dataframe (233 MB)'
        },
        ...scale_seconds
      }
    });
    var chart_s1_i5_size = new Chart("chart_s1_i5_size", {
      type: 'bar',
      data: {
        labels: labels_extended,
        datasets: [
          {
            label: 'file size',
            backgroundColor: "#64B5F6", 
            data: [236.1, 47.58, 65.8, 236.1, 43.99, 66.44, 213.38, 210.09, 202.88, 202.9, 209.58, 50.82, 56.75, 96.37, 207.54, 40.93, 54.85, 207.54, 38.05, 55.43],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: 'File size with medium dataframe (233 MB)'
        },
        legend: {
          display: false
        },
        ...scales_MB
      }
    });

    const xaxes_mb = {
      xAxes: [{
        scaleLabel: {display: true, labelString: 'File size [MB]'}
      }]
    }
    const xaxes_gb = {
      xAxes: [{
        scaleLabel: {display: true, labelString: 'File size [GB]'}
      }]
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
    var chart_s1_i5_scatter_read = new Chart("chart_s1_i5_scatter_read", {
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
        title: {
          display: true,
          text: 'Average reading time vs file size'
        },
        scales: {
          ...xaxes_mb,
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Read average time [s]'
            }
          }]
        },
        ...tooltip_s_mb
      }
    });
    var chart_s1_i5_scatter_write = new Chart("chart_s1_i5_scatter_write", {
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
        title: {
          display: true,
          text: 'Average writting time vs file size'
        },
        scales: {
          ...xaxes_mb,
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Write average time [s]'
            }
          }]
        },
        ...tooltip_s_mb
      }
    });

    var chart_s2_i1_scatter_read = new Chart("chart_s2_i1_scatter_read", {
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
        title: {
          display: true,
          text: 'Average reading time vs file size'
        },
        scales: {
          ...xaxes_gb,
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Read average time [min]'
            }
          }]
        },
        ...tooltip_min_gb
      }
    });
    var chart_s2_i1_scatter_write = new Chart("chart_s2_i1_scatter_write", {
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
        title: {
          display: true,
          text: 'Average writting time vs file size'
        },
        scales: {
          ...xaxes_gb,
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Write average time [min]'
            }
          }]
        },
        ...tooltip_min_gb
      },
    });
  </script>
  