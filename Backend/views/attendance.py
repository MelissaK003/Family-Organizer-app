from flask import jsonify,request,Blueprint
from models import Event,User,EventAttendance,db

attendance_bp = Blueprint("attendance_bp", __name__)

#Fetch attendees of a specific event
from flask import jsonify, request, Blueprint
from models import Event, User, EventAttendance, db

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

# Toggle attendance for an event
@attendance_bp.route("/event_attendance/<int:event_id>", methods=["POST"])
def toggle_attendance(event_id):
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    existing_attendance = EventAttendance.query.filter_by(
        event_id=event_id,
        user_id=user_id
    ).first()
    
    if existing_attendance:
        db.session.delete(existing_attendance)
        message = "You are no longer attending this event"
    else:
        new_attendance = EventAttendance(event_id=event_id, user_id=user_id)
        db.session.add(new_attendance)
        message = "You are now attending this event"
    
    db.session.commit()
    
    return jsonify({"message": message}), 200

#Update Event attendance
@attendance_bp.route("/event_attendance/<int:event_id>/<int:user_id>", methods=["PATCH"])
def update_event_attendance(event_id, user_id):
   
    data = request.get_json()
    is_attending = data.get("is_attending") 
    if is_attending is None:
        return jsonify({"error": "is_attending status is required"}), 400

    event = Event.query.get(event_id)
    user = User.query.get(user_id)

    if not event:
        return jsonify({"error": "Event not found"}), 404

    if not user:
        return jsonify({"error": "User not found"}), 404
        
    attendance = EventAttendance.query.filter_by(event_id=event_id, user_id=user_id).first()

    if not attendance:
        if is_attending:
            new_attendance = EventAttendance(event_id=event_id, user_id=user_id, is_attending=True)
            db.session.add(new_attendance)
            db.session.commit()
            return jsonify({"success": "Your attendance for the event ha been noted."}), 201
        else:
            return jsonify({"error": "User is marked as not attending."}), 400
    else:
        if attendance.is_attending == is_attending:
            return jsonify({"message": "No changes made. Attendance status remains the same."}), 200

        attendance.is_attending = is_attending
        db.session.commit()
        status_message = "User is now attending." if is_attending else "User is no longer attending."
        return jsonify({"success": status_message}), 200




