# {{cookiecutter.project_name}}

## {{cookiecutter.project_short_description}}

Get started writing custom nodes without worrying about python project setup.

## Install

[Install](https://docs.comfy.org/get_started) ComfyUI first. Then look up this extension in [ComfyUI-Manager](https://github.com/ltdrdata/ComfyUI-Manager). If you are installing manually, clone this repository under `ComfyUI/custom_nodes`.


## Develop

To install the dev dependencies and pre-commit (will run the ruff hook), do:

```bash
cd {{cookiecutter.project_slug}}
pip install -e .[dev]
pre-commit install
```

The `-e` flag above will result in a "live" install, in the sense that any changes you make to your node extension will automatically be picked up the next time you run ComfyUI.

## Using Github

Install Github Desktop or follow these [instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) for ssh.

1. Create a Github repository that matches the directory name. 
2. Push the files to Git
```
git add .
git commit -m "project scaffolding"
git push
``` 

## comfy_types
ComfyUI exposes types that are very helpful when developing custom nodes. 

> 💡 **Hint:** To get the types in your modern IDE, you need to add your ComfyUI directory to the include paths. This repo has a [settings.json](.vscode/settings.json) with a template that you can use. Replace the ComfyUI path with your own.

## Tests

- [build-pipeline.yml](.github/workflows/build-pipeline.yml) will run pytest and linter
- [validate.yml](.github/workflows/validate.yml) will run [node-diff](https://github.com/Comfy-Org/node-diff) to check for breaking changes

## Publishing to Registry

If you wish to share this custom node with others in the community, you can publish it to the registry. We've already auto-populated some fields in `pyproject.toml` under `tool.comfy`, but please double-check if they are correct.

You need to make an account on https://registry.comfy.org and create an API key token.

- [ ] Go to the [registry](https://registry.comfy.org). Login and create a publisher id (everything after the `@` sign on your registry profile). 
- [ ] Add the publisher id into the pyproject.toml file.
- [ ] Create an api key on the Registry for publishing from Github. [Instructions](https://docs.comfy.org/registry/publishing#create-an-api-key-for-publishing).
- [ ] Add it to your Github Repository Secrets as `REGISTRY_ACCESS_TOKEN`.

A Github action will run on every git push. You can also run the Github action manually. Full instructions [here](https://docs.comfy.org/registry/publishing). Join our [discord](https://discord.com/invite/comfyorg) if you have any questions!

