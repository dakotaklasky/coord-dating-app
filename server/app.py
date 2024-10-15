#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, session
import random
from sqlalchemy import select
from datetime import date,timedelta
from sqlalchemy.orm import class_mapper


# Local imports
from config import app, db
# Add your model imports
from models import User,Like,Match,Preference,PreferenceOption, UserAttribute

#return user data
@app.route('/<int:user_id>', methods=['GET'])
def user(user_id):
        return User.query.filter(User.id == user_id).first().to_dict(), 200


@app.route('/myaccount', methods=['GET','PATCH'])
def myaccount():
    if 'user_id' in session:
        user_id = session.get('user_id')
        user = User.query.filter(User.id == user_id).first()
        user_attribute_fields = []
        for i in user.attributes:
            user_attribute_fields.append(i.attribute_category)

        if request.method == 'GET':
            return user.to_dict(), 200

        elif request.method == 'PATCH':
            data = request.get_json()

            user_info = [column.key for column in class_mapper(User).columns]
            for field in data:
                if field in user_info:
                    setattr(user,field,data[field])
                    db.session.add(user)
                else:
                    #test if attribute exists
                    if field in user_attribute_fields:
                        current_attribute = UserAttribute.query.filter(UserAttribute.user_id == user_id).filter(UserAttribute.attribute_category == field).first()
                        current_attribute.attribute_value = data[field]
                        db.session.add(current_attribute)
                    else:
                        user_attribute = UserAttribute(field,data[field])
                        db.session.add(user_attribute)
            
            db.session.commit()

            return user.to_dict(), 200
    else:
        return {"error":"please login"}, 401

@app.route('/mypreferences', methods=['GET','PATCH'])
def mypreferences():
    if 'user_id' in session:
        user_id = session.get('user_id')
        user = User.query.filter(User.id == user_id).first()

        if request.method == 'GET':
            prefs = user.preferences
            pref_dict = {}
            for i in prefs:
                if i.pref_category in pref_dict:
                    pref_dict[i.pref_category].append(i.pref_value)
                else:
                    pref_dict[i.pref_category] = [i.pref_value]
            return pref_dict, 200
        if request.method == 'PATCH':
            data = request.get_json()
            print(data)
            for field in data:
                pref = Preference.query.filter(Preference.user_id == user_id).filter(Preference.pref_category == field).first()
                if pref:
                    if len(data[field]) > 1:
                        prefs = Preference.query.filter(Preference.user_id == user_id).filter(Preference.pref_category == field).all()
                        pref1 = prefs[0]
                        pref2 = prefs[1]
                        pref1.pref_value = data[field][0]
                        pref2.pref_value = data[field][1]
                        db.session.add(pref1)
                        db.session.add(pref2)
                    else:
                        pref.pref_value = data[field][0]
                        db.session.add(pref)
                else:
                        if len(data[field]) > 1:
                            new_pref1 = Preference(user_id = user_id, pref_category=field, pref_value = data[field][0])
                            new_pref2 = Preference(user_id = user_id, pref_category=field, pref_value = data[field][1])
                            db.session.add(new_pref1)
                            db.session.add(new_pref2)
                        else:
                            new_pref = Preference(user_id = user_id, pref_category=field, pref_value = data[field][0])
                            db.session.add(new_pref)
            db.session.commit()
            return [p.to_dict() for p in Preference.query.filter(Preference.user_id == user_id).all()], 200
    else:
        return {"error":"please login!"}, 401


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    user = User.query.filter(User.username == username).first()
    
    if not user:
        return {'error': 'user not found'}, 404
    
    if not user.authenticate(data.get('password')):
        return {'error':'invalid password'}, 401
    
    else:
        session['user_id'] = user.id
        return user.to_dict(), 200  


@app.route('/logout',methods=['DELETE'])
def logout():
    session.clear()
    return {}, 204

#get match prospect
    #return a user that current user has not yet liked
@app.route('/new_match', methods=['GET'])
def new_match():
    if 'user_id' in session:
        user_id = session.get('user_id')
    else:
        return {"error":"please login"}, 401

    prev_likes = Like.query.filter(Like.matcher_id == user_id).all()
    prev_likes_ids = [p.matchee_id for p in prev_likes]
    prev_likes_ids.append(user_id)
    user_preferences = User.query.filter(User.id == user_id).first().preferences

    #create preference dictionary
    pref_dict = {}
    for i in range(0,len(user_preferences)):
        if user_preferences[i].pref_category in pref_dict:
            pref_dict[user_preferences[i].pref_category].append(user_preferences[i].pref_value)
        else:
            pref_dict[user_preferences[i].pref_category]= [user_preferences[i].pref_value]

    
    #available_users = User.query.filter(User.id.not_in(prev_likes_ids)).all()

    query = db.session.query(UserAttribute)

    for j in pref_dict:

        if len(pref_dict[j])> 1:
            min_val = min(pref_dict[j])
            max_val = max(pref_dict[j])

            if j == 'Age':
                min_bday = (date.today()- timedelta(days=int(min_val)*365)).isoformat()
                max_bday = (date.today()- timedelta(days=int(max_val)*365)).isoformat()

                subquery = (
                select(UserAttribute.user_id)
                .where(UserAttribute.attribute_category == "Birthdate")
                .where(UserAttribute.attribute_value <= min_bday)
                .where(UserAttribute.attribute_value >= max_bday)
                )

            else:
                subquery = (
                select(UserAttribute.user_id)
                .where(UserAttribute.attribute_category == j)
                .where(UserAttribute.attribute_value <= max_val)
                .where(UserAttribute.attribute_value >= min_val)
                )

        else:
            subquery = (
            select(UserAttribute.user_id)
            .where(UserAttribute.attribute_category == j)
            .where(UserAttribute.attribute_value == pref_dict[j][0])
            )
        query = query.filter(UserAttribute.user_id.not_in(prev_likes_ids)).filter(UserAttribute.user_id.in_(subquery))

    user_attributes = query.all()
    available_users = [a.user for a in user_attributes]

    if not available_users:
        return {"no_users":"out of users"}, 200
    else:
        return available_users[0].to_dict(), 200

@app.route('/like', methods = ['POST'])
def user_like():


    if 'user_id' in session:
        user_id = session.get('user_id')
    else:
        return {"error":"please login"}, 401

    data = request.get_json()
    new_like = Like(matcher_id = user_id, matchee_id = data.get('matchee_id'), accepted = data.get('accepted'))
    db.session.add(new_like)
    db.session.commit()

    #is it a match?
    reciprocal_like = Like.query.filter(Like.matcher_id == data.get('matchee_id')).filter(Like.matchee_id == user_id).first()
    if reciprocal_like:
        if reciprocal_like.accepted == 1:
            #you found a match!
            new_match = Match(matcher_id = user_id, matchee_id = data.get('matchee_id'))
            new_match_reciprocal = Match(matcher_id = data.get('matchee_id'), matchee_id = user_id)
            db.session.add(new_match)
            db.session.add(new_match_reciprocal)
            db.session.commit()

            match_dict = new_match.to_dict()
            match_dict['MatchFlag'] = 1

            return match_dict, 201
    else:
        like_dict = new_like.to_dict()
        like_dict['MatchFlag'] = 0
        return like_dict, 201

####FOR TESTING ######
@app.route('/<int:user_id>/like', methods = ['POST'])
def user_id_like(user_id):

    data = request.get_json()
    new_like = Like(matcher_id = user_id, matchee_id = data.get('matchee_id'), accepted = data.get('accepted'))
    db.session.add(new_like)
    db.session.commit()

    #is it a match?
    reciprocal_like = Like.query.filter(Like.matcher_id == data.get('matchee_id')).filter(Like.matchee_id == user_id).first()
    if reciprocal_like:
        if reciprocal_like.accepted == 1:
            #you found a match!
            new_match = Match(matcher_id = user_id, matchee_id = data.get('matchee_id'))
            new_match_reciprocal = Match(matcher_id = data.get('matchee_id'), matchee_id = user_id)
            db.session.add(new_match)
            db.session.add(new_match_reciprocal)
            db.session.commit()

            match_dict = new_match.to_dict()
            match_dict['MatchFlag'] = 1

            return match_dict, 201
    else:
        like_dict = new_like.to_dict()
        like_dict['MatchFlag'] = 0
        return like_dict, 201

@app.route('/matches', methods = ['GET'])
def user_matches():
    if 'user_id' in session:
        user_id = session.get('user_id')
        user = User.query.filter(User.id == user_id).first()
        matches = user.matchee_matches
        return [m.to_dict(rules=['-likes','-matches','-preferences']) for m in matches],200
    else:
        return {"error": "please login"}, 401

@app.route('/signup',methods=['POST'])
def signup():
    data = request.get_json()
    try:
        new_user = User(username=data.get('username'),image=data.get('image'),bio=data.get('bio'))
        new_user.password_hash = data.get('password')
    except ValueError:
        return {"error":"invalid data"}, 401
    db.session.add(new_user)
    db.session.commit()

    user = User.query.filter(User.username == data.get('username')).first()

    #need to make not manual for if you add fields to user info
    data.pop('username')
    data.pop('password')
    if 'birthdate' in data:
        data.pop("birthdate")
    if 'image' in data:
        data.pop('image')
    if 'bio' in data:
        data.pop('bio')
    
    try:
        for key in data:
            new_attribute = UserAttribute(user_id=user.id,attribute_category=key,attribute_value=data.get(key))
            db.session.add(new_attribute)
            db.session.commit()
    except ValueError:
        return {"error":"invalid data"}, 401

    return new_user.to_dict(), 201

@app.route('/pref_options',methods=['GET'])
def pref_options():
    pref_options = PreferenceOption.query.all()
    return [p.to_dict() for p in pref_options], 200

@app.route('/user_attributes',methods=['GET', 'PATCH'])
def user_attributes():
    if 'user_id' in session:
        user_id = session.get('user_id')
        if request.method == "GET":
            user_attributes = UserAttribute.query.filter(UserAttribute.user_id == user_id).all()

            attribute_dict = {}
            for a in user_attributes:
                attribute_dict[a.attribute_category] = a.attribute_value

            return attribute_dict, 200
        if request.method == 'PATCH':
            data = request.get_json()
            for field in data:
                for i in range(0,len(data[field])):
                    new_attribute = UserAttribute(user_id = user_id, attribute_category = field, attribute_value = data[field][i])
                    db.session.add(new_attribute)
            db.session.commit()
            return new_attribute.to_dict(), 200
    else:
        return {"error":"please login"}, 401

# @app.route('/isloggedin',methods=['GET'])
# def isloggedin():
#     if 'user_id' in session:
#         return {"logged in":"true"}, 200
#     else:
#         return {"logged in": "false"}, 401


if __name__ == '__main__':
    app.run(port=5555, debug=True)





