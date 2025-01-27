from flask import jsonify,request,Blueprint
from models import User,Mealplan,db

mealplan_bp = Blueprint("mealplan_bp", __name__)

#Fetch All Meal
@mealplan_bp.route("/mealplans", methods=["GET"])
def fetch_mealplans():
    mealplans = Mealplan.query.all()
    mealplan_list = []

    for mealplan in mealplans:
        mealplan_list.append({
            "id": mealplan.id,
            "tag": mealplan.tag,
            "description": mealplan.description,
            "day": mealplan.day,
            "made_by": mealplan.made_by
        })

    return jsonify(mealplan_list), 200

#Add Meal plan
@mealplan_bp.route("/mealplan", methods=["POST"])
def add_mealplan():
    data = request.get_json()

    tag = data.get("tag")
    description = data.get("description")
    day = data.get("day")
    made_by = data.get("user_id")  

    if not tag or not description or not day or not made_by:
        return jsonify({"error": "Missing required fields (tag, description, day, or user_id)"}), 400

    user = User.query.get(made_by)
    if not user:
        return jsonify({"error": "User does not exist"}), 404

    new_mealplan = Mealplan(tag=tag, description=description, day=day, made_by=made_by)
    db.session.add(new_mealplan)
    db.session.commit()

    return jsonify({"success": "Meal plan added successfully"}), 201

#Update Meal plan
@mealplan_bp.route("/mealplan/<int:mealplan_id>", methods=["PATCH"])
def update_mealplan(mealplan_id):
    mealplan = Mealplan.query.get(mealplan_id)

    data = request.get_json()

    tag = data.get("tag", mealplan.tag)
    description = data.get("description", mealplan.description)
    day = data.get("day", mealplan.day)
    made_by = data.get("user_id", mealplan.made_by)

    
    user = User.query.get(made_by)
    if not user:
        return jsonify({"error": "User does not exist"}), 404
    
    if not mealplan:
        return jsonify({"error": "Meal plan not found"}), 404

    mealplan.tag = tag
    mealplan.description = description
    mealplan.day = day
    mealplan.made_by = made_by

    db.session.commit()
    return jsonify({"success": "Meal plan updated successfully"}), 200

#Delete Meal Plan
@mealplan_bp.route("/mealplan/<int:mealplan_id>", methods=["DELETE"])
def delete_mealplan(mealplan_id):
    mealplan = Mealplan.query.get(mealplan_id)

    if not mealplan:
        return jsonify({"error": "Meal plan not found"}), 404

    db.session.delete(mealplan)
    db.session.commit()
    return jsonify({"success": "Meal plan deleted successfully"}), 200


