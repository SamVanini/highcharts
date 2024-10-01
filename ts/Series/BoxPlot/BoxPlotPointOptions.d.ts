/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type BoxPlotPoint from './BoxPlotPoint';
import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BoxPlotPointOptions extends ColumnPointOptions {

    /**
     * The dash style of the box.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type {Highcharts.DashStyleValue}
     *
     * @default Solid
     *
     * @since 8.1.0
     *
     * @product highcharts
     *
     * @apioption series.boxplot.data.boxDashStyle
     */

    /**
     * The dash style of the median.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type {Highcharts.DashStyleValue}
     *
     * @default Solid
     *
     * @since 8.1.0
     *
     * @product highcharts
     *
     * @apioption series.boxplot.data.medianDashStyle
     */

    /**
     * The dash style of the stem.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type {Highcharts.DashStyleValue}
     *
     * @default Solid
     *
     * @since 8.1.0
     *
     * @product highcharts
     *
     * @apioption series.boxplot.data.stemDashStyle
     */

    /**
     * The dash style of the whiskers.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type {Highcharts.DashStyleValue}
     *
     * @default Solid
     *
     * @since 8.1.0
     *
     * @product highcharts
     *
     * @apioption series.boxplot.data.whiskerDashStyle
     */

    /**
     * The `high` value for each data point, signifying the highest value
     * in the sample set. The top whisker is drawn here.
     *
     * @type {number}
     *
     * @product highcharts
     */
    high?: BoxPlotPoint['high'];

    /**
     * The `low` value for each data point, signifying the lowest value
     * in the sample set. The bottom whisker is drawn here.
     *
     * @type {number}
     *
     * @product highcharts
     */
    low?: BoxPlotPoint['low'];

    /**
     * The length of a BoxPlot point's lower whisker.
     *
     * @sample {highcharts} highcharts/series-boxplot/whisker-length
     *         Configuring whisker lengths
     *
     * @type {number|string}
     *
     * @product highcharts
     */
    lowerWhiskerLength?: BoxPlotPoint['lowerWhiskerLength'];

    /**
     * The median for each data point. This is drawn as a line through the
     * middle area of the box.
     *
     * @type {number}
     *
     * @product highcharts
     */
    median?: BoxPlotPoint['median'];

    /**
     * The lower quartile for each data point. This is the bottom of the
     * box.
     *
     * @type {number}
     *
     * @product highcharts
     */
    q1?: BoxPlotPoint['q1'];

    /**
     * The higher quartile for each data point. This is the top of the box.
     *
     * @type {number}
     *
     * @product highcharts
     */
    q3?: BoxPlotPoint['q3'];

    /**
     * The length of a BoxPlot point's upper whisker.
     *
     * @sample {highcharts} highcharts/series-boxplot/whisker-length
     *         Configuring whisker length
     *
     * @type {number|string}
     *
     * @product highcharts
     */
    upperWhiskerLength?: BoxPlotPoint['upperWhiskerLength'];

    /**
     * The length of the whiskers, the horizontal lines marking low and
     * high values. It can be a numerical pixel value, or a percentage
     * value of the box width. Set `0` to disable whiskers.
     *
     * Individual lengths for upper and lower whiskers can be defined on the
     * boxplot series and on specific boxplot points. Whisker lengths defined
     * on points take precedence over whisker lengths defined on a boxplot
     * series.
     *
     * @sample {highcharts} highcharts/series-boxplot/whisker-length
     *         Configuring whisker lengths
     *
     * @type {number|string}
     *
     * @since 3.0
     *
     * @product highcharts
     */
    whiskerLength?: (
        BoxPlotPoint['upperWhiskerLength'] |
        BoxPlotPoint['lowerWhiskerLength']
    );
}

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotPointOptions;
