"""Top-level package for {{cookiecutter.project_slug}}."""

__all__ = [
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
    {% if cookiecutter.__include_web -%}
    "WEB_DIRECTORY",
    {%- endif %}
]

__author__ = """{{cookiecutter.full_name}}"""
__email__ = "{{cookiecutter.email}}"
__version__ = "{{cookiecutter.version}}"

from src.{{cookiecutter.project_slug}}.nodes import NODE_CLASS_MAPPINGS
from src.{{cookiecutter.project_slug}}.nodes import NODE_DISPLAY_NAME_MAPPINGS

{% if cookiecutter.__include_web -%}
WEB_DIRECTORY = "./web"
{%- endif %}
