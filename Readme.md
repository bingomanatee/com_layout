A layout component for nuby-exress.js. 

## nuby-express.js Layouts

One or more layouts can be created in a "layout" folder. This folder can exist in any component, 
including the root of the NE project. Once defined and loaded a layout can be selected by setting the "layout_name" 
property of the config file. A layout name can also be specificied dynamically in the body of an action
by specifying the "layout_name" property of the output. 

Layouts only apply to rendered content. Raw JSON output through rs.send(props) do not get enclosed in layouts. 

### Required:

 * *view/template.html* : the actual template: must have a `<%- body %>` insert. the _*view*_ directory can contain other bound templates.

## Optional: 

 * *config.json* : a JSON file with the following (optional) properties: 
 *  * *name* : (string) the name by which the layout can be called in actions; by default, the name of the layout folder
 *  * *prefix_path* : the URL prefix to static files in the (optional) public folder. 
 
 * _*public*_ : a directory of static resources, optionally prefixed by the configuration above. 
 
## Scope

Layouts, once loaded, can be accessed by any action in the project.
There is no cross-component namespacing of layouts, so uniqueness of layouts has to be enforced by you.

-------

There are two basic layouts included with this component: empty and html. 

 * __empty__ is a layout suitable for non-html output (xml, JSON, file data); 
   the raw body data is output without any encapsulating contentt. 
 * __html__ is an unstyled layout that is a good starting point for a custom layout.
   It works with the css/flash/js view helpers to transport named resources into your layout. 

The Admin and Blog components have more extensive examples of layout usage. 