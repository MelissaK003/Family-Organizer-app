from flask import Flask
from flask_migrate import Migrate
from models import db,TokenBlocklist
from datetime import timedelta
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///family.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)

#Blueprints
from views import user_bp,task_bp,event_bp,mealplan_bp,attendance_bp,shoppinglist_bp,auth_bp
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(task_bp)
app.register_blueprint(event_bp)
app.register_blueprint(mealplan_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(shoppinglist_bp)

# Setup JWT
app.config["JWT_SECRET_KEY"] = "Family_organizer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
jwt = JWTManager(app)

# Token blocklist 
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None

if __name__ == "__main__":
    app.run(debug=True)

