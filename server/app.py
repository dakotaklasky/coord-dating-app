#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, session
import random


# Local imports
from config import app, db
# Add your model imports
from models import User,Like,Match,Preference,PreferenceOption

#return user data
@app.route('/<int:user_id>', methods=['GET'])
def user(user_id):
        return User.query.filter(User.id == user_id).first().to_dict(), 200


@app.route('/myaccount', methods=['GET','PATCH'])
def myaccount():
    if 'user_id' in session:
        user_id = session.get('user_id')
        user = User.query.filter(User.id == user_id).first()

        if request.method == 'GET':
            return user.to_dict(), 200

        elif request.method == 'PATCH':
            data = request.get_json()
            for field in data:
                setattr(user,field,data[field])
            db.session.add(user)
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
            return [p.to_dict() for p in prefs], 200
        if request.method == 'PATCH':
            data = request.get_json()
            for field in data:
                pref = Preference.query.filter(Preference.user_id == user_id).filter(Preference.pref_category == field).first()
                pref.pref_value = data[field]
                db.session.add(pref)
            db.session.commit()
            return [p.to_dict() for p in Preference.query.filter(Preference.user_id == user_id).all()], 200
    else:
        return {"error":"please login!"}, 401


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    user = User.query.filter(User.username == username).first()
    if user:
        session['user_id'] = user.id
        print(user.id)
        return user.to_dict(), 200  
    else:
        return {'error':'login failed'},401

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
        pref_dict[user_preferences[i].pref_category]= user_preferences[i].pref_value
    available_users = User.query.filter(User.id.not_in(prev_likes_ids)).all()

    available_users = User.query.filter(User.id.not_in(prev_likes_ids)).filter(User.gender == pref_dict['Gender']).filter(User.height >= pref_dict['Height']).all()
    #print(available_users)
    if len(available_users) == 0:
        return {"no_users":"out of users"}, 200
    else:
        return available_users[0].to_dict(), 200

@app.route('/like', methods = ['POST'])
def user_like():
    #post like data
    #if a match is created add to match table
    #if no match return nothing
    #if match return match

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
        new_user = User(username=data.get('username'),age=data.get('age'), image=data.get('image'),bio=data.get('bio'), gender=data.get('gender'), height=data.get('height'))
    except ValueError:
        return {"error":"invalid data"}, 401
    db.session.add(new_user)
    db.session.commit()

    user = User.query.filter(User.username == data.get('username')).first()
    try:
        new_pref1 = Preference(user_id=user.id,pref_category='Height',pref_value=data.get('height_pref'))
        new_pref2 = Preference(user_id=user.id,pref_category='Gender',pref_value=data.get('gender_pref'))
    except ValueError:
        return {"error":"invalid data"}, 401
    db.session.add(new_pref1)
    db.session.add(new_pref2)
    db.session.commit()
    return new_user.to_dict(), 201

@app.route('/pref_options',methods=['GET'])
def pref_options():
    pref_options = PreferenceOption.query.all()
    return [p.to_dict() for p in pref_options], 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)





