import {
    FormFieldObject,
    FormFields,
    ILocalizationContext,
    IPublicContext,
    ITidyTableTransformation,
    TidyColumnsType,
    TidyTableColumnSelector
} from "@ic3/reporting-api";


export interface TransformationMakePredictionOptions extends FormFieldObject {
    valueColumn: TidyTableColumnSelector;
    windowLength: number,
    newName?: string;
}

export const TransformationRollingMeans: ITidyTableTransformation<TransformationMakePredictionOptions> = {

    id: "TransformationMakePrediction",
    groupId: "transformation.MyPluginJS",

    getFieldMeta(): FormFields<TransformationMakePredictionOptions> {
        return {
            valueColumn: {
                fieldType: "columnsChooser",
                editorConf: {
                    allowedTypes: [TidyColumnsType.NUMERIC],
                    includeSelectors: true,
                },
                mandatory: true
            },
            windowLength: {
                fieldType: "number",
                mandatory: true
            },
            newName: {
                fieldType: "string"
            }
        }
    },

    getDescription(context: ILocalizationContext, options: TransformationMakePredictionOptions): string {
        return context.localizeDescriptionEx(context, this.getFieldMeta(), options, 'windowLength', 'valueColumn');
    },

    apply(context: IPublicContext, table, options: TransformationMakePredictionOptions): void {

        const valueCol = table.getColumnsBySelector(options.valueColumn)[0];

        const values = rollingAggregation(valueCol.getValues(), options.windowLength, data => {
            let sum = 0;
            let count = 0;
            data.forEach(v => {
                sum += v ?? 0;
                if (v != null) {
                count++;
                }
            });
            if (count === 0) {
                return null;
            }
            return sum / count;
        });

        const newName = options.newName ?? (valueCol.getName() + options.windowLength);
        const rolling = table.createColumn(newName, values, TidyColumnsType.NUMERIC);
        rolling.setCaption(`${options.windowLength}-d Rolling Avg`);
        table.addColumn(rolling);

    }
}


function rollingAggregation<T>(a: ReadonlyArray<T>, windowLength: number, agg: (data: T[]) => T): (T | null)[] {
    return a.map((v, i) => {
        if (i <= windowLength) {
            return null;
        }
        const data = a.slice(i - windowLength + 1, i + 1);
        return agg(data);
    });
}
