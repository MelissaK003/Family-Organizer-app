from flask import jsonify,request,Blueprint
from models import Event,User,EventAttendance,db

attendance_bp = Blueprint("attendance_bp", __name__)

#Fetch attendees of a specific event
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


#Update Event attendance
@attendance_bp.route("/event_attendance/<int:event_id>/<int:user_id>", methods=["PATCH"])
def update_event_attendance(event_id, user_id):
    """
    Update a user's attendance status for a specific event.
    If no attendance record exists, create one based on the user's new status.
    If the record exists, update it based on the user's new status.
    """

    data = request.get_json()
    is_attending = data.get("is_attending")  # New status the user wants to set

    if is_attending is None:
        return jsonify({"error": "is_attending status is required"}), 400

    # Validate event and user exist
    event = Event.query.get(event_id)
    user = User.query.get(user_id)

    if not event:
        return jsonify({"error": "Event not found"}), 404

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Check if the attendance record exists
    attendance = EventAttendance.query.filter_by(event_id=event_id, user_id=user_id).first()

    if not attendance:
        # If no record exists and user is now attending, create the record
        if is_attending:
            new_attendance = EventAttendance(event_id=event_id, user_id=user_id, is_attending=True)
            db.session.add(new_attendance)
            db.session.commit()
            return jsonify({"success": "Your attendance for the event ha been noted."}), 201
        else:
            # If no record exists and user is not attending, do nothing
            return jsonify({"error": "User is marked as not attending."}), 400
    else:
        # Update existing attendance record
        if attendance.is_attending == is_attending:
            # If the status is the same as the existing one, no change is needed
            return jsonify({"message": "No changes made. Attendance status remains the same."}), 200

        # Update the attendance status
        attendance.is_attending = is_attending
        db.session.commit()
        status_message = "User is now attending." if is_attending else "User is no longer attending."
        return jsonify({"success": status_message}), 200




