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
        PreferenceOption.query.delete()

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

        for k in range(0,100):
            preference_1 = Preference(user_id=k,pref_category='Gender', pref_value=gender_options[fake.random_int(min=0,max=1)])
            preference_2 = Preference(user_id=k,pref_category='Height',pref_value=str(fake.random_int(min=150, max=200)))
            preferences.append(preference_1)
            preferences.append(preference_2)

        for j in range(1,80):       
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
        pref_option1 = PreferenceOption(category='Gender',input_type='dropdown',options='Man,Woman,Nonbinary')
        pref_option2 = PreferenceOption(category='Height',input_type='interval',minval=90, maxval=200)
        pref_option3 = PreferenceOption(category='Age', input_type='interval',minval=18, maxval = 100)
        pref_option4 = PreferenceOption(category='Ethnicity',input_type='dropdown', options='Black/African Descent,East Asian,Hispanic/Latino,Middle Eastern, Native American,Pacific Islander, South Asian, Southeast Asian, White/Caucasian,Other,Open to all')
        pref_option5 = PreferenceOption(category='Religion',input_type='dropdown',options='Agnostic,Atheist,Buddhist,Catholic,Christian,Hindu,Jewish,Muslim,Sikh,Spiritual,Other,Open to all')
        pref_option6 = PreferenceOption(category='Relationship Type',input_type='dropdown', options='Monogamy,Non-monogamy,Figuring out their relationship type,Open to all')
        pref_option7= PreferenceOption(category='Politics',input_type='dropdown',options='Liberal,Conservative,Agnostic')
        pref_option8 = PreferenceOption(category='Education',input_type='dropdown',options='High School,Bachelors,Masters,PhD')

        pref_options.append(pref_option1)
        pref_options.append(pref_option2)
        pref_options.append(pref_option3)
        pref_options.append(pref_option4)
        pref_options.append(pref_option5)
        pref_options.append(pref_option6)
        pref_options.append(pref_option7)
        pref_options.append(pref_option8)

    
  
        db.session.add_all(preferences)
        db.session.add_all(likes)
        db.session.add_all(matches)
        db.session.add_all(pref_options)
        db.session.commit()


            
