from flask import jsonify,request,Blueprint
from models import Event,User,EventAttendance,db

attendance_bp = Blueprint("attendance_bp", __name__)

# Fetch attendees of a specific event
@attendance_bp.route("/event_attendances/event/<int:event_id>", methods=["GET"])
def fetch_attendees_for_event(event_id):
    event = Event.query.get(event_id)
    
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    attendances = EventAttendance.query.filter_by(event_id=event_id).all()
    attendees_list = []
    
    for attendance in attendances:
        user = User.query.get(attendance.user_id)
        if user:
            attendees_list.append(user.full_name)
    
    return jsonify({
        "event_name": event.title,
        "attendees": attendees_list
    }), 200

# Fetch events that a specific user is attending
@attendance_bp.route("/event_attendances/user/<int:user_id>", methods=["GET"])
def fetch_events_for_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    attendances = EventAttendance.query.filter_by(user_id=user_id).all()
    events_list = []
    
    for attendance in attendances:
        event = Event.query.get(attendance.event_id)
        if event:
            events_list.append({
                "id": event.id,
                "title": event.title,
                "description": event.description,
                "event_date": event.event_date
            })
    
    return jsonify({
        "user_name": user.full_name,
        "events": events_list
    }), 200






