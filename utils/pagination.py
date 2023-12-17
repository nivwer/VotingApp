from django.core.paginator import Paginator


class Pagination:
    async def paginate(self, object_list: list, page: int, page_size: int):
        paginator = Paginator(object_list, page_size)
        total_pages = paginator.num_pages
        total_items = paginator.count

        items: list = []
        message = ""

        if total_items == 0:
            message = "No result found"
            has_previous = False
            has_next = False
        else:
            page_obj = paginator.get_page(page)
            has_previous = page_obj.has_previous()
            has_next = page_obj.has_next()

            if not has_next:
                message = "No more results"

            items = page_obj.object_list if page else object_list

        data: dict = {
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
