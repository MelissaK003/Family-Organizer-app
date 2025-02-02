from flask import jsonify,request,Blueprint
from models import Event,User,EventAttendance,db
from datetime import datetime

event_bp = Blueprint("event_bp", __name__)


# Fetch Events
@event_bp.route("/events", methods=["GET"])
def fetch_events():
    user_id = request.args.get("user_id")
    
    events = Event.query.all()
    event_list = []
    
    for event in events:
        is_attending = EventAttendance.query.filter_by(event_id=event.id, user_id=user_id,is_attending=True).first() 
        
        event_list.append({
            'id': event.id,
            'title': event.title,
            'description': event.description,
            'event_date': event.event_date,
            'created_by': event.created_by,
            'is_attending': is_attending
        })
    
    return jsonify(event_list), 200

#Add Event
@event_bp.route("/event", methods=["POST"])
def add_event():
    data = request.get_json()
    
    title = data.get('title')
    description = data.get('description')
    event_date = data.get('event_date')
    created_by= data.get('user_id')

    if not title or not event_date :
        return jsonify({"error": "Missing required fields (title or Event Date)"}), 400
    
    try:
        event_date = datetime.strptime(event_date, "%Y-%m-%d").date()  
    except ValueError:
        return jsonify({"error": "Invalid event_date format. Use YYYY-MM-DD"}), 400

    assigned_user = User.query.get(created_by)
    if not assigned_user:
        return jsonify({"error": "User does not exist"}), 404

    new_event = Event(title=title, description=description, event_date=event_date, created_by=created_by)
    db.session.add(new_event)
    db.session.commit()

    return jsonify({"success": "Event added successfully"}), 201

#Update Event
@event_bp.route("/event/<int:event_id>", methods=["PATCH"])
def update_event(event_id):
    event = Event.query.get(event_id)

    if event:
        data = request.get_json()

        title = data.get('title', event.title)  
        description = data.get('description', event.description)     
        event_date = data.get('event_date', event.event_date)            
        created_by= data.get('user_id', event.created_by)         

        assigned_user = User.query.get(created_by)
        if not assigned_user:
            return jsonify({"error": "User does not exist"}), 404

        event.title = title
        event.description = description
        event.event_date = event_date
        event.created_by= created_by

        db.session.commit()
        return jsonify({"success": "Event updated successfully"}), 200

    else:
        return jsonify({"error": "Event not found!"}), 404
    

 #Update Event Attendance 
@event_bp.route("/event_attendance/<int:event_id>", methods=["POST"])
def attendance_status(event_id):
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404
    
    existing_attendance = EventAttendance.query.filter_by(event_id=event_id,user_id=user_id).first()
    
    if existing_attendance:
        existing_attendance.is_attending = not existing_attendance.is_attending
        message = "Attendance cancelled" if not existing_attendance.is_attending else "Attendance confirmed"
    else:
        new_attendance = EventAttendance(
            event_id=event_id,
            user_id=user_id,
            is_attending=True
        )
        db.session.add(new_attendance)
        message = "Attendance confirmed"
    
    db.session.commit()
    return jsonify({
        "message": message,
        "is_attending": existing_attendance.is_attending if existing_attendance else True
    }), 200   
    
#Delete Event
@event_bp.route("/event/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    event = Event.query.get(event_id)

    if event:
        db.session.delete(event)
        db.session.commit()
        return jsonify({"success": "Deleted successfully"}), 200
    else:
        return jsonify({"error": "Event doesn't exist!"}), 404   
    


