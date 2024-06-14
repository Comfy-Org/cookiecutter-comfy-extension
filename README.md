# cookiecutter-comfy-extension

## A cookiecutter template for writing a ComfyUI custom node extension

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

- Support for Ruff linter
- A pre-commit hook for the Ruff linter
- An `entry_point` that will ensure that ComfyUI can load your extension regardless of how it's installed

In progress (still needs a little work):
- Testing via PyTest, including a basic integration/sanity check
- A git action that will automatically run any tests as part of Pull Requests made against your project
