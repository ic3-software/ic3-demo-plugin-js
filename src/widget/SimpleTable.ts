import {
    FormFieldObject,
    FormFields,
    IPublicWidgetJsTemplateDefinition,
    ITidyTable,
    ITidyTableInteraction,
    IWidgetPublicContext,
    IWidgetTemplateTidyData,
    TemplateEventActionNames,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";
import _ from "lodash";
import $ from "jquery";

import "datatables.net";
import "./css/SimpleTable.css"

class SimpleTable {

    private readonly container: HTMLDivElement;

    private table?: ITidyTable;

    private options?: SimpleTableOptions;

    private $table?: DataTables.Api;

    constructor(context: IWidgetPublicContext, container: HTMLDivElement) {
        this.container = container;
    }

    renderJS(data: IWidgetTemplateTidyData, options: any, header: string) {

        const optionUpdated = !_.isEqual(this.options, options);
        const dataUpdated = !_.isEqual(this.table, data.table);

        this.options = options;
        this.table = data.table;

        if (optionUpdated || dataUpdated) {

            this.dispose();

            // We're simply displaying the underlying tidy table wo/ much enhancement.

            const columns = this.table.getColumns();

            const gridColumns = columns.map((column, idx) => {
                return {title: column.getCaption()};
            });

            const gridRows = this.table.mapRows((rowIdx, rowData, rowSize) => {

                const row = [];

                for (let ii = 0; ii < rowSize; ii++) {
                    const column = columns[ii];
                    const value = column.getFormattedValueOrValue(rowIdx);
                    row.push(value ?? "");
                }

                return row;
            });

            const table = document.createElement("table");
            table.className = "cell-border compact hover order-column row-border stripe";
            this.container.append(table);

            let outerHeight = $(this.container).outerHeight();
            outerHeight = outerHeight ? (outerHeight - 37) : outerHeight;

            const $table = this.$table = $(table).DataTable({

                columns: gridColumns,
                data: gridRows,

                info: false,
                scrollY: outerHeight + "px",
                searching: false,
                paging: false,
                ordering: options.ordering,
                order: [],
            })

            // The column used for defining the content of the event (SimpleTableClickRow).
            // In the query, the first axis after the measures.
            const clickRowColumn = this.table.getColumnByMdxAxis({axisIdx: 1, hierIdx: 0});

            // https://datatables.net/examples/advanced_init/events_live.html
            $("#" + table.id + " tbody").on("click", "tr", function (e) {

                const row = $table.row(this);
                const index = row.index();

                // Note this is safe to call if selection is disabled (end-user configuration of the widget).
                data.inter.handleRowHit(index, e.originalEvent);

                clickRowColumn && data.inter.fireEvent("SimpleTableClickRow", clickRowColumn, index);
            });

            this.renderSelection(data.inter);

        } else {

            this.renderSelection(data.inter);

        }

    }

    dispose() {
        this.container.firstChild?.remove();
        delete this.$table;
    }

    renderSelection(inter: ITidyTableInteraction) {

        if (!inter.isSelectionActive()) {
            return;
        }

        const count = this.$table?.rows().count() || 0;

        for (let rr = 0; rr < count; rr++) {

            const node = this.$table?.row(rr).node();
            node && $(node).toggleClass("selected", inter.isSelected(rr));

        }

    }

}

/**
 * The options (possibly edited and/or from the theme) of this widget.
 */
interface SimpleTableOptions extends FormFieldObject {

    ordering: boolean;

}

function simpleTableOptionsMeta(): FormFields<SimpleTableOptions> {
    return {
        "ordering": {
            fieldType: "boolean",
            defaultValue: true,
        }
    }
}

export const SimpleTableDefinition: IPublicWidgetJsTemplateDefinition<SimpleTableOptions> = {

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

    chartOptionsMeta: simpleTableOptionsMeta(),

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

    jsCode: (context, container) => {
        return new SimpleTable(context, container);
    },

}