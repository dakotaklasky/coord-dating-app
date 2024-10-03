#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Like, Match, Preference, PreferenceOption

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        #delete all previous data
        Like.query.delete()
        Match.query.delete()
        Preference.query.delete()
        User.query.delete()

        gender_options = ['Man','Woman']
        users = []
        for i in range(0,100):
            user = User(username = fake.name(),age = fake.random_int(min=18, max=65),bio = fake.text(), image = fake.image_url(250,250), gender=gender_options[fake.random_int(min=0,max=1)], height=fake.random_int(min=150, max=200))
            users.append(user)

        db.session.add_all(users)
        db.session.commit()

        preferences = []
        likes = []
        matches = []
        for j in range(1,80):

            preference_2 = Preference(user_id=j,pref_category='Gender', pref_value=gender_options[fake.random_int(min=0,max=1)])
            preference_3 = Preference(user_id=j,pref_category='Height',pref_value=str(fake.random_int(min=150, max=200)))
            preferences.append(preference_2)
            preferences.append(preference_3)
        
            like_1 = Like(matcher_id=j,matchee_id=j+2,accepted=-1)
            like_2 = Like(matcher_id=j,matchee_id=j+4, accepted=1)
            like_3 = Like(matcher_id=j,matchee_id=j+6, accepted=1)
            likes.append(like_1)
            likes.append(like_2)
            likes.append(like_3)

            match_1 = Match(matcher_id=j,matchee_id=j+1)
            match_2 = Match(matcher_id=j,matchee_id=j+3)
            match_3 = Match(matcher_id=j,matchee_id=j+5)
            likes.append(match_1)
            likes.append(match_2)
            likes.append(match_3)

        pref_options = []
        pref_option2 = PreferenceOption(category='Gender',options='Man,Woman,Nonbinary')
        pref_option3 = PreferenceOption(category='Height',minval=90, maxval=200)
        pref_options.append(pref_option2)
        pref_options.append(pref_option3)
    
  
        db.session.add_all(preferences)
        db.session.add_all(likes)
        db.session.add_all(matches)
        db.session.add_all(pref_options)
        db.session.commit()


            
