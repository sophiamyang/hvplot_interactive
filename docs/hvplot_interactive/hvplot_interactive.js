importScripts("https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js");

function sendPatch(patch, buffers, msg_id) {
  self.postMessage({
    type: 'patch',
    patch: patch,
    buffers: buffers
  })
}

async function startApplication() {
  console.log("Loading pyodide!");
  self.postMessage({type: 'status', msg: 'Loading pyodide'})
  self.pyodide = await loadPyodide();
  self.pyodide.globals.set("sendPatch", sendPatch);
  console.log("Loaded!");
  await self.pyodide.loadPackage("micropip");
  const env_spec = ['https://cdn.holoviz.org/panel/0.14.0/dist/wheels/bokeh-2.4.3-py3-none-any.whl', 'https://cdn.holoviz.org/panel/0.14.0/dist/wheels/panel-0.14.0-py3-none-any.whl', 'holoviews>=1.15.1', 'holoviews>=1.15.1', 'hvplot', 'pandas']
  for (const pkg of env_spec) {
    const pkg_name = pkg.split('/').slice(-1)[0].split('-')[0]
    self.postMessage({type: 'status', msg: `Installing ${pkg_name}`})
    await self.pyodide.runPythonAsync(`
      import micropip
      await micropip.install('${pkg}');
    `);
  }
  console.log("Packages loaded!");
  self.postMessage({type: 'status', msg: 'Executing code'})
  const code = `
  
import asyncio

from panel.io.pyodide import init_doc, write_doc

init_doc()

#!/usr/bin/env python
# coding: utf-8

# # The Easiest Way to Create an Interactive Dashboard in Python
# 
# This notebook supports the blog post
# 
# **The Easiest Way to Create an Interactive Dashboard in Python. Turn Pandas pipelines into a
# dashboard using hvplot \`.interactive\`**
# 
# by *Sophia Yang* and *Marc Skov Madsen*.
# 
# ![Data App](assets/easy-dataframe-dashboards.gif)
# 
# Source: https://github.com/sophiamyang/hvplot_interactive

# ## Import and configure packages
# 
# Please note that in **Colab** you will need to \`!pip install panel hvplot\`.

# In[ ]:


# !pip install panel==0.12.6 hvplot==0.7.3


# In[ ]:


import panel as pn

pn.extension('tabulator', sizing_mode="stretch_width")


# In[ ]:


import hvplot.pandas
import holoviews as hv

hv.extension('bokeh')


# ## Define function to determine environment

# In[ ]:


def environment():
    try:
        get_ipython()
        return "notebook"
    except:
        return "server"
environment()


# ## Define Color Palette

# In[ ]:


PALETTE = ["#ff6f69", "#ffcc5c", "#88d8b0", ]
pn.Row(
    pn.layout.HSpacer(height=50, background=PALETTE[0]),
    pn.layout.HSpacer(height=50, background=PALETTE[1]),
    pn.layout.HSpacer(height=50, background=PALETTE[2]),
)


# ## Load Data

# In[ ]:


from bokeh.sampledata.autompg import autompg_clean as df
df.head()


# ## Define DataFrame Pipeline

# In[ ]:


(
    df[
        (df.cyl == 4) & 
        (df.mfr.isin(['ford','chevrolet']))
    ]
    .groupby(['origin', 'cyl', 'mfr', 'yr'])['hp'].mean()
    .to_frame()
    .reset_index()
    .sort_values(by='yr')
).head(1)


# ## Make DataFrame Pipeline Interactive

# In[ ]:


idf = df.interactive()


# Define [Panel widgets](https://panel.holoviz.org/reference/index.html#widgets)

# In[ ]:


cylinders = pn.widgets.IntSlider(name='Cylinders', start=4, end=8, step=2)
mfr = pn.widgets.ToggleGroup(
    name='MFR',
    options=['ford', 'chevrolet', 'honda', 'toyota', 'audi'], 
    value=['ford', 'chevrolet', 'honda', 'toyota', 'audi'],
    button_type='success')
yaxis = pn.widgets.RadioButtonGroup(
    name='Y axis', 
    options=['hp', 'weight'],
    button_type='success'
)


# Combine pipeline and widgets

# In[ ]:


ipipeline = (
    idf[
        (idf.cyl == cylinders) & 
        (idf.mfr.isin(mfr))
    ]
    .groupby(['origin', 'mpg'])[yaxis].mean()
    .to_frame()
    .reset_index()
    .sort_values(by='mpg')  
    .reset_index(drop=True)
)
ipipeline.head()


# ## Pipe to Table

# In[ ]:


if environment()=="server":
   theme="fast"
else:
   theme="simple"


# In[ ]:


itable = ipipeline.pipe(pn.widgets.Tabulator, pagination='remote', page_size=10)
itable


# Check out the [Tabulator Reference Guide](https://panel.holoviz.org/reference/widgets/Tabulator.html) for more inspiration.

# ## Pipe to hvplot

# In[ ]:


ihvplot = ipipeline.hvplot(x='mpg', y=yaxis, by='origin', color=PALETTE, line_width=6, height=400)
ihvplot


# ## Layout using Template
# 
# Here we use the [FastListTemplate](https://panel.holoviz.org/reference/templates/FastListTemplate.html#templates-gallery-fastlisttemplate).

# In[ ]:


template = pn.template.FastListTemplate(
    title='Interactive DataFrame Dashboards with hvplot .interactive', 
    sidebar=[cylinders, 'Manufacturers', mfr, 'Y axis' , yaxis],
    main=[ihvplot.panel(), itable.panel()],
    accent_base_color="#88d8b0",
    header_background="#88d8b0",
)
# template.show()
template.servable();


# Please note that to get the Tabulator table styled nicely for dark mode you can set \`theme='fast'\` when you define the \`itable\`. It won't work in the notebook though.
# 
# To *serve the notebook* run \`panel serve hvplot_interactive.ipynb\`.


await write_doc()
  `
  const [docs_json, render_items, root_ids] = await self.pyodide.runPythonAsync(code)
  self.postMessage({
    type: 'render',
    docs_json: docs_json,
    render_items: render_items,
    root_ids: root_ids
  });
}

self.onmessage = async (event) => {
  const msg = event.data
  if (msg.type === 'rendered') {
    self.pyodide.runPythonAsync(`
    from panel.io.state import state
    from panel.io.pyodide import _link_docs_worker

    _link_docs_worker(state.curdoc, sendPatch, setter='js')
    `)
  } else if (msg.type === 'patch') {
    self.pyodide.runPythonAsync(`
    import json

    state.curdoc.apply_json_patch(json.loads('${msg.patch}'), setter='js')
    `)
    self.postMessage({type: 'idle'})
  } else if (msg.type === 'location') {
    self.pyodide.runPythonAsync(`
    import json
    from panel.io.state import state
    from panel.util import edit_readonly
    if state.location:
        loc_data = json.loads("""${msg.location}""")
        with edit_readonly(state.location):
            state.location.param.update({
                k: v for k, v in loc_data.items() if k in state.location.param
            })
    `)
  }
}

startApplication()