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

def setup_project_structure():
    frontend_type = "{{cookiecutter.frontend_type}}"

    if frontend_type == "no" or frontend_type == "js":
        if Pth("custom-nodes-template").exists():
            for item in Pth("custom-nodes-template").iterdir():
                target = Pth(item.name)
                if item.is_file():
                    shutil.copy2(item, target)
                else:
                    if target.exists():
                        shutil.rmtree(target)
                    shutil.copytree(item, target)
                    print(f"✓ Copied directory: {item} -> {target}")

        if Pth("react-extension-template").exists():
            shutil.rmtree("react-extension-template")
            print("✓ Removed react-extension-template directory")

    elif frontend_type == "react":
        if Pth("react-extension-template").exists():
            print("✓ Found react-extension-template directory")
            for item in Pth("react-extension-template").iterdir():
                target = Pth(item.name)
                if item.is_file():
                    shutil.copy2(item, target)
                    print(f"✓ Copied file: {item} -> {target}")
                else:
                    if target.exists():
                        shutil.rmtree(target)
                    shutil.copytree(item, target)
                    print(f"✓ Copied directory: {item} -> {target}")

        if Pth("custom-nodes-template").exists():
            shutil.rmtree("custom-nodes-template")
            print("✓ Removed custom-nodes-template directory")

    if Pth("common").exists():
        print("✓ Found common directory")
        for item in Pth("common").iterdir():
            if item.is_file():
                shutil.copy2(item, ".")
                print(f"✓ Copied common file: {item}")

    for template_dir in ["common", "custom-nodes-template", "react-extension-template"]:
        if Pth(template_dir).exists():
            shutil.rmtree(template_dir)
            print(f"✓ Cleaned up: {template_dir}")

if __name__ == "__main__":
    setup_project_structure()

    if "{{cookiecutter.open_source_license}}" == "Not open source":
        Pth("LICENSE").unlink()

    frontend_type = "{{cookiecutter.frontend_type}}"

    if frontend_type == "no":
        web_dir = Pth("web")
        if web_dir.exists():
            shutil.rmtree("web")

    if init_git():
        print("✓ Git repository initialized and remote configured")
    else:
        print("× Failed to initialize Git repository")
