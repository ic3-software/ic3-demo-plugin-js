import _ from "lodash";
import $ from "jquery";
import {
    IPublicJsChartTemplate,
    ITidyTable,
    ITidyTableInteraction,
    IWidgetPublicContext,
    IWidgetTemplateTidyData,
} from "@ic3/reporting-api";
import {SimpleTableOptions} from "./SimpleTableDefinition";

import "datatables.net";
import "./css/SimpleTable.css"

class SimpleTable {

    private readonly context: IWidgetPublicContext;

    private readonly container: HTMLDivElement;

    private tidyTable?: ITidyTable;

    private tidyInter?: ITidyTableInteraction;

    private options?: SimpleTableOptions;

    /**
     * DataTables.Api
     */
    private $table?: any;

    constructor(context: IWidgetPublicContext, container: HTMLDivElement) {
        this.context = context;
        this.container = container;
    }

    renderJS(data: IWidgetTemplateTidyData, options: SimpleTableOptions, header: string) {

        const optionUpdated = !_.isEqual(this.options, options);
        const tableUpdated = !_.isEqual(this.tidyTable, data.table);
        const interUpdated = !_.isEqual(this.tidyInter, data.inter);

        this.options = options;
        this.tidyTable = data.table;
        this.tidyInter = data.inter;

        const logger = this.context.logger();

        logger.info("Demo", "[MyPluginJS] SimpleTable.render(" + this.context.getWidgetId() + ")", {
            optionUpdated,
            tableUpdated,
            interUpdated
        })

        if (optionUpdated || tableUpdated) {

            this.dispose();

            // We're simply displaying the underlying tidy table wo/ much enhancement.

            const columns = this.tidyTable.getColumns();

            const gridColumns = columns.map((column, idx) => {
                return {title: column.getCaption()};
            });

            const gridRows = this.tidyTable.mapRows((rowIdx, rowData, rowSize) => {

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

            });

            const self = this;

            // https://datatables.net/examples/advanced_init/events_live.html
            $("#" + table.id + " tbody").on("click", "tr", function (e) {

                const row = $table.row(this);
                const rowIdx = row.index();

                logger.info("Demo", "[MyPluginJS]] SimpleTable.click(" + self.context.getWidgetId() + ")", rowIdx)

                if (self.tidyInter?.getInteractionMode() === "selection") {
                    self.tidyInter.handleClickSelection(rowIdx, e.originalEvent);
                }

                const rowColumn = self.tidyTable?.getColumnByAlias("rows");
                rowColumn && data.inter.fireEvent("SimpleTableClickRow", rowColumn, rowIdx);
            });

        }

        this.renderSelection(data.inter);

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

export default {

    jsCode: (context: IWidgetPublicContext, container: HTMLDivElement): IPublicJsChartTemplate<SimpleTableOptions> => {
        return new SimpleTable(context, container);
    }

}

