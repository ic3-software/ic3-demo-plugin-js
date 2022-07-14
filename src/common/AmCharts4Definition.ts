import {
    ChartTemplateDataMapping,
    FormFieldObject,
    FormFields,
    IPublicJsChartTemplate,
    IPublicWidgetTemplateDefinition,
    ITemplateEventActionDef,
    IWidgetPublicContext,
    IWidgetTemplateMdxBuilderMapping,
    IWidgetTemplateTidyOptions,
    IWidgetVariantManager
} from "@ic3/reporting-api";

/**
 * An helper method used while dynamically importing the widget implementation to create
 * the resolved widget template definition that is going to be used for rendering/editing
 * the widget in the dashboards application.
 */
export function resolveAmCharts4WidgetTemplateDefinition<OPTIONS extends FormFieldObject>(definition: AmCharts4WidgetTemplateDefinition<OPTIONS>, js: AmCharts4WidgetTemplateDefinitionJS<OPTIONS>): IPublicWidgetTemplateDefinition<OPTIONS> {

    return {

        ...definition,
        ...js,

        reactComponent: false,
        resolveDefinition: undefined

    };

}

/**
 * A widget definition without static dependency on amCharts 4 library (lazy loading).
 *
 * Some meta information about the widget without its actual implementation. The resolveDefinition method
 * is called only if a widget has to be rendered.
 */
export type AmCharts4WidgetTemplateDefinition<OPTIONS extends FormFieldObject> =
    IPublicWidgetTemplateDefinition<OPTIONS>
    & {

    /**
     * Use a dynamic import to lazy load the actual widget implementation.
     *
     * @see resolveAmCharts4WidgetTemplateDefinition
     */
    resolveDefinition: () => Promise<IPublicWidgetTemplateDefinition<any>>;

};

/**
 * Create a widget definition without static dependency on amCharts 4 library (lazy loading).
 *
 * @see AmCharts4WidgetTemplateDefinition#resolveDefinition
 */
export function createAmCharts4WidgetTemplateDefinition<OPTIONS extends FormFieldObject>(definition: Omit<AmCharts4WidgetTemplateDefinition<OPTIONS>, "jsCode">): AmCharts4WidgetTemplateDefinition<OPTIONS> {

    return {

        ...definition,

        jsCode: (context: IWidgetPublicContext, container: HTMLDivElement) => {
            throw new Error("AmCharts 4: unexpected jsCode() call!");
        },

        reactComponent: false,
        withDrilldownPivotTableLikeAs: false,

        // -------------------------------------------------------------------------------------------------------------
        // [March 11, 2022] This cast seems to fix that Typescript issue:
        //
        //          Expression produces a union type that is too complex to represent.
        // -------------------------------------------------------------------------------------------------------------

    } as AmCharts4WidgetTemplateDefinition<OPTIONS>;

}

export interface AmCharts4WidgetTemplateDefinitionJS<OPTIONS extends FormFieldObject> {

    chartOptionsMeta?: FormFields<OPTIONS>;
    eventRoles?: ITemplateEventActionDef;

    mdxBuilderSettings?: IWidgetTemplateMdxBuilderMapping;

    registerVariants?: (theme: unknown, manager: IWidgetVariantManager) => void;

    jsCode: (context: IWidgetPublicContext, container: HTMLDivElement) => IPublicJsChartTemplate<OPTIONS>;

    registerAmCharts4: (callback: (am4core: unknown) => void) => void;

    defaultMapping?: (data: IWidgetTemplateTidyOptions<OPTIONS>) => ChartTemplateDataMapping;
}

