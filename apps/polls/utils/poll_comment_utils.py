from bson import BSON

from rest_framework.exceptions import PermissionDenied

from .poll_utils import PollUtils


class PollCommentUtils(PollUtils):
    

    async def simplify_poll_comment_data(self, comment: dict):
        """
        Simplifies poll comment data by converting MongoDB-specific fields.
        """
        comment['id'] = comment['_id']['$oid']
        del comment['_id']
        comment['created_at'] = comment['created_at']['$date']
        comment['poll_id'] = comment['poll_id']['$oid']
        

        return comment
