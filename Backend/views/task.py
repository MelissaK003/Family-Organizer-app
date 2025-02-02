from flask import jsonify,request,Blueprint
from models import Task,User,db
from datetime import datetime

task_bp = Blueprint("task_bp", __name__)

# Fetch Tasks
@task_bp.route("/tasks", methods=["GET"])
def fetch_tasks():
    tasks = Task.query.all()
    task_list = []

    for task in tasks:
        task_list.append({
            'title': task.title,
            'description': task.description,
            'completion_status': task.completion_status,
            'deadline': task.deadline, 
            'assigned_to': task.assigned_to
        })

    return jsonify(task_list), 200

# Add Task
@task_bp.route("/task", methods=["POST"])
def add_task():
    data = request.get_json()
    
    title = data.get('title')
    description = data.get('description')
    deadline = data.get('deadline')
    assigned_to_name = data.get('assigned_to') 

    if not title or not deadline or not assigned_to_name:
        return jsonify({"error": "Missing required fields (title, deadline, or assigned_to)"}), 400
    
    try:
        deadline = datetime.strptime(deadline, "%Y-%m-%d").date() 
    except ValueError:
        return jsonify({"error": "Invalid event_date format. Use YYYY-MM-DD"}), 400

    assigned_user = User.query.filter_by(full_name=assigned_to_name).first()
    if not assigned_user:
        return jsonify({"error": "User does not exist"}), 404

    # Create and save the new task
    new_task = Task(
        title=title,
        description=description,
        deadline=deadline,
        completion_status=False,
        assigned_to=assigned_user.id  
    )
    db.session.add(new_task)
    db.session.commit()

    return jsonify({"success": "Task added successfully"}), 201

# Update Task
@task_bp.route("/task/<int:task_id>", methods=["PATCH"])
def update_task(task_id):
    task = Task.query.get(task_id)

    if task:
        data = request.get_json()

        title = data.get('title', task.title)  
        description = data.get('description', task.description)     
        deadline = data.get('deadline', task.deadline) 
        completion_status = data.get('completion_status', task.completion_status)
        assigned_to_name = data.get('assigned_to')

        if assigned_to_name:
            assigned_user = User.query.filter_by(full_name=assigned_to_name).first()
            if not assigned_user:
                return jsonify({"error": "User does not exist"}), 404
            task.assigned_to = assigned_user.id

        task.title = title
        task.description = description
        task.deadline = deadline
        task.completion_status = completion_status

        db.session.commit()
        return jsonify({"success": "Task updated successfully"}), 200

    else:
        return jsonify({"error": "Task not found!"}), 404

#Delete Task
@task_bp.route("/task/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get(task_id)

    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({"success": "Deleted successfully"}), 200
    else:
        return jsonify({"error": "Task doesn't exist!"}), 404   