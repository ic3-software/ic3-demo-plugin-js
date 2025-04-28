import {AmCharts4DonutChartOptions, FormFields} from "@ic3/reporting-api";
import {PieChart} from "@amcharts/amcharts4/charts";

export default {

    /**
     * Defines the fields visible in the Chart tab in the widget editor.
     *
     * @param optionsMeta the wrapped widget fields (can be extended).
     */
    hookChartOptionsMeta: (optionsMeta: FormFields<AmCharts4DonutChartOptions> | undefined): FormFields<AmCharts4DonutChartOptions> | undefined => {

        if (optionsMeta) {

            Object.keys(optionsMeta).forEach(k => {
                (optionsMeta as any)[k].visibility = false;
            })

            return optionsMeta;
        }

        return undefined;
    },

    /**
     * @param options the wrapped widget options as edited above (possibly extended).
     */
    hookChartOptions: (options: AmCharts4DonutChartOptions) => {

        const wrapped = options.postRenderHook;

        options.labelText = "$value.caption$ <br> $value.total$";
        options.labelTextAlign = 'middle';
        options.donutRadius = 70;  /* rendered as a Donut chart. Set to 0 for a Pie Chart. */

        options.postRenderHook = {

            /**
             * In-place processing of the amCharts 4 chart instance.
             *
             * <pre>
             *     ( value: any ) => void;
             *
             *          value.getChart() is returning an instance of amChart 4 class
             *          whose name is available in the chart options documentation.
             * </pre>
             */
            hook: (value: any, options: any) => {

                wrapped && wrapped.hook(value, options) /* e.g., wrapped chart is using a variant w/ hook */;

                const chart: PieChart = value.getChart();
                chart.radius = 80;  /* Outer radius of the chart */

            }
        }
    }

}
