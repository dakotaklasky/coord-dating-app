#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Like, Match, Preference

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        #delete all previous data
        Like.query.delete()
        Match.query.delete()
        Preference.query.delete()
        User.query.delete()

        users = []
        for i in range(0,50):
            user = User(username = fake.name(),age = fake.random_int(min=18, max=65),bio = fake.text(), image = fake.image_url(250,250))
            users.append(user)

        db.session.add_all(users)
        db.session.commit()

        preferences = []
        likes = []
        matches = []
        for j in range(1,44):
            preference_1 = Preference(user_id=j,pref_category='Education',pref_value=fake.pystr())
            preference_2 = Preference(user_id=j,pref_category='Occupation', pref_value=fake.pystr())
            preference_3 = Preference(user_id=j,pref_category='Height',pref_value=str(fake.random_int(min=150, max=220)))
            preferences.append(preference_1)
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


        db.session.add_all(preferences)
        db.session.add_all(likes)
        db.session.add_all(matches)
        db.session.commit()




# user1 = User(id=1,username="dk",age=27,bio="test bio")
# pref1 =Preference(user_id=1,pref_category="Occupation",pref_value="Doctor")
# pref2 =Preference(user_id=1,pref_category="Height",pref_value="180")
# user2 = User(id=2,username="t",age=27,bio="test bio")
# user3 = User(id=3,username="d",age=27,bio="test bio")
# like1 = Like(matcher_id=1,matchee_id=2,accepted=1)
# like2 = Like(matcher_id=2,matchee_id=1,accepted=1)
# like3 = Like(matcher_id=1, matchee_id=3,accepted=-1)
# match1 = Match(matcher_id=1,matchee_id=2)
# match2 = Match(matcher_id=2,matchee_id=1)

            
