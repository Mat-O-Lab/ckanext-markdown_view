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
        resource = {}
        try:
            resource = toolkit.get_action("resource_show")({}, {"id": id})
        except (toolkit.ObjectNotFound, toolkit.NotAuthorized):
            base.abort(404, "Resource not found")

        return base.render(
            "markdown_view/highlight.html",
            extra_vars={"resource": resource},
        )

    def post(self, pkg_id: str, id: str):
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
        # Get the file contents using the CKAN API
        res_is = str(resource["id"])
        # file_contents = registry.action.datastore_search_sql(

        #     sql=f'SELECT * FROM "{res_is}"'
        # )["records"]
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
