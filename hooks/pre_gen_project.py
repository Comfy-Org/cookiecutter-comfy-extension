import re
import sys
import subprocess
import os
from pathlib import Path

def init_submodules():
    """Initialize and update git submodules if .gitmodules exists."""
    commands = [
        ["git", "submodule", "init"],
        ["git", "submodule", "update", "--recursive"]
    ]

    user_home = Path.home()
    template_dir = user_home / ".cookiecutters" / "cookiecutter-comfy-extension"

    for command in commands:
        try:
            result = subprocess.run(
                command,
                check=True,
                capture_output=True,
                text=True,
                cwd=template_dir
            )
            print(f"✓ Executed: {' '.join(command)}")
            if result.stdout.strip():
                print(f"  Output: {result.stdout.strip()}")

        except subprocess.CalledProcessError as e:
            print(f"× Failed to execute: {' '.join(command)}")
            print(f"  Error: {e}")
            if e.stderr:
                print(f"  Stderr: {e.stderr}")
            print("  Continuing despite submodule error...")
            return False
        except FileNotFoundError:
            print("× Git not found in PATH")
            print("  Please ensure Git is installed and available")
            return False

    print("✓ Submodules initialized successfully")
    return True


def validate_project_name():
    """Validate that the project slug is a valid Python module name."""
    MODULE_REGEX = r'^[_a-zA-Z][_a-zA-Z0-9]+$'
    module_name = '{{ cookiecutter.project_slug}}'

    if not re.match(MODULE_REGEX, module_name):
        print('ERROR: The project slug (%s) is not a valid Python module name. '
              'Please do not use a - and use _ instead' % module_name)
        return False

    print(f"✓ Project slug '{module_name}' is valid")
    return True


if __name__ == "__main__":
    template_source = "{{ cookiecutter._template }}"
    frontend_type = "{{cookiecutter.frontend_type}}"

    if template_source.startswith("gh:") and (frontend_type == "react" or frontend_type == "vue"):
        submodule_success = init_submodules()

        if not submodule_success:
            print("⚠️  Warning: Submodule initialization failed, but continuing...")
            sys.exit(1)

    name_valid = validate_project_name()

    if not name_valid:
        sys.exit(1)

    print("=== Pre-generation setup complete ===")
