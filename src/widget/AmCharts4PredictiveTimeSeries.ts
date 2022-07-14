import {
    ITidyDateColumn,
    ITidyNumericColumn,
    ITidyTable,
    ITidyTableInteraction,
    IWidgetPublicContext
} from "@ic3/reporting-api";
import * as am4charts from "@amcharts/amcharts4/charts";
import {CircleBullet} from "@amcharts/amcharts4/charts";
import * as am4core from '@amcharts/amcharts4/core'
import AmCharts4Base, {IFireEventMapping} from "../common/AmCharts4Base";
import {AmCharts4ChartJS} from "../common/AmCharts4ChartJS";
import {createAmCharts4WidgetTemplateDefinitionJS} from "../common/AmCharts4DefinitionJS";
import {PredictiveTimeSeriesOptions} from "./AmCharts4PredictiveTimeSeriesDefinition";

export class AmCharts4PredictiveTimeSeries extends AmCharts4Base<PredictiveTimeSeriesOptions> {

    readonly chart: am4charts.Chart;
    private xAxis: ITidyDateColumn;
    private value: ITidyNumericColumn;
    private rolling1?: ITidyNumericColumn;
    private rolling2?: ITidyNumericColumn;

    private readonly dots: CircleBullet;

    constructor(context: IWidgetPublicContext, container: HTMLDivElement, table: ITidyTable, inter: ITidyTableInteraction, options: PredictiveTimeSeriesOptions) {
        super(context, container, table, inter, options);

        this.xAxis = table.getColumnByAlias('xAxis');
        this.rolling1 = table.getOptionalColumnByAlias('rolling1');
        this.rolling2 = table.getOptionalColumnByAlias('rolling2');
        this.value = table.getColumnByAlias('value');

        const chart = am4core.create(container, am4charts.XYChart);
        chart.seriesContainer.zIndex = 10;
        chart.data = this.getChartData(table);

        const categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
        categoryAxis.dataFields.data = 'xAxis';
        categoryAxis.renderer.minGridDistance = 60;

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        if (valueAxis.tooltip)
            valueAxis.tooltip.disabled = true;

        // Points
        const pointSeries = chart.series.push(new am4charts.LineSeries());
        const color = am4core.color(this.value.getColor(0) ?? "#9f9f9f");
        pointSeries.dataFields.dateX = "xAxis";
        pointSeries.dataFields.valueY = "value";
        pointSeries.tooltipText = "{name}: {value}";
        pointSeries.strokeWidth = 0;
        pointSeries.name = this.value.getCaption();
        pointSeries.fill = color;
        const bullet = pointSeries.bullets.push(new am4charts.CircleBullet());
        bullet.circle.radius = 3;
        bullet.fill = color;
        bullet.strokeWidth = 0;
        bullet.fillOpacity = 1;
        this.addClickEventOnSprite(bullet, "tidyRow");
        this.dots = bullet;

        const activeState = bullet.states.create('selected');
        activeState.properties.fill = am4core.color("#ff00fb");
        activeState.properties.fillOpacity = 1;

        const unselectedState = bullet.states.create('unselected');
        unselectedState.properties.fillOpacity = 0.3;

        // Rolling 1
        if (this.rolling1 != null) {
            const series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = "xAxis";
            series.dataFields.valueY = "rolling1";
            series.tooltipText = "{name}: {rolling1}";
            series.strokeWidth = 2;
            const color = am4core.color(this.rolling1.getColor(0) ?? "#3caaff");
            series.fill = color;
            series.stroke = color;
            series.name = this.rolling1.getCaption();
        }

        // Rolling 2
        if (this.rolling2 != null) {
            const series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = "xAxis";
            series.dataFields.valueY = "rolling2";
            series.tooltipText = "{name}: {rolling2}";
            series.strokeWidth = 2;
            const color = am4core.color(this.rolling2.getColor(0) ?? "#8d0000");
            series.fill = color;
            series.stroke = color;
            series.name = this.rolling2.getCaption();
        }

        chart.cursor = new am4charts.XYCursor();

        // Legend
        chart.legend = new am4charts.Legend();

        this.chart = chart;
    }

    getEventsToFire(): IFireEventMapping[] {
        return [{
            column: this.xAxis,
            channel: 'clicked-xAxis'
        }];
    }

    onDataUpdated(table: ITidyTable, options: PredictiveTimeSeriesOptions) {
        this.xAxis = table.getColumnByAlias('xAxis');
        this.value = table.getColumnByAlias('value');
        this.rolling2 = table.getOptionalColumnByAlias('rolling2');
        this.rolling1 = table.getOptionalColumnByAlias('rolling1');
        this.chart.data = this.getChartData(table);
    }

    getChartData(table: ITidyTable) {

        return table.mapRows(rowIdx => {
            return {
                xAxis: this.xAxis.getValue(rowIdx),
                value: this.value.getValue(rowIdx),
                rolling1: this.rolling1?.getValue(rowIdx),
                rolling2: this.rolling2?.getValue(rowIdx),
                tidyRow: rowIdx
            }
        });
    }

    onInterUpdated(inter: ITidyTableInteraction): void {
        this.dots.clones.each(bullet => {
            const rowIdx = this.getRowFromDataItem(bullet.dataItem, "tidyRow");

            if (inter.isSelectionEmpty()) {
                bullet.setState('default');
                return;
            }

            if (rowIdx != null) {
                const isSelected = inter.isSelected(rowIdx);

                if (isSelected) {
                    bullet.setState('default');  // Set to default state first to reset sprite settings.
                    bullet.setState('selected');
                } else {
                    bullet.setState('default');  // Set to default state first to reset sprite settings.
                    bullet.setState('unselected');
                }
            }
        });
    }

}

const Amcharts4PredictiveTimeSeries = createAmCharts4WidgetTemplateDefinitionJS({

    jsCode: (context: IWidgetPublicContext, container: any) => {
        return new AmCharts4ChartJS(
            context,
            container,
            (context: IWidgetPublicContext, container: any, table: ITidyTable, inter: ITidyTableInteraction, options: PredictiveTimeSeriesOptions) => {
                return new AmCharts4PredictiveTimeSeries(context, container, table, inter, options)
            }
        );
    },

});

export default Amcharts4PredictiveTimeSeries;