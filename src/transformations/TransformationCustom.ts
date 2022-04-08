import {
    FormFieldObject,
    FormFields,
    ILocalizationContext,
    IPublicContext,
    ITidyTableTransformation,
    TidyColumnsType,
    TidyTableColumnSelector
} from "@ic3/reporting-api";


export interface TransformationCustomOptions extends FormFieldObject {
    column: TidyTableColumnSelector;
    appendText: string;
}

export const TransformationCustom: ITidyTableTransformation<TransformationCustomOptions> = {

    id: "TransformationCustom",
    groupId: "transformation.MyPluginJS",

    getFieldMeta(): FormFields<TransformationCustomOptions> {
        return {
            column: {
                fieldType: "columnsChooser",
                mandatory: true
            },
            appendText: {
                fieldType: "string",
                defaultValue: " append this text"
            }
        }
    },

    getDescription(context: ILocalizationContext, options: TransformationCustomOptions): string {

        return context.localizeDescriptionEx(context, this.getFieldMeta(), options, 'appendText', 'column');

    },

    apply(context: IPublicContext, table, options: TransformationCustomOptions): void {

        const column = table.getColumnsBySelector(options.column)?.[0];

        if (column != null) {
            column.apply(value => String(value) + options.appendText, TidyColumnsType.CHARACTER);
        }

    }
}
