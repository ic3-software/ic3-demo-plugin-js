import PluginLocalization from "./PluginLocalization.csv";
import {
    ApiUtils,
    FormFieldObject,
    ILocalizationManager,
    ILogger,
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
import {TransformationRollingMeans} from "./transformations/TransformationRollingMeans";
import Amcharts4PredictiveTimeSeriesDefinition from "./widget/AmCharts4PredictiveTimeSeriesDefinition";
import {TransformationFireEvent} from "./transformations/TransformationFireEvent";

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

    registerLocalization(logger: ILogger, manager: ILocalizationManager) {

        logger.info("Demo", "[MyPluginJS] registerLocalization")

        manager.registerLocalization(PluginLocalization);

    },

    registerWidgets(logger: ILogger, manager: IWidgetManager) {

        logger.info("Demo", "[MyPluginJS] registerWidgets")

        manager.registerWidget(SimpleDropdownDefinition);
        manager.registerWidget(SimpleTableDefinition);
        manager.registerWidget(Amcharts4PredictiveTimeSeriesDefinition);

        manager.registerWrappedWidget(CustomTableDefinition);
        manager.registerWrappedWidget(CustomDonutChartDefinition);

    },

    registerTidyTableTransformations(logger: ILogger, manager: ITidyTableTransformationManager) {

        manager.registerTransformation(TransformationCustom);
        manager.registerTransformation(TransfRendererCustom);
        manager.registerTransformation(TransformationRollingMeans);
        manager.registerTransformation(TransformationFireEvent);

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