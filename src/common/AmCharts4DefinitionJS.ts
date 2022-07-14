import {FormFieldObject} from "@ic3/reporting-api";
import * as am4core from "@amcharts/amcharts4/core";
import { AmCharts4WidgetTemplateDefinitionJS } from "./AmCharts4Definition";

export function createAmCharts4WidgetTemplateDefinitionJS<T extends FormFieldObject>(definition: Omit<AmCharts4WidgetTemplateDefinitionJS<T>, "registerAmCharts4">): AmCharts4WidgetTemplateDefinitionJS<T> {

    return {

        ...definition,

        registerAmCharts4(callback: (am4core: unknown) => void) {

            console.log("[amCharts4] registerAmCharts4")

            callback(am4core);

        },

    }
}


