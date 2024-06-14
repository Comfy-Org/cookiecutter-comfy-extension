# {{cookiecutter.project_slug}}

## {{cookiecutter.project_short_description}}

## Install

To install the extension, execute:

```bash
pip install {{cookiecutter.project_slug}}
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall {{cookiecutter.project_slug}}
```

## Develop

To install the dev dependencies and pre-commit (will run the ruff hook), do:

```bash
pip install -e .[dev]
pre-commit install
```

The `-e` flag above will result in a "live" install, in the sense that any changes you make to your node extension will automatically be picked up the next time you run ComfyUI.
