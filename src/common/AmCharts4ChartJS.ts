import {
    ITidyTable,
    ITidyTableInteraction,
    IWidgetPublicContext,
    IWidgetTemplateTidyData,
    WidgetRenderLayoutStatus
} from "@ic3/reporting-api";
import AmCharts4Base from "./AmCharts4Base";
import _ from "lodash";

type CreateBaseCallback<T> = (context: IWidgetPublicContext, container: any, table: ITidyTable, inter: ITidyTableInteraction, options: T) => AmCharts4Base<T>;

export class AmCharts4ChartJS<T> {

    private readonly container: any;
    private base?: AmCharts4Base<T>;
    private createBase: CreateBaseCallback<T>;
    private context: IWidgetPublicContext;
    private options?: T;
    private table?: ITidyTable;
    private inter?: ITidyTableInteraction;

    constructor(context: IWidgetPublicContext, container: any, createBase: CreateBaseCallback<T>) {
        this.container = container;
        this.createBase = createBase
        this.context = context;

        // Set typography
        const theme = this.context.getTheme();
        Object.keys(theme.typography.ic3.amCharts4).forEach(key => {
            const typoStyle = theme.typography.ic3.amCharts4[key];
            if (typoStyle != null) {
                this.container.style[key] = typoStyle;
            }
        });
    }

    renderJS(data: IWidgetTemplateTidyData, options: T, header: string) {

        if (this.base == null) {
            this.base = this.createBase(this.context, this.container, data.table, data.inter, options);
            this.base.chart.events.on("ready", () => {

                const nsId = this.context.getNsId();
                const widgetId = this.context.getWidgetId();

                const logger = this.context.logger();

                logger.infoWidget("AmCharts4", nsId, widgetId, "*** ready ***")

                this.context.onWidgetRenderStatusChange(WidgetRenderLayoutStatus.RENDERED);
            });
        }

        if (!_.isEqual(this.options, options)) {
            // Remake base
            this.dispose();
            this.options = options;
            this.base = this.createBase(this.context, this.container, data.table, data.inter, options);
        }

        if ( !_.isEqual(this.table, data.table)) {
            this.table = data.table;
            this.base.onDataUpdated(data.table, options);
        }

        if (!_.isEqual(this.inter, data.inter)) {
            this.base.setInter(data.inter);
            this.base.onInterUpdated(data.inter);
        }

    }

    dispose() {
        this.base?.dispose();
    }
}