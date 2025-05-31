import os
import server
from aiohttp import web
import folder_paths
import nodes

NODE_CLASS_MAPPINGS = {}
__all__ = ["NODE_CLASS_MAPPINGS"]

# Define the path to our extension
workspace_path = os.path.dirname(__file__)
dist_path = os.path.join(workspace_path, "dist/example_ext")
dist_locales_path = os.path.join(workspace_path, "dist/locales")

# Print the current paths for debugging
print(f"{{cookiecutter.project_name}} workspace path: {workspace_path}")
print(f"Dist path: {dist_path}")
print(f"Dist locales path: {dist_locales_path}")
print(f"Locales exist: {os.path.exists(dist_locales_path)}")

# Register the static route for serving our React app assets
if os.path.exists(dist_path):
    # Add the routes for the extension
    server.PromptServer.instance.app.add_routes([
        web.static("/example_ext/", dist_path),
    ])

    # Register the locale files route
    if os.path.exists(dist_locales_path):
        server.PromptServer.instance.app.add_routes([
            web.static("/locales/", dist_locales_path),
        ])
        print(f"Registered locale files route at /locales/")
    else:
        print("WARNING: Locale directory not found!")

    # Also register the standard ComfyUI extension web directory
    nodes.EXTENSION_WEB_DIRS["{{cookiecutter.project_slug}}"] = os.path.join(workspace_path, "dist")
else:
    print("ComfyUI Example React Extension: Web directory not found")
