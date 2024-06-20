"""Top-level package for {{cookiecutter.project_name}}."""

__all__ = [
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
]

__author__ = """{{cookiecutter.full_name}}"""
__email__ = "{{cookiecutter.email}}"
__version__ = "{{cookiecutter.version}}"

from .nodes import NODE_CLASS_MAPPINGS
from .nodes import NODE_DISPLAY_NAME_MAPPINGS
