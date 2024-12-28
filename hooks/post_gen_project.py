#!/usr/bin/env python
from pathlib import Path as Pth
import shutil
import subprocess


def init_git():
    """Initialize git repository and set up remote."""
    commands = [
        ["git", "init"],
        ["git", "branch", "-M", "main"],
        ["git", "remote", "add", "origin", "https://github.com/{{cookiecutter.__gh_slug}}.git"],
    ]
    
    for command in commands:
        try:
            subprocess.run(command, check=True)
            print(f"✓ Executed: {' '.join(command)}")
        except subprocess.CalledProcessError as e:
            print(f"× Failed to execute: {' '.join(command)}")
            print(f"Error: {e}")
            return False
    return True


if __name__ == "__main__":
    if "{{cookiecutter.open_source_license}}" == "Not open source":
        Pth("LICENSE").unlink()

    if "{{cookiecutter.__include_web}}" == "False":
        shutil.rmtree("web")

    if init_git():
        print("✓ Git repository initialized and remote configured")
    else:
        print("× Failed to initialize Git repository")
