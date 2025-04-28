import {ITidyColumn, ITidyTable, ITidyTableInteraction, IWidgetPublicContext} from "@ic3/reporting-api";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from '@amcharts/amcharts4/core'

export default abstract class AmCharts4Base<T> {
    /**
     * Base chart of the class
     */
    abstract readonly chart: am4charts.Chart;
    public readonly context: IWidgetPublicContext;
    public inter: ITidyTableInteraction;

    /**
     * Create an instance of the chart
     * @param context widget context. Used for determining the locale.
     * @param container html container to render the chart in.
     * @param table tidy table
     * @param inter interaction object
     * @param options chart options
     */
    public constructor(context: IWidgetPublicContext, container: HTMLDivElement, table: ITidyTable, inter: ITidyTableInteraction, options: T) {
        this.inter = inter;
        this.context = context;
    }

    /**
     * Called on data change. Update the chart.data and the columns (using 'setColumn') here.
     * @param table table with new data.
     * @param options options object.
     */
    public abstract onDataUpdated(table: ITidyTable, options: T): void;

    public abstract onInterUpdated(inter: ITidyTableInteraction): void;

    public setInter(inter: ITidyTableInteraction): void {
        this.inter = inter;
    }

    /**
     * Dispose/ destroy the chart.
     */
    public dispose() {
        this.chart && this.chart.dispose();
    }

    /**
     * Adds an event listener to a series in the chart. This function adds the selection and the
     * events to fire that are in 'getEventsToFire'.
     * @param sprite a amcharts series object.
     * @param rowKey the data key identifies the series in the chart data.
     */
    public addClickEventOnSprite(sprite: am4core.Sprite, rowKey: string) {
        sprite.events.off('hit');
        sprite.events.on('hit', event => {
            const dataItem = event.target?.dataItem;
            const row = this.getRowFromDataItem(dataItem, rowKey);
            if (row != null) {
                this.performInteraction(row, event.event);
            }
        }, this);
    }

    /**
     * Returns the row for a certain data item.
     * @param dataItem the data item of a sprite (bar, line, circle, etc..)
     * @param rowKey the data key identifies the series in the chart data.
     */
    public getRowFromDataItem(dataItem: unknown, rowKey: string): number | undefined {
        if (dataItem instanceof am4core.DataItem) {
            const dataContext = dataItem.dataContext;
            return (dataContext instanceof am4charts.TreeMapDataItem) ? (dataContext.dataContext as any)[rowKey] :
                (dataContext != null) ? (dataContext as any)[rowKey] :
                    undefined;
        }
        return undefined;
    }

    /**
     * Returns how the events in 'getEventRoles' are mapped to the columns.
     */
    public abstract getEventsToFire(): IFireEventMapping[];

    /**
     * Perform interactions on the chart. Possible interaction can be a selection,
     * a drilldown or the firing of an event.
     *
     * Available interactions are set via the 'Interactions' tab in the widget editor.
     *
     * @param rowIdx the index of the row.
     * @param mouseEvent the html mouse event of the click. Used for multiple selection using ctrl and shift.
     */
    private performInteraction(rowIdx: number, mouseEvent: MouseEvent | TouchEvent) {
        this.inter.handleRowHit(rowIdx, mouseEvent);
        for (const fire of this.getEventsToFire()) {
            fire.column && this.inter.fireEvent(fire.channel, fire.column, rowIdx);
        }
    }
}

export interface IFireEventMapping {
    column: ITidyColumn | ITidyColumn[] | undefined;
    channel: string;
}