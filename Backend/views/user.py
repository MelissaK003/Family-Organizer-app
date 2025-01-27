from flask import jsonify,request,Blueprint
from models import User,db
from werkzeug.security import generate_password_hash

user_bp = Blueprint("user_bp", __name__)

#  Fetch User
@user_bp.route("/users")
def fetch_users():
    users = User.query.all()
    user_list = []

    for user in users:
        user_list.append({
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'role':user.role  
        })

    return jsonify(user_list)

#Add User
@user_bp.route("/users", methods=["POST"])
def add_users():
    data = request.get_json()
    full_name = data['full_name']
    email = data['email']
    role = data['role']
    password = generate_password_hash( data['password'])

    check_email = User.query.filter_by(email=email).first()

    if check_email:
        return jsonify({"error": "Email already exists"}),409

    else:
        new_user = User(full_name=full_name, email=email, role=role, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"success":"User added successfully"}), 201

#Update User
@user_bp.route("/users/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get(user_id)

    if user:
        data = request.get_json()
        full_name = data.get('full_name',user.full_name)
        email = data.get('email', user.email)
        role = data.get('role',user.role)
        password = data.get('password',user.password)

        check_email = User.query.filter_by(email=email and id!=user.id).first()

    
        if check_email:
            return jsonify({"error":"Email exists"}),406

        else:
            user.full_name=full_name
            user.email=email
            user.role=role
            user.password=password
          
            db.session.commit()
            return jsonify({"success":"Updated successfully"}), 201

    else:
        return jsonify({"error":"User doesn't exist!"}),406

#Delete User
@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": "Deleted successfully"}), 200
    else:
        return jsonify({"error": "User you are trying to delete doesn't exist!"}), 404

