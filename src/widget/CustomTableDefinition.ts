import {
    FormFieldObject,
    FormFields,
    IPublicWidgetTemplateDefinition,
    IWrappedWidgetTemplateDefinition,
    TableChartOptions,
    TableColumnSizing
} from "@ic3/reporting-api";

export enum CustomTableWidth {
    narrow = "narrow",
    wide = "wide",
}

interface CustomTableChartOptions extends TableChartOptions {
    width: CustomTableWidth;
}

/**
 * @param optionsMeta extended to match CustomTableChartOptions
 */
function hookChartOptionsMeta(optionsMeta: FormFields<TableChartOptions> | undefined): FormFields<CustomTableChartOptions> | undefined {

    if (optionsMeta) {

        // Hiding several fields and changing their defaults

        optionsMeta.variant.visibility = false;
        optionsMeta.tableSize.visibility = false;

        optionsMeta.cellValue.visibility = false;
        optionsMeta.useMdxSecondAxisAsTableColumn.visibility = false;

        optionsMeta.columnSizing.visibility = false;
        optionsMeta.columnSizes_FIXED.visibility = false;
        optionsMeta.columnSizes_FLUID.visibility = false;
        optionsMeta.columnSizes_USER_RESIZABLE.visibility = false;
        optionsMeta.columnHeaderAlign.visibility = false;
        optionsMeta.columnCellAlign.visibility = false;
        optionsMeta.columnPinned.visibility = false;

        optionsMeta.columnHeaderMenu.visibility = false;
        optionsMeta.columnMenu.visibility = false;
        optionsMeta.columnSortable.visibility = false;
        optionsMeta.columnPinnable.visibility = false;
        optionsMeta.columnHideable.visibility = false;
        optionsMeta.columnFilterable.visibility = false;

        optionsMeta.footer.visibility = false;

        optionsMeta.footerPagination.visibility = false;

        optionsMeta.footerRowCount.visibility = false;
        optionsMeta.footerSelectedRowCount.visibility = false;

        optionsMeta.pageSize.visibility = false;

        optionsMeta.rowsPerPageOptions.visibility = false;

        return {

            ...optionsMeta,

            // Adding a new option controlling the width of the columns

            width: {
                fieldType: "option",
                defaultValue: "wide",
                editorConf: {
                    optionValues: Object.values(CustomTableWidth),
                    optionName: "CustomTableWidth",
                },
            },

        };
    }

    return undefined;
}

/**
 * @param options its type is derived from the output of hookChartOptionsMeta() above.
 */
function hookChartOptions(options: CustomTableChartOptions) {

    options.columnHeaderMenu = true;
    options.columnMenu = "true";
    options.columnSortable = "true";
    options.columnHideable = "true";
    options.columnFilterable = "true";

    options.footer = true;
    options.footerPagination = true;

    options.pageSize = 10;
    options.rowsPerPageOptions = "10";

    options.columnSizing = TableColumnSizing.FIXED;

    // Using an added options to derive existing options values...

    if (options.width === CustomTableWidth.narrow) {
        options.columnSizes_FIXED = "100";
    } else {
        options.columnSizes_FIXED = "250";
    }

}

export const CustomTableDefinition: IWrappedWidgetTemplateDefinition<"ic3.Table"> = {

    registrationInfo: "CustomTable",

    wrappedWidgetTemplateId: "ic3.Table",

    wrapper: (wrapped) => {

        return {

            ...wrapped,

            id: "CustomTable",

            /**
             * @see PluginLocalization.csv
             */
            groupId: "myCharts",

            chartOptionsMeta: hookChartOptionsMeta(wrapped.chartOptionsMeta),
            hookChartOptions: hookChartOptions,

        } as IPublicWidgetTemplateDefinition<FormFieldObject>

    }

};
