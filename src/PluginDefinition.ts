import PluginLocalization from "./PluginLocalization.csv";
import {ApiUtils, ILocalizationManager, ITidyTableTransformationManager, IWidgetManager} from "@ic3/reporting-api";
import {SimpleDropdownDefinition} from "./widget/SimpleDropdown";
import {SimpleTableDefinition} from "./widget/SimpleTable";
import {TransformationCustom} from "./transformations/TransformationCustom";

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

    },

    registerTidyTableTransformations(manager: ITidyTableTransformationManager) {
        manager.registerTransformation(TransformationCustom);
    }

});

export default PluginDefinition;