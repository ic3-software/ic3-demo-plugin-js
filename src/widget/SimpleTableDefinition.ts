import {
    ApiUtils,
    FormFieldObject,
    FormFields,
    IPublicWidgetJsTemplateDefinition,
    TemplateEventActionNames,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";

/**
 * The options (possibly edited and/or from the theme) of this widget.
 */
export interface SimpleTableOptions extends FormFieldObject {

    ordering: boolean;

}

function chartOptionsMeta(): FormFields<SimpleTableOptions> {
    return {
        "ordering": {
            fieldType: "boolean",
            defaultValue: true,
        }
    }
}

export const SimpleTableDefinition = ApiUtils.createLazyJsWidgetTemplateDefinition<SimpleTableOptions>({

    type: WidgetTemplateDefinitionType.Chart,

    /**
     * @see PluginLocalization.csv
     */
    id: "SimpleTable",

    /**
     * @see PluginLocalization.csv
     */
    groupId: "myCharts",

    image: "",

    withoutDrilldown: true,

    /**
     * Graphical MDX query builder meta information.
     */
    mdxBuilderSettings: {
        mdxAxis: [
            {
                name: "Measures",
                isOptional: true,
                disableNonEmpty: true,
                showOrder: 3,
            },
            {
                name: "Columns",
                multipleHierarchy: true,
                showOrder: 1,
            },
            {
                name: "Rows",
                multipleHierarchy: true,
                showOrder: 2,
            }
        ]
    },

    chartOptionsMeta: chartOptionsMeta(),

    eventRoles: {
        /**
         * This widget is publishing an event when the user clicks on a row.
         *
         * @see PluginLocalization.csv
         */
        publish: ["SimpleTableClickRow"],

        /**
         * This widget is supporting a selection.
         */
        selectionPublish: TemplateEventActionNames.SELECTION,
        selectionSubscribe: TemplateEventActionNames.SELECTION,
    },

    selection: {

        /**
         * All "axis" columns can be part of the selection (see Interactions/Selection/Selection Granularity)
         * in the table widget editor.
         */
        allowedColumns: column => column.getAxisCoordinate() == null || column.getAxisCoordinate()?.axisIdx !== 0

    },

    /**
     * Only the widget template meta information is required when starting the application.
     *
     * This method gives the opportunity for a widget template to load (Webpack) its actual jsCode logic when required.
     * Here "datatables.net" will be loaded when required (i.e., when rendering the Simple Table widget).
     */
    resolveDefinition: function () {

        const self = this as IPublicWidgetJsTemplateDefinition<SimpleTableOptions>;

        return new Promise((resolve, reject) => {
            import(/* webpackChunkName: "datatables-net" */ "./SimpleTable")
                .then(table => resolve({

                    ...self /* extended definition w/ actual resolved jsCode() */,

                    ...table.default /* jsCode(): new SimpleTable(...) */,

                    resolveDefinition: undefined,

                }))
                .catch(err => reject(err))
        })

    },

});
