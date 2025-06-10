from flask import Blueprint
from flask.views import MethodView
import ckan.plugins.toolkit as toolkit
import ckan.lib.helpers as core_helpers
import ckan.lib.base as base
from flask import request

log = __import__("logging").getLogger(__name__)


blueprint = Blueprint("markdown_view", __name__)


class HighlightView(MethodView):
    def get(self, pkg_id: str, id: str):
        from ckanext.markdown_view.plugin import DEFAULT_FORMATS

        resource = {}
        start_index = int(request.args.get("start", 0))  # Startindex aus den URL-Parametern
        end_index = int(request.args.get("end", 0))    # Endindex aus den URL-Parametern
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
                        "start_index": start_index,
                        "end_index": end_index,
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
    "/dataset/<pkg_id>/resource/<id>/highlight",
    view_func=HighlightView.as_view(str("highlight")),
)


def get_blueprint():
    return blueprint
