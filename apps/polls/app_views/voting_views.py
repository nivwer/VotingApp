# Rest Framework.
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
# Async Rest Framework support.
from adrf.decorators import api_view
# MongoDB connection.
from utils.mongo_connection import MongoDBSingleton
# MongoDB.
from pymongo import UpdateOne
from pymongo.errors import PyMongoError
from bson import json_util
from bson.objectid import ObjectId


# Helpers.

# Get collections from a database in MongoDB.
class GetCollectionsMongoDB:
    def __init__(self, database, collections):
        # Get database.
        db = MongoDBSingleton().client[database]
        # Get collections.
        for collection in collections:
            setattr(self, collection, db[collection])


# Views.

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def get_user_vote(request, poll_id):
    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB('polls_db', ['user_votes'])

        # Find the user voted polls in the user_votes collection.
        user_vote = await polls_db.user_votes.find_one(
            {
                'user_id': request.user.id,
                'voted_polls.poll_id': poll_id
            },
            projection={'voted_polls.$': 1})

        # If the user has not voted a poll.
        if not user_vote:
            return Response({'vote': ''})

        # Response.
        return Response({'vote': user_vote['voted_polls'][0]['vote']})

    # Handle validation errors.
    except ValidationError as e:
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def add_user_vote(request, poll_id):
    session = None
    add_vote_value = request.data['vote']

    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'user_votes'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(poll_id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

        # Convert the BSON object to a JSON object.
        poll_json = json_util._json_convert((poll_bson))

        # Is voter.
        is_voter = request.user.id in poll_json['voters']
        if is_voter:
            raise ValidationError(
                'The user has already voted in this poll.')

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Insert or update the user votes object.
                await polls_db.user_votes.update_one(
                    {'user_id': request.user.id},
                    {
                        '$addToSet': {
                            'voted_polls': {
                                'poll_id': poll_id,
                                'vote': add_vote_value
                            }
                        }
                    },
                    upsert=True,
                    session=session
                )

                await polls_db.polls.bulk_write([
                    # Save the user id in poll voters list.
                    UpdateOne(
                        {'_id': ObjectId(poll_id)},
                        {
                            '$push': {'voters': request.user.id},
                            '$inc': {'total_votes': 1}
                        }
                    ),
                    # Add the new vote.
                    UpdateOne(
                        {
                            '_id': ObjectId(poll_id),
                            'options.option_text': add_vote_value
                        },
                        {
                            '$inc': {'options.$.votes': 1}
                        }
                    )
                ], session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response('res')

    # Handle validation errors.
    except ValidationError as e:
        if session:
            await session.abort_transaction()
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()


# Handles the CRUD of the vote.
@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def update_user_vote(request, poll_id):
    session = None
    add_vote_value = request.data['vote']
    del_vote_value = None

    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'user_votes'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(poll_id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')

        # Convert the BSON object to a JSON object.
        poll_json = json_util._json_convert((poll_bson))

        # Is voter.
        is_voter = request.user.id in poll_json['voters']
        if not is_voter:
            raise ValidationError(
                'The user has not voted in this poll.')

        # Find the user voted polls in the user_votes collection.
        user_vote = await polls_db.user_votes.find_one(
            {
                'user_id': request.user.id,
                'voted_polls.poll_id': poll_id
            },
            projection={'voted_polls.$': 1})

        # If the user has not voted a poll.
        if not user_vote:
            raise ValidationError(
                'The user has not voted in this poll.')

         # If the user has voted a poll.
        del_vote_value = user_vote['voted_polls'][0]['vote']

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Add the user vote in the votes object.
                await polls_db.user_votes.update_one(
                    {
                        'user_id': request.user.id,
                        'voted_polls.poll_id': poll_id
                    },
                    {
                        '$set': {'voted_polls.$.vote': add_vote_value}
                    },
                    session=session)

                await polls_db.polls.bulk_write([
                    # Remove the previous vote.
                    UpdateOne(
                        {
                            '_id': ObjectId(poll_id),
                            'options.option_text': del_vote_value
                        },
                        {
                            '$inc': {'options.$.votes': -1}
                        }
                    ),
                    # Add the new vote.
                    UpdateOne(
                        {
                            '_id': ObjectId(poll_id),
                            'options.option_text': add_vote_value
                        },
                        {
                            '$inc': {'options.$.votes': 1}
                        }
                    )
                ], session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response('res')

    # Handle validation errors.
    except ValidationError as e:
        if session:
            await session.abort_transaction()
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()


# Handles the CRUD of the vote.
@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
async def delete_user_vote(request, poll_id):
    session = None
    del_vote_value = None

    try:
        # Get collections from the polls database.
        polls_db = GetCollectionsMongoDB(
            'polls_db', ['polls', 'user_votes'])

        # Find the poll in the polls collection.
        poll_bson = await polls_db.polls.find_one(
            {'_id': ObjectId(poll_id)})

        # If poll is not found.
        if not poll_bson:
            raise ValidationError('Poll is not found.')
        # Convert the BSON object to a JSON object.
        poll_json = json_util._json_convert((poll_bson))

        # Is voter.
        is_voter = request.user.id in poll_json['voters']
        if not is_voter:
            raise ValidationError(
                'The user has not voted in this poll.')

         # Find the user voted polls in the user_votes collection.
        user_vote = await polls_db.user_votes.find_one(
            {
                'user_id': request.user.id,
                'voted_polls.poll_id': poll_id
            },
            projection={'voted_polls.$': 1})

        # If the user has not voted a poll.
        if not user_vote:
            raise ValidationError(
                'The user has not voted in this poll.')

         # If the user has voted a poll.
        del_vote_value = user_vote['voted_polls'][0]['vote']

        # Initialize a MongoDB session.
        async with await MongoDBSingleton().client.start_session() as session:
            # Initialize a MongoDB transaccion.
            async with session.start_transaction():

                # Remove the user vote in the votes object.
                await polls_db.user_votes.update_one(
                    {'user_id': request.user.id},
                    {
                        '$pull': {'voted_polls': {'poll_id': poll_id}}
                    },
                    session=session
                )

                await polls_db.polls.bulk_write([
                    # Remove the user id in poll voters list.
                    UpdateOne(
                        {'_id': ObjectId(poll_id)},
                        {
                            '$pull': {'voters': request.user.id},
                            '$inc': {'total_votes': -1}
                        }
                    ),
                    # Remove the previous vote.
                    UpdateOne(
                        {
                            '_id': ObjectId(poll_id),
                            'options.option_text': del_vote_value
                        },
                        {
                            '$inc': {'options.$.votes': -1}
                        },
                    )
                ], session=session)

                # Save transaction.
                await session.commit_transaction()

                # Response.
                return Response('res')

    # Handle validation errors.
    except ValidationError as e:
        if session:
            await session.abort_transaction()
        return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

    # Handle MongoDB errors.
    except PyMongoError as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Handle other exceptions.
    except Exception as e:
        if session:
            await session.abort_transaction()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    finally:
        if session:
            await session.end_session()
