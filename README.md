## icCube Dashboards Plugin (Javascript/Typescript)

A working example of an icCube Dashboards plugin creating new widgets using plain Javascript/Typescript code
(i.e., no dependency on React).

Note that this plugin is demonstrating how to **filter the list of available widgets**. Check the `acceptWidget`
method in the `PluginDefinition.ts` file. This method is keeping both the icCube filters and the widgets defined
in this plugin.

This plugin is creating the following widgets:

**Simple Dropdown**

Create a new filter widget **from scratch**. This widget is demonstrating how to **lazy load** (Webpack code splitting)
the underlying Javascript library (datatables.net). Users can select an item from a dropdown list. On top of common
widget setup, this widget is demonstrating how
to [fire an event](https://github.com/ic3-software/ic3-reporting-api/blob/main/doc/plugin/Events.md).

**Simple Table**

Create a new table widget **from scratch**. On top of common widget setup, this widget is demonstrating both how to
[fire an event](https://github.com/ic3-software/ic3-reporting-api/blob/main/doc/plugin/Events.md) and how to handle
the [selection](https://github.com/ic3-software/ic3-reporting-api/blob/main/doc/plugin/Interactions.md). It also creates
a **transformation** that is appending some text to each value of a column.

**Custom Table**

Create a new table widget from the **existing icCube table widget**. This widget is demonstrating how to reuse existing
widgets: hiding/changing existing editor options, adding new editor options.

**Custom Donut Chart**

Create a new chart widget from the **existing icCube Donut chart widget**. This widget is demonstrating how to reuse an
existing amCharts 4 widget (i.e., the Donut chart).

**Transformations**

It also creates two **transformations** :

`TransformationCustom` defines a transformation that modifies the tidy table values. It is appending some text to
each value of a column.

`TransfRendererCustom` defines a cell renderer to be used in the Table - and PivoTable widgets.

### Getting Started

Clone that Git repository that is proposing a common Javascript/Typescript project using Webpack.

Use `npm` to install the dependencies:

    npm install

The `package.json` file is containing common scripts:

    start   : start a Webpack dev. server listening @4000 
    build   : build the plugin into the /dist directory
    zip     : zip the /dist directory to deploy into an icCube server
    clean   : delete /dist /kit directories.

A JetBrains IntelliJ project is available for a quick start.

### MyPluginJS Renaming

This example is creating a plugin named `MyPluginJS`. Before starting hacking the code we advise searching and replacing
the string `MyPluginJS` by the actual name you'd like to give to your plugin.

Keep that name simple (i.e., ASCII letter without any space, separator, etc...) as it will be used as a folder name
(once deployed into an icCube server), Webpack module name, localization id, etc... That name must be unique across all
the plugins loaded into an icCube server.

### Develop

This example starts and shares the module `MyPluginJS` @ `localhost:4000` (see `webpack.dev.js` file).

Refer to this [page](https://github.com/ic3-software/ic3-reporting-api/blob/master/doc/plugin/Develop.md)
that is explaining how to develop the plugin.

### Build/Deploy

Refer to this [page](https://github.com/ic3-software/ic3-reporting-api/blob/master/doc/plugin/Deploy.md)
that is explaining how to deploy the plugin.

### Documentation

See this [page](https://github.com/ic3-software/ic3-reporting-api/blob/master/doc/plugin/Overview.md)
for a detailed documentation of the dev. kit.

_
