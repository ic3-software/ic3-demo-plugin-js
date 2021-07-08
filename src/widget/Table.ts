import {Grid} from "gridjs";
import {
    IPublicWidgetJsTemplateDefinition,
    IWidgetPublicContext,
    IWidgetTemplateTidyData,
    WidgetTemplateDefinitionType
} from "@ic3/reporting-api";

class Table {

    // private readonly context: IWidgetPublicContext;

    private readonly container: HTMLDivElement;

    constructor(context: IWidgetPublicContext, container: HTMLDivElement) {
        // this.context = context;
        this.container = container;
    }

    renderJS(data: IWidgetTemplateTidyData, widgetFormOptions: any, widgetHeader: string) {

        // TODO connect to query + handle click + selection (see existing MUI table)
        // https://gridjs.io/docs/config/style/

        new Grid({

            columns: ["Name", "Email", "Phone Number"],

            search: true,
            resizable: true,

            data: () => [
                ["John", "john@example.com", "(353) 01 222 3333"],
                ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
                ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
                ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
                ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
            ],

        }).render(this.container);

    }

    dispose() {
    }

}

export const TableDefinition: IPublicWidgetJsTemplateDefinition<any> = {

    type: WidgetTemplateDefinitionType.Chart,

    /**
     * @see PluginLocalization.csv
     */
    id: "Table",

    /**
     * @see PluginLocalization.csv
     */
    groupId: "myCharts",

    image: "",

    jsCode: (context, container) => {
        return new Table(context, container);
    },

}