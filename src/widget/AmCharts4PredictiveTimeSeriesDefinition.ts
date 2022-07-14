import {
    FormFieldObject,
    FormFields,
    TemplateEventActionNames,
    TidyColumnsType,
    TidyTableColumnSelector,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";
import img from './images/timeSeriesImage.png'
import {
    AmCharts4WidgetTemplateDefinition,
    createAmCharts4WidgetTemplateDefinition,
    resolveAmCharts4WidgetTemplateDefinition
} from "../common/AmCharts4Definition";

/**
 * The options (possibly edited and/or from the theme) of this widget.
 */
export interface PredictiveTimeSeriesOptions extends FormFieldObject {

    value: TidyTableColumnSelector;
    rolling1?: TidyTableColumnSelector;
    rolling2?: TidyTableColumnSelector;
    xAxis: TidyTableColumnSelector;

}

function ChartOptionsMeta(): FormFields<PredictiveTimeSeriesOptions> {
    return {
        "value": {
            fieldType: "columnsChooser",
            editorConf: {
                allowedTypes: [TidyColumnsType.NUMERIC],
                fallback: true,
            },
            mandatory: true,
        },
        "rolling1": {
            fieldType: "columnsChooser",
            editorConf: {
                allowedTypes: [TidyColumnsType.NUMERIC],
            },
        },
        "rolling2": {
            fieldType: "columnsChooser",
            editorConf: {
                allowedTypes: [TidyColumnsType.NUMERIC],
            },
        },
        "xAxis": {
            fieldType: "columnsChooser",
            editorConf: {
                allowedTypes: [TidyColumnsType.DATETIME],
                includeProperties: true,
                fallback: true,
            },
            mandatory: true,
        },
    };
}

const Amcharts4PredictiveTimeSeriesDefinition = createAmCharts4WidgetTemplateDefinition({

    type: WidgetTemplateDefinitionType.Chart,

    /**
     * @see PluginLocalization.csv
     */
    id: "PredictiveTimeSeries",

    /**
     * @see PluginLocalization.csv
     */
    groupId: "myChartsJS",

    image: img,

    handlesWidgetStatus: true,

    /**
     * Graphical MDX query builder meta information.
     */
    mdxBuilderSettings: {
        mdxAxis: [
            {
                name: "value",
            },
            {
                name: "xAxis",
            },
        ]
    },

    chartOptionsMeta: ChartOptionsMeta(),

    eventRoles: {
        publish: ['clicked-xAxis'],
        selectionPublish: TemplateEventActionNames.SELECTION,
        selectionSubscribe: TemplateEventActionNames.SELECTION,
    },

    resolveDefinition: function () {

        const self = this as AmCharts4WidgetTemplateDefinition<any>;

        return new Promise((resolve, reject) => {

            import(/* webpackChunkName: "amcharts-timeseries" */ "./AmCharts4PredictiveTimeSeries")
                .then(definition => resolve(resolveAmCharts4WidgetTemplateDefinition(self, definition.default)))
                .catch(err => reject(err))

        });

    },

});

export default Amcharts4PredictiveTimeSeriesDefinition;
