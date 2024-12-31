# cookiecutter-comfy-extension

## Get started writing custom nodes in one step without setting up a ton of Python project config.

An opinionated way to develop ComfyUI custom nodes. Uses cookiecutter to scaffold a python project.

This template helps you 

## Usage

- First install `cookiecutter`:

  ```bash
  # pipx is strongly recommended
  pipx install cookiecutter

  # if pipx is not an option, you can install cookiecutter in your Python user directory.
  python -m pip install --user cookiecutter
  ```

- Run `cookiecutter` with this template:

  ```bash
  # if you installed cookiecutter with pipx
  pipx run cookiecutter gh:comfy-org/cookiecutter-comfy-extension

  # if you installed cookiecutter with pip
  cookiecutter gh:comfy-org/cookiecutter-comfy-extension

  # initialize git repo in your new project
  cd <your-project-name>
  git init
  ```

## Features

The resulting ComfyUI node extension project will automatically come with a few neat features:

- Support for Ruff linter and various recommended rules
- A pre-commit hook for the Ruff linter
- An optional `web` directory if your extension will include custom javascript
  - If selected, `web` will also be added to the project's `MANIFEST.in` to ensure that any non-python code in `web` will also be correctly installed
- Testing via PyTest (check the `tests/` directory)
- A Github Action that will automatically run any unit tests as part of Pull Requests made against your project
- A Github Action to diff your changes for backwards incompatible changes: (node-diff)[https://github.com/Comfy-Org/node-diff]
- A Github Action to publish to the Comfy Registry
