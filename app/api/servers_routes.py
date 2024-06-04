from flask import Blueprint, request
from app.models import db, Server, User
from flask_login import current_user, login_required
from app.forms import CreateServerForm

servers_routes = Blueprint("servers", __name__)


@servers_routes.route("/")
@login_required
def all_servers():
    all_servers = Server.query.all()
    return [server.to_dict() for server in all_servers]


@servers_routes.route("/current")
@login_required
def users_servers():
    pass


@servers_routes.route("/<int:id>")
@login_required
def one_server(id):
    ## GET all servers where id = id, include channels, messages
    server = Server.query.get(id)

    if not server:
        return {'error': 'Server Not Found'}, 404

    return server.to_dict()


@servers_routes.route("/", methods=["POST"])
@login_required
def create_server():
    form = CreateServerForm()
    server = Server(
        name = form.data['serverName'],
        owner_id=form.data['ownerId'],
        )
    db.session.add(server)
    db.session.commit()

    if not server.name:
        return { "errors": server.to_dict()}, 400
    else:
        return server.to_dict(), 200



@servers_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_server(id):
    pass


@servers_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_server(id):
    server = Server.query.get(id)

    return server.to_dict()