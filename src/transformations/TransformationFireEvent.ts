import {
    FormFieldObject,
    FormFields,
    ILocalizationContext,
    IPublicContext,
    ITidyTableTransformation
} from "@ic3/reporting-api";


export interface TransformationFireEventOptions extends FormFieldObject {

}

export const TransformationFireEvent: ITidyTableTransformation<TransformationFireEventOptions> = {

    id: "TransformationFireEvent",
    groupId: "transformation.MyPluginJS",

    getFieldMeta(): FormFields<TransformationFireEventOptions> {
        return {}
    },

    getDescription(context: ILocalizationContext, options: TransformationFireEventOptions): string {
        return context.localizeDescriptionEx(context, this.getFieldMeta(), options);
    },

    apply(context: IPublicContext, table, options: TransformationFireEventOptions): void {
        if (table.getColumns()[0]?.getValue(0) === 42) {
            context.fireMdxEventName("selCountry", "Japan", "[Geography].[Region].[Country].&[JP]");
        } else {
            context.fireClearEventName("selCountry");
        }
    },
}