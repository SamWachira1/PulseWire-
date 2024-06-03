from flask import Blueprint, request
from app.models import db, Channel, Server 
from flask_login import current_user, login_required


channels_routes = Blueprint("channels", __name__)


@channels_routes.route("/<int:id>")
@login_required
def get_channel(id):
    pass


@channels_routes.route("/", methods=["POST"])
@login_required
def create_channel():
    pass

@channels_routes.route("/<int:id>", methods=['PUT'])
@login_required
def edit_channel(id):

    channel = Channel.query.get(id)
    if not channel:
        return {"error": "Channel not found"}, 404
    
    server = Server.query.get(channel.server_id)
    if server.owner_id != current_user.id:
        return {"error": "Unauthorized"}, 403
    
    data = request.get_json()
    if not data:
        return {"error": "Invalid input"}, 400
    
    name = data.get('name')
    if not name or len(name) < 1 or len(name) > 50:
        return {"error": "Name must be between 1 and 50 characters"}, 400
    
    try:
        channel.name = name
        db.session.commit()
        
        return {
            'id': channel.id,
            'server_id': channel.server_id,
            'name': channel.name
        }
    except Exception as e:
        db.session.rollback()
        return {"error": "An error occurred while updating the channel"}, 500



@channels_routes.route("/<int:id>")
@login_required
def delete_channel(id):
    pass


@channels_routes.route("/<int:id>/messages")
@login_required
def get_all_messages(id):
    pass


@channels_routes.route("/<int:id>/messages", methods=["POST"])
@login_required
def create_message(id):
    pass
