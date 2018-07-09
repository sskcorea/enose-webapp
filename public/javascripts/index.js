$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    humidityData = [],
    acetoneData = [],
    tolueneData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(6, 179, 69, 1)",
        pointBoarderColor: "rgba(6, 179, 69, 1)",
        backgroundColor: "rgbargba(6, 179, 69, 0.4)",
        pointHoverBackgroundColor: "rgba(6, 179, 69, 1)",
        pointHoverBorderColor: "rgba(6, 179, 69, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Humidity',
        yAxisID: 'Humidity',
        borderColor: "rgba(57, 188, 231, 1)",
        pointBoarderColor: "rgba(57, 188, 231, 1)",
        backgroundColor: "rgba(57, 188, 231, 0.4)",
        pointHoverBackgroundColor: "rgba(57, 188, 231, 1)",
        pointHoverBorderColor: "rgba(57, 188, 231, 1)",
        data: humidityData
      }
    ]
  }
  var data2 = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Acetone',
        yAxisID: 'Acetone',
        borderColor: "rgba(255, 106, 0, 1)",
        pointBoarderColor: "rgba(255, 106, 0, 1)",
        backgroundColor: "rgba(255, 106, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 106, 0, 1)",
        pointHoverBorderColor: "rgba(255, 106, 0, 1)",
        data: acetoneData
      },
      {
        fill: false,
        label: 'Toluene',
        yAxisID: 'Toluene',
        borderColor: "rgba(200, 0, 161, 1)",
        pointBoarderColor: "rgba(200, 0, 161, 1)",
        backgroundColor: "rgba(200, 0, 161, 0.4)",
        pointHoverBackgroundColor: "rgba(200, 0, 161, 1)",
        pointHoverBorderColor: "rgba(200, 0, 161, 1)",
        data: tolueneData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'Temperature & Humidity Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Humidity',
          type: 'linear',
          scaleLabel: {
            labelString: 'Humidity(%)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  var basicOption2 = {
    title: {
      display: true,
      text: 'Acetone & Toluene Real-time Data',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Acetone',
        type: 'linear',
        scaleLabel: {
          labelString: 'Acetone(ppm)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Toluene',
          type: 'linear',
          scaleLabel: {
            labelString: 'Toluene(ppm)',
            display: true
          },
          position: 'right'
        }]
    }
  }
  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var ctx2 = document.getElementById("myChart2").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });
  var myLineChart2 = new Chart(ctx2, {
    type: 'line',
    data: data2,
    options: basicOption2
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    console.log('receive message' + message.data);
    try {
      var obj = JSON.parse(message.data);
      if(!obj.time || !obj.temperature) {
        return;
      }
      timeData.push(obj.time);
      temperatureData.push(obj.temperature);
      // only keep no more than 50 points in the line chart
      const maxLen = 50;
      var len = timeData.length;
      if (len > maxLen) {
        timeData.shift();
        temperatureData.shift();
      }

      if (obj.humidity) {
        humidityData.push(obj.humidity);
      }
      if (humidityData.length > maxLen) {
        humidityData.shift();
      }

      if (obj.acetone)
        acetoneData.push(obj.acetone);
      if (acetoneData.length > maxLen)
        acetoneData.shift();

      if (obj.toluene)
        tolueneData.push(obj.toluene);
      if (tolueneData.length > maxLen)
        tolueneData.shift();

      myLineChart.update();
      myLineChart2.update();
    } catch (err) {
      console.error(err);
    }
  }
});
