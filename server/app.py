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
    return '<h1>Project Server</h1>'

# @app.route('/likes',['GET','POST'])
# def likes():
#     if request.method == 'GET':



if __name__ == '__main__':
    app.run(port=5555, debug=True)




#get match prospect
    #return a user that current user has not yet liked

# store the users vote on the person
    #either like or dislike in like table
    #check if a match is made - if it is add to match table and return to client that match was made

#return all matches to client

