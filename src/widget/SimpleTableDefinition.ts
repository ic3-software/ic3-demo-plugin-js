import {
    ApiUtils,
    FormFieldObject,
    FormFields,
    IPublicWidgetJsTemplateDefinition,
    ITidyTable,
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
    groupId: "myChartsJS",

    image: "",

    withoutDrilldown: true,

    /**
     * Graphical MDX query builder meta information.
     */
    mdxBuilderSettings: {
        mdxAxis: [
            {
                name: "Columns",
                multipleHierarchy: true,
            },
            {
                name: "Rows",
                multipleHierarchy: true,
            },
            {
                name: "#Measures" /* sort of paging */,
                isOptional: true,
                disableNonEmpty: true,
            },
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

    defaultMapping: data => {
        const table = data.table;

        const axis = table.getColumnsByMdxAxis(1);

        if (!axis || axis.length === 0) {
            return {rows: [table.getColumns()[0]]}
        }

        return {rows: axis};

    },

    selection: {

        defaultGranularityItems: [{
            type: "role",
            role: "Rows"
        }],

        granularityItems: (table: ITidyTable) => {
            return [{
                type: 'role',
                role: "Rows"
            }];
        },

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
