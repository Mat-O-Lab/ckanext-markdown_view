# encoding: utf-8
from __future__ import annotations


from typing import Any
from ckan.common import CKANConfig
import logging, os

import ckan.plugins as p

if p.toolkit.check_ckan_version("2.10"):
    from ckan.types import Context
else:

    class Context(dict):
        def __init__(self, **kwargs):
            super().__init__(**kwargs)


from ckanext.markdown_view import views

log = logging.getLogger(__name__)
ignore_empty = p.toolkit.get_validator("ignore_empty")
unicode_safe = p.toolkit.get_validator("unicode_safe")

# from ckanext.markdown_view import helpers, views

log = logging.getLogger(__name__)

DEFAULT_FORMATS = (
    os.environ.get("CKANINI__CKANEXT__MARKDOWN__FORMATS", "").lower().split()
)
if not DEFAULT_FORMATS:
    DEFAULT_FORMATS = ["text/markdown", "md"]


class MarkdownViewPlugin(p.SingletonPlugin):
    p.implements(p.IConfigurer)
    p.implements(p.IResourceView, inherit=True)
    p.implements(p.IBlueprint)
    # IConfigurer

    def update_config(self, config: CKANConfig):
        # required_keys = "ckanext.markdown_view.url ckanext.markdown_view.username ckanext.markdown_view.password ckanext.markdown_view.formats"
        # for key in required_keys.split():
        #     if config.get(key) is None:
        #         # check if in envars
        #         env_str = "CKANINI__" + key.replace(".", "__").upper()
        #         if not os.environ.get(env_str, None):
        #             raise RuntimeError(
        #                 "Required configuration option {0} not found in ckan.ini or ENVARS.".format(
        #                     key
        #                 )
        #             )
        # self.config = config
        p.toolkit.add_template_directory(config, "templates")
        p.toolkit.add_public_directory(config, "public")
        # p.toolkit.add_resource("assets", "markdown_view")

    def info(self) -> dict[str, Any]:
        return {
            "name": "markdown_view",
            "title": p.toolkit._("Markdown"),
            "schema": {"page_url": [ignore_empty, unicode_safe]},
            "iframed": False,
            "icon": "book-reader",
            "always_available": True,
            "default_title": p.toolkit._("Markdown"),
        }

    def can_view(self, data_dict: dict[str, Any]):

        resource = data_dict["resource"]
        return (
            resource.get("format", "").lower() in DEFAULT_FORMATS
            or resource["url"].split(".")[-1] in DEFAULT_FORMATS
        )

    def view_template(self, context: Context, data_dict: dict[str, Any]):
        return "markdown_view/markdown_view.html"

    def form_template(self, context: Context, data_dict: dict[str, Any]):
        return "markdown_view/markdown_view_form.html"

    # IBlueprint

    def get_blueprint(self):
        return views.get_blueprint()
