import { useSelector } from "react-redux";
import CardMenu from "../../../../Menus/CardMenu/CardMenu";
import CardMenuItem from "../../../../Menus/CardMenu/CardMenuItem/CardMenuItem";
import { FaTrash } from "react-icons/fa6";

function CommentCardMenu({ comment, deleteComment, isLoading }) {
  const { isAuthenticated, user, csrftoken } = useSelector((state) => state.session);

  // Delete poll.
  const handleDeleteComment = async (poll_id, id) => {
    try {
      const res = await deleteComment({
        id: poll_id,
        comment_id: id,
        headers: { "X-CSRFToken": csrftoken },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isAuthenticated && user.id == comment.user_id && (
        <CardMenu>
          <CardMenuItem
            onClick={() => handleDeleteComment(comment.poll_id, comment.id)}
            isLoading={isLoading}
            icon={<FaTrash />}
            children={"Remove"}
          />
        </CardMenu>
      )}
    </>
  );
}

export default CommentCardMenu;
