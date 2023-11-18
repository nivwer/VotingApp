# Django.
from django.urls import path
# Poll.
from .views.poll import poll_create, poll_read, poll_update, poll_delete
from .views.option import option_add, option_delete
from .views.vote import vote_add, vote_read, vote_update, vote_delete
from .views.comment import comment_add, comment_update, comment_delete, comments_read
from .views.share import share_action, unshare_action
from .views.bookmark import bookmark_action, unbookmark_action
# User.
from .views.user import user_polls, user_voted_polls, user_shared_polls, user_bookmarked_polls
# Categories.
from .views.categories import categories, categories_data
from .views.category import category_polls
# Search.
from .views.search import search_polls


urlpatterns = [
    # CRUD Poll.
    path('poll', poll_create, name='create_poll'),
    path('poll/<str:id>', poll_read, name='read_poll'),
    path('poll/<str:id>/update', poll_update, name='update_Poll'),
    path('poll/<str:id>/delete', poll_delete, name='delete_Poll'),

    # Option manager.
#     path('poll/<str:id>/option', option_manager, name='option_manager'),
    path('poll/<str:id>/option', option_add, name='add_option'),
    path('poll/<str:id>/option/delete', option_delete, name='delete_option'),

    # CRUD Vote.
    path('poll/<str:id>/vote', vote_add, name='add_vote'),
    path('poll/<str:id>/vote/read', vote_read, name='get_vote'),
    path('poll/<str:id>/vote/update', vote_update, name='update_vote'),
    path('poll/<str:id>/vote/delete', vote_delete, name='delete_vote'),

    # Share manager.
    path('poll/<str:id>/share', share_action, name='share_action'),
    path('poll/<str:id>/unshare', unshare_action, name='unshare_action'),

    # Bookmark manager.
    path('poll/<str:id>/bookmark', bookmark_action, name='bookmark_action'),
    path('poll/<str:id>/unbookmark', unbookmark_action, name='unbookmark_action'),

    # CRUD Comment.
    path('poll/<str:id>/comment', comment_add, name='add_comment'),
    path('poll/<str:id>/comment/<str:comment_id>/update',
         comment_update, name='update_comment'),
    path('poll/<str:id>/comment/<str:comment_id>/delete',
         comment_delete, name='delete_comment'),
    # Get Comments.
    path('poll/<str:id>/comments', comments_read, name='read_comments'),



    # User Polls.
    path('user/<str:id>', user_polls, name='polls_user'),
    path('user/<str:id>/votes', user_voted_polls, name='voted_polls_user'),
    path('user/<str:id>/shares', user_shared_polls, name='shared_polls_user'),
    path('user/<str:id>/bookmarks', user_bookmarked_polls,
         name='bookmarked_polls_user'),

    # Categories.
    path('categories', categories, name="categories"),
    path('categories/data', categories_data, name="data_categories"),
    path('category/<str:category>', category_polls, name='category_polls'),

    # Search.
    path('search', search_polls, name='search_polls'),
]
