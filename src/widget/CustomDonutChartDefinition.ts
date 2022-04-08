import {ApiUtils,} from "@ic3/reporting-api";

export const CustomDonutChartDefinition = ApiUtils.makeAmCharts4WrappedWidgetTemplateDefinition<"amCharts4.AmCharts4DonutChart">({

    /**
     * Some free text used while registering the wrapper (e.g., error purpose).
     */
    registrationInfo: "CustomDonutChart",

    /**
     * Re-using the Donut Chart.
     */
    wrappedWidgetTemplateId: "amCharts4.AmCharts4DonutChart",

    /**
     * New overall meta-information (e.g., id, groupId, image, etc...).
     */
    props: {

        /**
         * The id of the new chart.
         *
         * @see PluginLocalization.csv
         */
        id: "CustomDonutChart",

        /**
         * @see PluginLocalization.csv
         */
        groupId: "myCharts",

    },

    /**
     * Meta-information for the editing of the widget options as well as the actual processing of those options
     * (i.e., AmCharts 4 chart configuration). Lazy-loaded (and the underlying AmCharts 4 library) once required.
     */
    hooks: import(/* webpackChunkName: "amcharts-custom-donut" */ "./CustomDonutChart"),

});