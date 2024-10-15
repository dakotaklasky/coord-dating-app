#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import date

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Like, Match, Preference, PreferenceOption, UserAttribute

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        #delete all previous data
        Like.query.delete()
        Match.query.delete()
        Preference.query.delete()
        User.query.delete()
        PreferenceOption.query.delete()
        UserAttribute.query.delete()

        unique_first_names = set()  # Use a set to ensure uniqueness

        while len(unique_first_names) < 100:
            unique_first_names.add(fake.first_name())

        # Convert the set to a list if needed
        unique_first_names_list = list(unique_first_names)

        users = []
        for i in range(0,100):
            user = User(username = unique_first_names_list[i],bio = fake.text(), image = fake.image_url(250,250))
            user.password_hash = user.username + 'password'
            users.append(user)

        db.session.add_all(users)
        db.session.commit()

        preferences = []
        likes = []
        matches = []
        user_attributes = []

        gender_options = ['Man','Woman','Nonbinary']
        height_options = PreferenceOption(category='Height',input_type='interval',minval=90, maxval=200)
        age_options = PreferenceOption(category='Age', input_type='date',minval=18, maxval = 100)
        ethnicity_options = ['Black/African Descent','East Asian','Hispanic/Latino','Middle Eastern', 'Native American','Pacific Islander', 'South Asian', 'Southeast Asian', 'White/Caucasian','Other']
        religion_options = ['Agnostic','Atheist','Buddhist','Catholic','Christian','Hindu','Jewish','Muslim','Sikh','Spiritual','Other']
        relationship_options = ['Monogamy','Non-monogamy','Figuring out their relationship type']
        politics_options = ['Liberal','Conservative','Moderate','Agnostic']
        education_options = ['High School','Bachelors','Masters','PhD']

        for k in range(1,101):
            preference_1 = Preference(user_id=k,pref_category='Gender', pref_value=gender_options[fake.random_int(min=0,max=2)])
            # preference_2 = Preference(user_id=k,pref_category='Height',pref_value=fake.random_int(min=90, max=100))
            preference_3 = Preference(user_id=k,pref_category='Age',pref_value=fake.random_int(min=18, max=30))
            # preference_4 = Preference(user_id=k,pref_category='Height',pref_value=fake.random_int(min=150, max=200))
            preference_5 = Preference(user_id=k,pref_category='Age',pref_value=fake.random_int(min=31, max=100))
            # preference_6 = Preference(user_id=k,pref_category='Relationship',pref_value=relationship_options[fake.random_int(min=0,max=2)])
            #preference_7 = Preference(user_id=k,pref_category='Politics',pref_value=politics_options[fake.random_int(min=0,max=3)])
            preferences.append(preference_1)
            # preferences.append(preference_2)
            preferences.append(preference_3)
            # preferences.append(preference_4)
            preferences.append(preference_5)
            # preferences.append(preference_6)
            #preferences.append(preference_7)
             
            attribute_1 = UserAttribute(user_id=k,attribute_category='Gender', attribute_value=gender_options[fake.random_int(min=0,max=2)])
            attribute_2 = UserAttribute(user_id=k,attribute_category='Height',attribute_value=fake.random_int(min=150, max=200))
            attribute_3 = UserAttribute(user_id=k,attribute_category='Birthdate', attribute_value=fake.date_between(start_date=date(1944,1,1), end_date=date(2005,12,31)).isoformat() )
            attribute_4 = UserAttribute(user_id=k,attribute_category='Ethnicity',attribute_value=ethnicity_options[fake.random_int(min=0,max=9)])
            attribute_5 = UserAttribute(user_id=k,attribute_category='Religion',attribute_value=religion_options[fake.random_int(min=0,max=10)])
            attribute_6 = UserAttribute(user_id=k,attribute_category='Relationship',attribute_value=relationship_options[fake.random_int(min=0,max=2)])
            attribute_7 = UserAttribute(user_id=k,attribute_category='Politics',attribute_value=politics_options[fake.random_int(min=0,max=3)])
            attribute_8 = UserAttribute(user_id=k,attribute_category='Education',attribute_value=education_options[fake.random_int(min=0,max=3)])
            user_attributes.append(attribute_1)
            user_attributes.append(attribute_2)
            user_attributes.append(attribute_3)
            user_attributes.append(attribute_4)
            user_attributes.append(attribute_5)
            user_attributes.append(attribute_6)
            user_attributes.append(attribute_7)
            user_attributes.append(attribute_8)
           

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
        pref_option4 = PreferenceOption(category='Ethnicity',input_type='dropdown', options='Black/African Descent,East Asian,Hispanic/Latino,Middle Eastern, Native American,Pacific Islander, South Asian, Southeast Asian, White/Caucasian,Other')
        pref_option5 = PreferenceOption(category='Religion',input_type='dropdown',options='Agnostic,Atheist,Buddhist,Catholic,Christian,Hindu,Jewish,Muslim,Sikh,Spiritual,Other')
        pref_option6 = PreferenceOption(category='Relationship',input_type='dropdown', options='Monogamy,Non-monogamy,Figuring out their relationship type')
        pref_option7= PreferenceOption(category='Politics',input_type='dropdown',options='Liberal,Conservative,Moderate,Agnostic')
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
        db.session.add_all(user_attributes)
        db.session.commit()


            
