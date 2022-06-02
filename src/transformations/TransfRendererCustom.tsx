import {
    FormFieldObject,
    FormFields,
    ILocalizationContext,
    IPublicContext,
    ITidyTableTransformation,
    TidyTableColumnSelector,
} from "@ic3/reporting-api";

interface TemplateOptions extends FormFieldObject {
    columns: TidyTableColumnSelector[];
}

export const TransfRendererCustom: ITidyTableTransformation<TemplateOptions> = {

    id: "TransfRendererCustom",
    groupId: "transformation.cellRenderer",

    getFieldMeta(): FormFields<TemplateOptions> {
        return {
            'columns': {
                fieldType: 'columnsChooser',
                mandatory: true,

                editorConf: {
                    multiple: true,
                    includeSelectors: true
                }
            },
        }
    },

    getDescription(context: ILocalizationContext, options: TemplateOptions): string {
        return context.localizeDescriptionEx(context, this.getFieldMeta(), options, 'columns');
    },

    apply(context: IPublicContext, table, options: TemplateOptions): void {

        table.getColumnsBySelector(options.columns).forEach(column => {

            if (column != null) {

                const math = table.getMath();
                const min = math.min(column);
                const max = math.max(column);

                column.setCellDecoration({
                    cssStyles: (rowIdx: number) => {
                        let scale = 0.5 + (math.scaleNormalize(column, rowIdx, min, max, undefined) ?? 0.5);

                        // Reduce the number of produced classes
                        scale = Math.round(scale * 10) / 10;

                        /**
                         * Camelcase
                         */
                        return {
                            fontSize: scale + "rem",

                            ':hover': {
                                fontSize: (2 * scale) + "rem",
                            }
                        }

                    },
                    // render is string based (not a React Node)
                    stringRenderer: true,
                    renderer: (rowIdx: number) => {
                        // write your logic you would like

                        return "<span>" + (column.getValue(rowIdx) ?? "") + "</span>";
                    },
                });
            }

        });

    }
}
