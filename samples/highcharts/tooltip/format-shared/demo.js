Highcharts.chart('container', {

    title: {
        text: 'Highcharts with a shared tooltip format string'
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        crosshair: true
    },

    tooltip: {
        format: `<span style="font-size: 0.8em">{x}</span><br/>
            {#foreach points}
            <span style="color:{point.color}">\u25CF</span>
                {series.name}: <b>{point.y}</b><br/>
            {/foreach}`,
        shared: true
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]
    }, {
        data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5]
    }]
});