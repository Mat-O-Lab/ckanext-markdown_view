from flask import Blueprint
from flask.views import MethodView
import ckan.plugins.toolkit as toolkit
import ckan.lib.helpers as core_helpers
import ckan.lib.base as base
from flask import request

log = __import__("logging").getLogger(__name__)


blueprint = Blueprint("markdown_view", __name__)


class HighlightView(MethodView):
    def get(self, pkg_id: str, id: str, start: int=0, end: int=0):
        """Get rendered Markdown with the possibility to highlight a section by pointing out the start and end of the markdown slice to highlight.

        Args:
            pkg_id (str): dataset id
            id (str): ressource id of the markdown file
            start (int, optional): start of the markdown strings slice to highlight. Defaults to 0.
            end (int, optional): start of the markdown strings slice to highlight. Defaults to 0.

        Returns:
            html: rendered markdown as html site
        """
        from ckanext.markdown_view.plugin import DEFAULT_FORMATS

        resource = {}
        try:
            resource = toolkit.get_action("resource_show")({}, {"id": id})
        except (toolkit.ObjectNotFound, toolkit.NotAuthorized):
            base.abort(404, "Resource not found")
        # if (
        #     resource.get("format", "").lower() in DEFAULT_FORMATS
        #     or resource["url"].split(".")[-1] in DEFAULT_FORMATS
        # ):
        #     base.abort(422, "Not a Markdown File")
        return base.render(
            "markdown_view/highlight.html",
            extra_vars={"resource": resource, 
                        "start_index": start,
                        "end_index": end,
                        },
        )

    def post(self, pkg_id: str, id: str):
        from ckanext.markdown_view.plugin import DEFAULT_FORMATS

        resource = {}
        highlight = ""
        if "highlight" in request.form:
            highlight = request.form.get("highlight")
            log.info("text to highlight: {}".format(highlight))
        # highlight = request.form.keys()
        try:
            resource = toolkit.get_action("resource_show")({}, {"id": id})
        except (toolkit.ObjectNotFound, toolkit.NotAuthorized):
            base.abort(404, "Resource not found")
        # if (
        #     resource.get("format", "").lower() in DEFAULT_FORMATS
        #     or resource["url"].split(".")[-1] in DEFAULT_FORMATS
        # ):
        #     base.abort(422, "Not a Markdown File")
        return base.render(
            "markdown_view/highlight.html",
            extra_vars={
                "resource": resource,
                "highlight": highlight,
            },
        )

blueprint.add_url_rule(
    "/dataset/<pkg_id>/resource/<id>/markdown",
    defaults={'start': 0, 'end': 0},
    view_func=HighlightView.as_view(str("markdown")),
)

blueprint.add_url_rule(
    "/dataset/<pkg_id>/resource/<id>/highlight/<int:start>/<int:end>",
    view_func=HighlightView.as_view(str("highlight")),
)


def get_blueprint():
    return blueprint
