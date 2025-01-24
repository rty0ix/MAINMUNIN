from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///checkins.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class CheckIn(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    badge_number = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    investigative_role = db.Column(db.String(50), nullable=False)
    department_number = db.Column(db.String(50), nullable=False)
    defendant_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20))
    case_number = db.Column(db.String(50))
    additional_comments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    verified = db.Column(db.Boolean, default=False)
    flagged = db.Column(db.Boolean, default=False)

with app.app_context():
    db.create_all()

@app.route('/api/check-ins', methods=['GET'])
def get_check_ins():
    check_ins = CheckIn.query.order_by(CheckIn.created_at.desc()).all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'badge_number': c.badge_number,
        'title': c.title,
        'investigative_role': c.investigative_role,
        'department_number': c.department_number,
        'defendant_name': c.defendant_name,
        'phone_number': c.phone_number,
        'case_number': c.case_number,
        'additional_comments': c.additional_comments,
        'created_at': c.created_at.isoformat(),
        'verified': c.verified,
        'flagged': c.flagged
    } for c in check_ins])

@app.route('/api/check-ins', methods=['POST'])
def create_check_in():
    data = request.json
    check_in = CheckIn(
        name=data['name'],
        badge_number=data['badge_number'],
        title=data['title'],
        investigative_role=data['investigative_role'],
        department_number=data['department_number'],
        defendant_name=data['defendant_name'],
        phone_number=data.get('phone_number'),
        case_number=data.get('case_number'),
        additional_comments=data.get('additional_comments')
    )
    db.session.add(check_in)
    db.session.commit()
    return jsonify({'message': 'Check-in created successfully'}), 201

@app.route('/api/check-ins/<int:id>/verify', methods=['PUT'])
def verify_check_in(id):
    check_in = CheckIn.query.get_or_404(id)
    check_in.verified = True
    check_in.flagged = False
    db.session.commit()
    return jsonify({'message': 'Check-in verified successfully'})

@app.route('/api/check-ins/<int:id>/flag', methods=['PUT'])
def flag_check_in(id):
    check_in = CheckIn.query.get_or_404(id)
    check_in.verified = False
    check_in.flagged = True
    db.session.commit()
    return jsonify({'message': 'Check-in flagged successfully'})

if __name__ == '__main__':
    app.run(debug=True)