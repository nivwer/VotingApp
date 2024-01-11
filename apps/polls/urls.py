from django.urls import path

from .views.poll_view import PollAPIView

from .views.poll_option_view import PollOptionAPIView
from .views.poll_vote_view import PollVoteAPIView
from .views.poll_share_view import PollShareAPIView
from .views.poll_bookmark_view import PollBookmarkAPIView
from .views.poll_comment_view import PollCommentAPIView
from .views.poll_comment_list_view import PollCommentListAPIVIew

from .views.poll_list_by_user_views import (
    PollListByUserIdAPIView,
    PollListByUserVotesAPIView,
    PollListByUserSharesAPIView,
    PollListByUserBookmarksAPIView,
)

from .views.poll_list_by_category_view import PollListByCategoryAPIView
from .views.categories_view import CategoriesAPIView
from .views.poll_list_by_keyword_view import PollListByKeywordAPIView

urlpatterns = [
    # CRUD Poll.
    path(
        route="poll",
        view=PollAPIView.as_view(),
        name="poll_create",
    ),
    path(
        route="poll/<str:id>",
        view=PollAPIView.as_view(),
        name="poll",
    ),
    # Option manager.
    path(
        route="poll/<str:id>/option",
        view=PollOptionAPIView.as_view(),
        name="poll_option",
    ),
    # Vote manager.
    path(
        route="poll/<str:id>/vote",
        view=PollVoteAPIView.as_view(),
        name="poll_vote",
    ),
    # Share manager.
    path(
        route="poll/<str:id>/share",
        view=PollShareAPIView.as_view(),
        name="poll_share",
    ),
    # Bookmark manager.
    path(
        route="poll/<str:id>/bookmark",
        view=PollBookmarkAPIView.as_view(),
        name="poll_bookmark",
    ),
    # CRUD Comment.
    path(
        route="poll/<str:id>/comment",
        view=PollCommentAPIView.as_view(),
        name="poll_comment_create",
    ),
    path(
        route="poll/<str:id>/comment/<str:comment_id>",
        view=PollCommentAPIView.as_view(),
        name="poll_comment",
    ),
    # Poll Comments.
    path(
        route="poll/<str:id>/comments",
        view=PollCommentListAPIVIew.as_view(),
        name="poll_comments",
    ),
    # User Polls.
    path(
        route="polls/user/<int:id>",
        view=PollListByUserIdAPIView.as_view(),
        name="polls_user",
    ),
    path(
        route="polls/user/<int:id>/votes",
        view=PollListByUserVotesAPIView.as_view(),
        name="polls_user_votes",
    ),
    path(
        route="polls/user/<int:id>/shares",
        view=PollListByUserSharesAPIView.as_view(),
        name="polls_user_shares",
    ),
    path(
        route="polls/user/<int:id>/bookmarks",
        view=PollListByUserBookmarksAPIView.as_view(),
        name="polls_user_bookmarks",
    ),
    # Categories.
    path(
        route="categories",
        view=CategoriesAPIView.as_view(),
        name="categories",
    ),
    path(
        route="polls/category/<str:category>",
        view=PollListByCategoryAPIView.as_view(),
        name="polls_category",
    ),
    # Search.
    path(
        route="polls/search",
        view=PollListByKeywordAPIView.as_view(),
        name="polls_search",
    ),
]
