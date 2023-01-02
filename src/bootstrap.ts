import PluginDefinition from "./PluginDefinition";
// import {DashboardsLoaderFrame} from '@ic3/reporting-api'

const plugin = PluginDefinition();
const info = "Exporting the plugin : " + plugin.id + " [v" + plugin.apiVersion.getInfo() + "]"

const elem = document.getElementById("info");
elem && (elem.innerHTML = info);

// dev: check no dependencies on @mui/material
// DashboardsLoaderFrame({
//     containerId: "info",
//     frameId: "ff",
//     onReady: () => {
//     },
//     url: "http://nowhere.com/icCube/report/console"
// });