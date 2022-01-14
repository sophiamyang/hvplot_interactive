![Python Versions](https://img.shields.io/badge/python-3.7%20%7C%203.8%20%7C%203.9-blue) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![Follow on Twitter](https://img.shields.io/twitter/follow/sophiamyang.svg?style=social)](https://twitter.com/sophiamyang) [![Follow on Twitter](https://img.shields.io/twitter/follow/MarcSkovMadsen.svg?style=social)](https://twitter.com/MarcSkovMadsen)

# Hvplot .interactive - The Easiest Way to Create an Interactive Dashboard

🐍🐼📈❤️

This repo supports the blog post

**The Easiest Way to Create an Interactive Dashboard in Python. Turn Pandas pipelines into a
dashboard using hvplot `.interactive`**

by Sophia Yang and Marc Skov Madsen

Check out the code and apps on

| Jupyter Notebook | Jupyter Labs | Panel Apps |
| - | - | - |
| [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/marcskovmadsen/hvplot_interactive/HEAD?filepath=hvplot_interactive.ipynb) | [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/marcskovmadsen/hvplot_interactive/HEAD?urlpath=lab/tree/hvplot_interactive.ipynb) | [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/marcskovmadsen/hvplot_interactive/HEAD?urlpath=panel) |

| Jupyter Notebook | Jupyter Labs | Panel Apps |
| - | - | - |
| [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/marcskovmadsen/hvplot_interactive/get-working-on-binder-and-colab?filepath=hvplot_interactive.ipynb) | [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/marcskovmadsen/hvplot_interactive/get-working-on-binder-and-colab?urlpath=lab/tree/hvplot_interactive.ipynb) | [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/marcskovmadsen/hvplot_interactive/get-working-on-binder-and-colab?urlpath=panel) |

https://colab.research.google.com/github/MarcSkovMadsen/hvplot_interactive/blob/get-working-on-binder-and-colab/hvplot_interactive.ipynb

![DataFrame App](assets/easy-dataframe-exploration.gif)

## Installation

You can use either conda or pip. Here we provide the instructions for conda.

### Basic

```bash
conda install hvplot panel pandas jupyterlab
```

### The right way: virtual environment and Jupyter preview

```bash
conda create --name hvplot_interactive -c conda-forge hvplot panel pandas jupyterlab jupyter-panel-proxy
conda activate hvplot_interactive
jupyter serverextension enable panel.io.jupyter_server_extension
```

You can replace `conda` with [`mamba`](https://github.com/mamba-org/mamba) for better performance.

### Run notebook

To run the notebook

```bash
jupyterlab hvplot_interactive.ipynb
```

If you installed `jupyter-panel-proxy`, then (on unix based systems) you can open the app at
http://localhost:8888/panel/

### Serve the app

To serve the app seperately with auto reload

```bash
panel serve hvplot_interactive.ipynb --autoreload --show
```

## License: MIT
