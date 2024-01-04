from django.core.paginator import Paginator
from asgiref.sync import sync_to_async


class Pagination:
    def paginate(self, object_list: list, page: int, page_size: int):
        items: list = []
        message: str = ""
        data: dict = {}

        paginator = Paginator(object_list, page_size)

        total_pages: int = paginator.num_pages
        total_items: int = paginator.count
        has_next: bool = False
        has_previous: bool = False

        if total_items == 0:
            message = "No result found"
        else:
            page_obj = paginator.get_page(page)
            has_previous: bool = page_obj.has_previous()
            has_next: bool = page_obj.has_next()

            if not has_next:
                message = "No more results"

            items = page_obj.object_list if page else object_list

        data = {
            "items": items,
            "message": message,
            "paginator": {
                "page": page,
                "total_items": total_items,
                "total_pages": total_pages,
                "has_previous": has_previous,
                "has_next": has_next,
            },
        }

        return data

    async def a_paginate(self, object_list: list, page: int, page_size: int):
        return await sync_to_async(self.paginate)(
            object_list=object_list, page=page, page_size=page_size
        )
