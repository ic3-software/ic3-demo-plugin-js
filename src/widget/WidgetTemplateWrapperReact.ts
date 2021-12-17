import {
    ApiUtils,
    IPublicWidgetReactTemplateDefinition,
    IWidgetPublicContext,
    IWidgetTemplateTidyData,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";

export class KpiCard {

    private kpiUnderlying: any;

    constructor(context: IWidgetPublicContext, donutClass: any) {
        this.kpiUnderlying = donutClass;
    }

    reactElement(data: IWidgetTemplateTidyData, options: any, header: string) {
        // TODO (tom) think about typing of options. Possibly via API

        options.valueText = '$value$ (of total)'

        return this.kpiUnderlying.reactElement(data, options, header);

    }

}

/**
 * we want to
 * - reuse an existing widget from any plugin
 *      + we have the donut chart. We want to make a template that shows the default donut chart from the amcharts plugin.
 *        Difficult: how do the users get the id of the pivot table/ donut chart?
 *        Think about render JS and resolve definition. Wrap in the same way.
 *      + you override / hardcode an option of the chart.
 *        difficult to get the types of the available options. Maybe put on public API.
 * - change and take a subset of existing options
 *      + reuse and change the meta of the template. Enable/disable options and change their value.
 *      + move the options out of a group.
 *
 * - add new options and use them in some sort of render hook.
 *      + this is a new custom template and not in the scope for the wrapper template.
 */

// Example for donut wrapper
export const TemplateWrapperTestReact = ApiUtils.makeWidgetTemplateWrapper('ic3.KpiCard', {

    type: WidgetTemplateDefinitionType.Chart,
    id: "KpiCardWrapper",
    image: "",
    groupId: "test",
    reactComponent: true,

    jsCode: (context) => {
        const definition = context.getWidgetTemplateDefinition('ic3.KpiCard') as IPublicWidgetReactTemplateDefinition<any>;
        const donutChartClass = definition.jsCode(context);
        return new KpiCard(context, donutChartClass);
    },

}, opts => {
    typeof opts === 'object' && opts && Object.keys(opts).forEach(key => {
        const option = opts[key];
        option.visibility = option.fieldType === 'columnsChooser';
        if (key === 'titleText') {
            option.visibility = true;
            option.defaultValue = "Setting the title to this value"
        }
    })
});