import _ from "lodash";
import {
    FormFieldObject,
    FormFields,
    IPublicJsChartTemplate,
    IPublicWidgetJsTemplateDefinition,
    ITidyTable,
    IWidgetTemplateTidyData,
    TidyColumnsType,
    TidyTableColumnSelector,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";

class SimpleDropdown implements IPublicJsChartTemplate<SimpleDropdownOptions> {

    private readonly container: HTMLDivElement

    private table?: ITidyTable;

    private options?: SimpleDropdownOptions;

    private el?: HTMLSelectElement

    constructor(container: HTMLDivElement) {

        this.container = container;

    }

    renderJS(data: IWidgetTemplateTidyData, options: SimpleDropdownOptions, header: string) {

        const optionUpdated = !_.isEqual(this.options, options);
        const dataUpdated = !_.isEqual(this.table, data.table);

        this.options = options;
        this.table = data.table;

        if (this.el == null || optionUpdated || dataUpdated) {

            // Do whatever is required if the widget's options have changed (e.g., the widget is being edited).
            // Might need to dispose existing setup and redo it from scratch.

            this.dispose();

            const col = this.table.getColumnByAlias("items");

            this.el = document.createElement("select")

            this.el.style.width = "100%";

            this.el.onchange = (e) => {

                /**
                 * Fire an event on the channel bound to the action: SimpleDropdownChangeValue.
                 */
                this.el && data.inter.fireEvent(
                    "SimpleDropdownChangeValue", col, this.el.selectedIndex - 1
                );

            }

            {
                const item = document.createElement("option");

                item.label = options.placeholder;
                item.disabled = true;
                item.selected = true;

                this.el && this.el.add(item);
            }

            col.mapAllRows(index => {

                const mdx = col.getMdxInfo(index);

                if (mdx) {

                    const item = document.createElement("option");

                    item.label = mdx.caption;
                    item.value = mdx.uniqueName;

                    this.el && this.el.add(item);
                }
            })

            this.container.append(this.el);
        }
    }

    dispose() {
        this.container.firstChild?.remove();
        delete this.el;
    }

}

/**
 * The options (possibly edited and/or from the theme) of this widget.
 */
interface SimpleDropdownOptions extends FormFieldObject {

    /**
     * The column of the tidy table containing the filter items.
     */
    items: TidyTableColumnSelector;

    /**
     * The meta information is defining a default value to ensure there is always
     * a value when rendering the widget.
     *
     * @see simpleDropdownOptionsMeta
     */
    placeholder: string;

}

function simpleDropdownOptionsMeta(): FormFields<SimpleDropdownOptions> {
    return {
        "items": {
            /**
             * Allows for visually grouping field in the editor.
             *
             * @see PluginLocalization.csv
             */
            group: "options",
            fieldType: "columnsChooser",
            editorConf: {

                /**
                 * The column of the tidy table containing the filter items defaulted to the first
                 * CHARACTER column.
                 */
                allowedTypes: [TidyColumnsType.CHARACTER],
                fallback: true,
            },
            defaultValue: "" as any,
        },
        "placeholder": {
            /**
             * Allows for visually grouping field in the editor.
             *
             * @see PluginLocalization.csv
             */
            group: "options",
            fieldType: "string",
            defaultValue: "please select a value",
        }
    }
}

export const SimpleDropdownDefinition: IPublicWidgetJsTemplateDefinition<SimpleDropdownOptions> = {

    type: WidgetTemplateDefinitionType.Filter,

    /**
     * @see PluginLocalization.csv
     */
    id: "SimpleDropdown",

    /**
     * @see PluginLocalization.csv
     */
    groupId: "myCharts",

    image: "",

    withoutHeader: true,
    withoutSelection: true,
    withoutDrilldown: true,
    withoutUserMenu: true,

    /**
     * Graphical MDX query builder meta information.
     */
    mdxBuilderSettings: {
        mdxIsForFilter: true,
        mdxAxis: [
            {
                name: "items",
                disableNonEmpty: true
            }
        ]
    },

    chartOptionsMeta: simpleDropdownOptionsMeta(),

    eventRoles: {
        /**
         * This widget is publishing an event when the underlying <select> is changing its value.
         *
         * @see PluginLocalization.csv
         */
        publish: ["SimpleDropdownChangeValue"],
    },

    jsCode: (context, container): IPublicJsChartTemplate<SimpleDropdownOptions> => {
        return new SimpleDropdown(container);
    },

}
