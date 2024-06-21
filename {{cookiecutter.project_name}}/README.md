# {{cookiecutter.project_name}}

## {{cookiecutter.project_short_description}}

## Install

After you download this extension, you can install it with:

```bash
cd {{cookiecutter.project_name}}
pip install .
```

To install the latest version of the extension from github:

```bash
pip install {{cookiecutter.project_name}}@git+https://github.com/{{cookiecutter.__gh_slug}}
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall {{cookiecutter.project_name}}
```

## Develop

To install the dev dependencies and pre-commit (will run the ruff hook), do:

```bash
cd {{cookiecutter.project_name}}
pip install -e .[dev]
pre-commit install
```

The `-e` flag above will result in a "live" install, in the sense that any changes you make to your node extension will automatically be picked up the next time you run ComfyUI.
