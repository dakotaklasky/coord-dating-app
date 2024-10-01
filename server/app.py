#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
import random


# Local imports
from config import app, db
# Add your model imports
from models import User,Like,Match,Preference

# Views go here!

@app.route('/')
def index():
    return {"hello":'Welcome!'},200

#return user data
@app.route('/<int:user_id>', methods=['GET'])
def user(user_id):
    return User.query.filter(User.id == user_id).first().to_dict(), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter(User.username == data['username']).first()
    if not user:
        return {'error':'login failed'},401
    
    session['user_id'] = user.id
    print(user.id)

    return user.to_dict(), 200

#get match prospect
    #return a user that current user has not yet liked
@app.route('/new_match', methods=['GET'])
def new_match():
    #not sure where username will be stored
    all_users = User.query.all()
    prev_likes = Like.query.filter(Like.matcher_id == 1).all()
    prev_likes_ids = [p.matchee_id for p in prev_likes]
    prev_likes_ids.append(1)
    available_users = User.query.filter(User.id.not_in(prev_likes_ids)).all()
    return available_users[random.randint(0,len(available_users))].to_dict(), 200

@app.route('/<int:user_id>/like', methods = ['POST'])
def user_like(user_id):
    #post like data
    #if a match is created add to match table
    #if no match return nothing
    #if match return match

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
#return all matches
def user_matches():
    user = User.query.filter(User.id == session['user_id']).first()
    matches = user.matchee_matches
    return [m.to_dict(rules=['-likes','-matches','-preferences']) for m in matches],200



### test routes in postman
#add filters

if __name__ == '__main__':
    app.run(port=5555, debug=True)





