from flask import jsonify,request,Blueprint
from models import Shoppinglist,User,db

shoppinglist_bp = Blueprint("shoppinglist_bp", __name__)

#Fetch All Shopping lists
@shoppinglist_bp.route("/shoppinglists", methods=["GET"])
def fetch_all_shoppinglists():
    shoppinglists = Shoppinglist.query.all()
    shoppinglist_data = []

    for shoppinglist in shoppinglists:
        shoppinglist_data.append({
            "id": shoppinglist.id,
            "item_name": shoppinglist.item_name,
            "quantity": shoppinglist.quantity,
            "checklist": shoppinglist.checklist,
        })

    return jsonify(shoppinglist_data), 200

#Fetch a single shopping list
@shoppinglist_bp.route("/shoppinglist/<int:shopping_id>", methods=["GET"])
def fetch_shoppinglist_by_id(shopping_id):
    shoppinglist = Shoppinglist.query.get(shopping_id)
    
    if shoppinglist:
        return jsonify({
            "id": shoppinglist.id,
            "title":shoppinglist.title,
            "item_name": shoppinglist.item_name,
            "quantity": shoppinglist.quantity,
            "checklist": shoppinglist.checklist,
            "added_by": shoppinglist.added_by  
        }), 200
    else:
        return jsonify({"error": "Shopping list not found"}), 404
    
@shoppinglist_bp.route("/shoppinglist", methods=["POST"])
def add_shoppinglist():
    data = request.get_json()
    
    title = data.get('title')
    items = data.get('item_names')  
    quantities = data.get('quantity') 
    added_by = data.get('user_id')  

    if not title or not items or not quantities or not added_by:
        return jsonify({"error": "Title, item names, quantity, and user_id are required"}), 400
    
    check_user = User.query.get(added_by)
    if not check_user:
        return jsonify({"error": "User does not exist"}), 404

    if len(items) != len(quantities):
        return jsonify({"error": "Items and quantities lists must have the same length"}), 400

    shoppinglists = []
    for i in range(len(items)):
        shoppinglist = Shoppinglist(
            title=title, 
            item_name=items[i], 
            quantity=quantities[i], 
            added_by=added_by
        )
        shoppinglists.append(shoppinglist)

    db.session.add_all(shoppinglists)
    db.session.commit()

    return jsonify({"success": f"{len(shoppinglists)} items added to shopping list(s)"}), 201


#Update Shopping list
@shoppinglist_bp.route("/shoppinglist/<int:shopping_id>", methods=["PATCH"])
def update_shoppinglist(shopping_id):
    shoppinglist = Shoppinglist.query.get(shopping_id)

    if not shoppinglist:
        return jsonify({"error": "Shopping list not found"}), 404

    data = request.get_json()
    
    title = data.get('title',shoppinglist.title)
    item_name = data.get('item_name', shoppinglist.item_name)
    quantity = data.get('quantity', shoppinglist.quantity)
    checklist = data.get('checklist', shoppinglist.checklist)

    shoppinglist.title = title
    shoppinglist.item_name = item_name
    shoppinglist.quantity = quantity
    shoppinglist.checklist = checklist

    db.session.commit()

    return jsonify({"success": "Shopping list updated successfully"}), 200

#Delete shopping list
@shoppinglist_bp.route("/shoppinglist/<int:shopping_id>", methods=["DELETE"])
def delete_shoppinglist(shopping_id):
    shoppinglist = Shoppinglist.query.get(shopping_id)

    if not shoppinglist:
        return jsonify({"error": "Shopping list not found"}), 404

    db.session.delete(shoppinglist)
    db.session.commit()

    return jsonify({"success": "Shopping list deleted successfully"}), 200



