import PluginLocalization from "./PluginLocalization.csv";
import {
    ApiUtils,
    FormFieldObject,
    ILocalizationManager,
    IPublicWidgetTemplateDefinition,
    ITidyTableTransformationManager,
    IWidgetManager,
    WidgetTemplateDefinitionType,
    WidgetTemplateIDs
} from "@ic3/reporting-api";
import {CustomTableDefinition} from "./widget/CustomTableDefinition";
import {SimpleDropdownDefinition} from "./widget/SimpleDropdownDefinition";
import {SimpleTableDefinition} from "./widget/SimpleTableDefinition";
import {TransformationCustom} from "./transformations/TransformationCustom";
import {CustomDonutChartDefinition} from "./widget/CustomDonutChartDefinition";
import {TransfRendererCustom} from "./transformations/TransfRendererCustom";

/**
 * The plugin definition exposed as a remote Webpack module to the icCube dashboards application.
 */
const PluginDefinition = ApiUtils.makePlugin({

    /**
     * The ID used to identify this plugin within the icCube dashboards application.
     *
     * Keep that id simple (i.e., ASCII letter without any dot, space, separator, etc...) as it will be used
     * as a folder name (once deployed into an icCube server), Webpack module name, localization id, etc...
     *
     * It must be unique across all the loaded plugins.
     */
    id: "MyPluginJS",

    registerLocalization(manager: ILocalizationManager) {

        console.log("[MyPluginJS] registerLocalization")

        manager.registerLocalization(PluginLocalization);

    },

    registerWidgets(manager: IWidgetManager) {

        console.log("[MyPluginJS] registerWidgets")

        manager.registerWidget(SimpleDropdownDefinition);
        manager.registerWidget(SimpleTableDefinition);

        manager.registerWrappedWidget(CustomTableDefinition);
        manager.registerWrappedWidget(CustomDonutChartDefinition);

    },

    registerTidyTableTransformations(manager: ITidyTableTransformationManager) {

        manager.registerTransformation(TransformationCustom);
        manager.registerTransformation(TransfRendererCustom);

    },

    /**
     * Keep only our widgets and the available filters.
     */
    acceptWidget(id: WidgetTemplateIDs | string, widget: IPublicWidgetTemplateDefinition<FormFieldObject>): boolean {

        return id.startsWith("MyPluginJS")
            || (widget.type === WidgetTemplateDefinitionType.Filter && id.startsWith("ic3"))
            || (id.startsWith("ic3") || id.includes("Table"))
            ;

    }

});

export default PluginDefinition;