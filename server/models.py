from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

class Like(db.Model, SerializerMixin):
    __tablename__ = 'likes'
    id = db.Column(db.Integer, primary_key=True)
    matcher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    matchee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    accepted = db.Column(db.Integer, nullable=False)

    matcher_user = db.relationship('User',foreign_keys = [matcher_id],back_populates='likes')
    matchee_user = db.relationship('User',foreign_keys = [matchee_id],back_populates='likes')
    serialize_rules = ['-matcher_user','-matchee_user']

    def __repr__(self):
        return f'<Like id:{self.id}, matcher:{self.matcher_id}, matchee:{self.matchee_id},accepted:{self.accepted}>'


class Match(db.Model, SerializerMixin):
    __tablename__ = 'matches'
    id = db.Column(db.Integer, primary_key=True)
    matcher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable= False)
    matchee_id = db.Column(db.Integer,db.ForeignKey('users.id'), nullable=False)

    matcher_user = db.relationship('User',foreign_keys = [matcher_id],back_populates='matches')
    matchee_user = db.relationship('User',foreign_keys = [matchee_id],back_populates='matches')
    serialize_rules = ['-matcher_user','-matchee_user']

    def __repr__(self):
        return f'<Match id:{self.id}, matcher:{self.matcher_id}, matchee:{self.matchee_id}>'

class Preference(db.Model, SerializerMixin):
    __tablename__ = 'preferences'
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'), nullable=False)
    pref_category = db.Column(db.String, nullable=False)
    pref_value = db.Column(db.String)

    user = db.relationship('User',back_populates='preferences')
    serialize_rules = ['-user.preferences']

    def __repr__(self):
        return f'<Preference id:{self.id}, user:{self.user_id}, pref_category:{self.pref_category}, pref_value:{self.pref_value}>'

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    age = db.Column(db.Integer)
    #image_url = db.Column(db.String)
    bio = db.Column(db.String)

    preferences = db.relationship('Preference',back_populates='user')
    likes = db.relationship('Like',foreign_keys=[Like.matcher_id],back_populates='matcher_user')
    matches = db.relationship('Match',foreign_keys=[Match.matcher_id],back_populates='matcher_user')
    serialize_rules = ['-preferences.user','-likes','-matches']

    matchee_likes = association_proxy('likes','matchee_user',creator=lambda matchee_user_obj: Like(matchee_user=matchee_user_obj))
    matchee_matches = association_proxy('matches','matchee_user',creator=lambda matchee_user_obj: Match(matchee_user=matchee_user_obj))

    def __repr__(self):
        return f'<User id:{self.id}, username:{self.username}, age:{self.age}>'



