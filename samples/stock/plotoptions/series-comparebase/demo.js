(async () => {

    const names = ['MSFT', 'AAPL', 'GOOG'];

    /**
     * Create the chart when all data is loaded
     */
    function createChart(series) {

        Highcharts.stockChart('container', {
            title: {
                text: 'Series compare by <em>percent</em>'
            },
            subtitle: {
                text: 'Compare the values of the series against the first ' +
                    'value in the visible range'
            },

            rangeSelector: {
                selected: 4
            },

            yAxis: {
                labels: {
                    format: '{value} %'
                },
                plotLines: [{
                    value: 100,
                    width: 1,
                    color: '#333333',
                    zIndex: 3
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent',
                    compareBase: 100
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">' +
                    '{series.name}</span>: <b>{point.y}</b> ' +
                    '({point.change}%)<br/>',
                changeDecimals: 2,
                valueDecimals: 2
            },

            series
        });
    }

    const series = [];
    for (const name of names) {
        const response = await fetch(
            'https://cdn.jsdelivr.net/gh/highcharts/highcharts@f0e61a1/' +
            'samples/data/' + name.toLowerCase() + '-c.json'
        );
        const data = await response.json();
        series.push({ name, data });
    }

    createChart(series);

})();
