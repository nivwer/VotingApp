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
    #     path("poll/create", poll_create, name="create_poll"),
    #     path("poll/<str:id>", poll_read, name="read_poll"),
    #     path("poll/<str:id>/update", poll_update, name="update_Poll"),
    #     path("poll/<str:id>/delete", poll_delete, name="delete_Poll"),
    # Option manager.
    # path("poll/<str:id>/option", option_add, name="add_option"),
    # path("poll/<str:id>/option/delete", option_delete, name="delete_option"),
    # CRUD Vote.
    # path("poll/<str:id>/vote", vote_add, name="add_vote"),
    # path("poll/<str:id>/vote/read", vote_read, name="get_vote"),
    # path("poll/<str:id>/vote/update", vote_update, name="update_vote"),
    # path("poll/<str:id>/vote/delete", vote_delete, name="delete_vote"),
    # Share manager.
    # path("poll/<str:id>/share", share_action, name="share_action"),
    # path("poll/<str:id>/unshare", unshare_action, name="unshare_action"),
    # Bookmark manager.
    # path("poll/<str:id>/bookmark", bookmark_action, name="bookmark_action"),
    # path("poll/<str:id>/unbookmark", unbookmark_action, name="unbookmark_action"),
    # CRUD Comment.
    # path("poll/<str:id>/comment", comment_add, name="add_comment"),
    # path("poll/<str:id>/comment/<str:comment_id>/update", comment_update, name="update_comment"),
    # path("poll/<str:id>/comment/<str:comment_id>/delete", comment_delete, name="delete_comment"),
    # Get Comments.
    # path("poll/<str:id>/comments", comments_read, name="read_comments"),
    # User Polls.
    # path("user/<str:id>", user_polls, name="polls_user"),
    # path("user/<str:id>/votes", user_voted_polls, name="voted_polls_user"),
    # path("user/<str:id>/shares", user_shared_polls, name="shared_polls_user"),
    # path("user/<str:id>/bookmarks", user_bookmarked_polls, name="bookmarked_polls_user"),
    # Categories.
    # path("categories", categories, name="categories"),
    # path("categories/data", categories_data, name="data_categories"),
    # path("category/<str:category>", category_polls, name="category_polls"),
    # Search.
    # path("search", search_polls, name="search_polls"),
    # NEW ROUTES.
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
        route="user/<int:id>",
        view=PollListByUserIdAPIView.as_view(),
        name="polls_user",
    ),
    path(
        route="user/<int:id>/votes",
        view=PollListByUserVotesAPIView.as_view(),
        name="polls_user_votes",
    ),
    path(
        route="user/<int:id>/shares",
        view=PollListByUserSharesAPIView.as_view(),
        name="polls_user_shares",
    ),
    path(
        route="user/<int:id>/bookmarks",
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
        route="category/<str:category>",
        view=PollListByCategoryAPIView.as_view(),
        name="polls_category",
    ),
    # Search.
    path(
        route="search",
        view=PollListByKeywordAPIView.as_view(),
        name="polls_search",
    ),
]
