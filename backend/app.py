from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hrms.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# ======================
# Models
# ======================

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    emp_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)


class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20))
    status = db.Column(db.String(20))
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'))


# ======================
# Validation helpers
# ======================

def valid_emp_id(emp_id):
    return re.match(r'^[A-Za-z0-9]+$', emp_id)


def valid_name(name):
    return re.match(r'^[A-Za-z ]+$', name)


def valid_email(email):
    return re.match(r'^[^@]+@[^@]+\.[^@]+$', email)


# ======================
# Routes
# ======================

@app.route("/")
def home():
    return jsonify({"message": "HRMS API running", "developer": "Ujju"})


# ======================
# Employees
# ======================

@app.route("/employees", methods=["GET"])
def get_employees():
    employees = Employee.query.all()
    result = []

    for e in employees:
        present_days = Attendance.query.filter_by(
            employee_id=e.id,
            status="Present"
        ).count()

        result.append({
            "id": e.id,
            "emp_id": e.emp_id,
            "name": e.name,
            "email": e.email,
            "department": e.department,
            "present_days": present_days
        })

    return jsonify(result), 200


@app.route("/employees", methods=["POST"])
def add_employee():
    data = request.json or {}

    emp_id = data.get("emp_id", "")
    name = data.get("name", "")
    email = data.get("email", "")
    department = data.get("department", "")

    if not all([emp_id, name, email, department]):
        return jsonify({"error": "All fields are required"}), 400

    if not valid_emp_id(emp_id):
        return jsonify({"error": "Employee ID must be alphanumeric"}), 400

    if not valid_name(name):
        return jsonify({"error": "Name must contain only letters"}), 400

    if not valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    if Employee.query.filter_by(emp_id=emp_id).first():
        return jsonify({"error": "Employee ID already exists"}), 400

    emp = Employee(**data)
    db.session.add(emp)
    db.session.commit()

    return jsonify({"message": "Employee created"}), 201


@app.route("/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):
    emp = Employee.query.get(id)

    if not emp:
        return jsonify({"error": "Employee not found"}), 404

    db.session.delete(emp)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


# ======================
# Attendance
# ======================

@app.route("/attendance", methods=["POST"])
def mark_attendance():
    data = request.json
    att = Attendance(**data)
    db.session.add(att)
    db.session.commit()
    return jsonify({"message": "Attendance marked"}), 201


# ⭐ FILTER SUPPORT ADDED HERE
@app.route("/attendance/<int:emp_id>")
def get_attendance(emp_id):
    date = request.args.get("date")

    query = Attendance.query.filter_by(employee_id=emp_id)

    if date:
        query = query.filter_by(date=date)

    records = query.all()

    return jsonify([
        {"date": r.date, "status": r.status}
        for r in records
    ])


# ======================
# Dashboard
# ======================

@app.route("/dashboard")
def dashboard():
    return jsonify({
        "totalEmployees": Employee.query.count(),
        "present": Attendance.query.filter_by(status="Present").count(),
        "absent": Attendance.query.filter_by(status="Absent").count()
    })


# ======================

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
