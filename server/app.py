#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request

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


#get match prospect
    #return a user that current user has not yet liked
@app.route('/<int:user_id>/new_match', methods=['GET'])
def new_match(user_id):
    #not sure where username will be stored
    all_users = User.query.all()
    prev_likes = Like.query.filter(Like.matcher_id == user_id).all()
    prev_likes_ids = [p.matchee_id for p in prev_likes]
    prev_likes_ids.append(user_id)
    available_users = User.query.filter(User.id.not_in(prev_likes_ids)).all()
    #available_user_ids = [u.id for u in available_users]
    #for now quering all users and returning first one but that will change
    return available_users[2].to_dict(), 200

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
    reciprocal_like = Like.query.filter(Like.matcher_id == data.get('matchee_id')).filter(Like.matchee_id == data.get('matcher_id')).first()
    if reciprocal_like:
        if reciprocal_like.accepted == 1:
            #you found a match!
            new_match = Match(matcher_id = data.get('matcher_id'), matchee_id = data.get('matchee_id'))
            new_match_reciprocal = Match(matcher_id = data.get('matchee_id'), matchee_id = data.get('matcher_id'))
            return new_match.to_dict(), 200
    else:
        return {}, 204

@app.route('/<int:user_id>/matches', methods = ['GET'])
#return all matches
def user_matches(user_id):
    user = User.query.filter(User.id == user_id).first()
    matches = user.matchee_matches
    return [m.to_dict(rules=['-likes','-matches','-preferences']) for m in matches],200



### test routes in postman
#add filters

if __name__ == '__main__':
    app.run(port=5555, debug=True)





