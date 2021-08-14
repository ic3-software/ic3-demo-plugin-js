import _ from "lodash";
import {
    FormFieldObject,
    FormFields,
    IPublicWidgetJsTemplateDefinition,
    ITidyTable,
    IWidgetTemplateDataMappingDef,
    IWidgetTemplateTidyData,
    TidyColumnsType,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";

class SimpleDropdown {

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
     * The meta information is defining a default value to ensure there is always
     * a value when rendering the widget.
     *
     * @see simpleDropdownOptionsMeta
     */
    placeholder: string;

}

function simpleDropdownOptionsMeta(): FormFields<SimpleDropdownOptions> {
    return {
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

function simpleDropdownDataMappingMeta(): IWidgetTemplateDataMappingDef[] {
    return [{
        /**
         * Allows for visually grouping field in the editor.
         *
         * @see PluginLocalization.csv
         */
        mappingGroup: "options",
        mappingName: "items",
        allowedTypes: [TidyColumnsType.CHARACTER],
        fallback: true,
    }]
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

    dataMappingMeta: simpleDropdownDataMappingMeta(),
    chartOptionsMeta: simpleDropdownOptionsMeta(),

    eventRoles: {
        /**
         * This widget is publishing an event when the underlying <select> is changing its value.
         *
         * @see PluginLocalization.csv
         */
        publish: ["SimpleDropdownChangeValue"],
    },

    jsCode: (context, container) => {
        return new SimpleDropdown(container);
    },

}
