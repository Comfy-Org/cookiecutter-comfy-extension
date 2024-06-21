#!/usr/bin/env python
from pathlib import Path as Pth
import shutil


if __name__ == "__main__":
    if "{{cookiecutter.open_source_license}}" == "Not open source":
        Pth("LICENSE").unlink()

    if "{{cookiecutter.__include_web}}" == "False":
        shutil.rmtree("src/{{cookiecutter.project_slug}}/web")
