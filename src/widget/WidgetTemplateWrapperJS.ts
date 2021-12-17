import {
    ApiUtils,
    IWidgetPublicContext,
    IWidgetTemplateTidyData,
    WidgetTemplateDefinitionType,
} from "@ic3/reporting-api";

export class Donut {

    private donutUnderlying: any;

    constructor(context: IWidgetPublicContext, donutClass: any) {
        this.donutUnderlying = donutClass;
    }

    renderJS(data: IWidgetTemplateTidyData, options: any, header: string) {
        // TODO (tom) think about typing of options. Possibly via API

        options.sliceLabelsText = 'tesxcbt';

        // this.donutUnderlying.options;
        // this.donutUnderlying.chart;

        this.donutUnderlying.renderJS(data, options, header);

    }

    dispose() {
        this.donutUnderlying.dispose();
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
export const TemplateWrapperTestJS = ApiUtils.makeWidgetTemplateWrapper('amCharts4.AmCharts4DonutChart', {

    type: WidgetTemplateDefinitionType.Chart,
    id: "donutWrapper",
    image: "",
    groupId: "test",

    jsCode: (context: IWidgetPublicContext, container: HTMLDivElement) => {
        const definition = context.getWidgetTemplateDefinition('amCharts4.AmCharts4DonutChart');
        const donutChartClass = definition.jsCode(context, container);
        return new Donut(context, donutChartClass);
    },

}, opts => {
    typeof opts === 'object' && opts && Object.keys(opts).forEach(key => {
        opts[key].visibility = false;
    });
});