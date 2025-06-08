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


def replace_text_in_files(files_to_replace, replacements):
    """Replace text in specified files."""
    for file_path in files_to_replace:
        file_path = Pth(file_path)
        if file_path.exists() and file_path.is_file():
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                for old_text, new_text in replacements.items():
                    content = content.replace(old_text, new_text)

                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

                print(f"✓ Replaced text in: {file_path}")
            except Exception as e:
                print(f"× Failed to replace text in {file_path}: {e}")
        else:
            print(f"× File not found: {file_path}")


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
                # Skip git-related files when copying from react template
                if item.name in [".git", ".gitmodules", ".gitignore"]:
                    continue

                target = Pth(item.name)
                if item.is_file():
                    shutil.copy2(item, target)
                    print(f"✓ Copied file: {item} -> {target}")
                else:
                    if target.exists():
                        shutil.rmtree(target)
                    shutil.copytree(item, target, ignore=shutil.ignore_patterns('.git', '.gitmodules', ".gitignore"))
                    print(f"✓ Copied directory: {item} -> {target}")

            files_to_replace = [
                "README.md",
                "ui/package.json",
            ]

            replacements = {
                "ComfyUI React Extension Template": "{{cookiecutter.project_name}}",
                "ComfyUI-React-Extension-Template": "{{cookiecutter.project_slug}}",
                "comfyui-example-react-extension": "{{cookiecutter.project_slug}}",
                "Comfy-Org": "{{cookiecutter.github_username}}",
                "MIT": "{{cookiecutter.open_source_license}}",
                '"version": "0.1.0"': '"version": "{{cookiecutter.version}}"',
            }

            replace_text_in_files(files_to_replace, replacements)

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
