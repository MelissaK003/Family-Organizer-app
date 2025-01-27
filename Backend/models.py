from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import datetime, timezone


metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = "user"  

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    role = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(128), nullable=False)

    tasks = db.relationship('Task', backref='user', lazy=True)
    events = db.relationship('Event', backref='user', lazy=True)
    event_attendances = db.relationship('EventAttendance', backref='user', lazy=True)
    shopping_lists = db.relationship('Shoppinglist', backref='user', lazy=True)
    meal_plans = db.relationship('Mealplan', backref='user', lazy=True)


class Task(db.Model):
    __tablename__ = "task"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(256), nullable=True)
    completion_status = db.Column(db.Boolean, default=False)
    deadline = db.Column(db.Date, nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Event(db.Model):
    __tablename__ = "event"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.String(256), nullable=True)
    event_date = db.Column(db.Date, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    attendees = db.relationship('EventAttendance', backref='event', lazy=True)


class EventAttendance(db.Model):
    __tablename__ = "event_attendance"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    is_attending = db.Column(db.Boolean, default=False)


class Shoppinglist(db.Model):
    __tablename__ = "shoppinglist"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    item_name = db.Column(db.String(128), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    checklist = db.Column(db.Boolean, default=False)
    added_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Mealplan(db.Model):
    __tablename__ = "meal-plan"

    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.String(128), nullable=False)
    description = db.Column(db.String(256), nullable=False)
    day = db.Column(db.String(128), nullable=False)
    made_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False)    


     



   