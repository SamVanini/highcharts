//@ts-check
import Dashboards from '../../../../code/dashboards/es-modules/masters/dashboards.src.js';

const { test } = QUnit;


test('KPI Component updating', async function (assert) {
    const container = document.createElement('div');
    container.id = 'container';

    const dashboard = await Dashboards.board('container', {
        gui: {
            layouts: [{
                rows: [{
                    cells: [{
                        id: 'dashboard-cell-1'
                    }]
                }]
            }]
        },
        components: [{
            cell: 'dashboard-cell-1',
            type: 'KPI',
            title: 'Value',
            value: 1
        }]
    }, true),
        kpi = dashboard.mountedComponents[0].component;

    assert.notOk(kpi.chart, 'KPI Component should be loaded without a chart.');

    kpi.update({
        value: 2,
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        }
    });

    assert.ok(kpi.chart, 'KPI Component should have a chart after update.');
});
