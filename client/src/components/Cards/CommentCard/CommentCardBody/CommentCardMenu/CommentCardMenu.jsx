// Hooks.
import { useSelector } from "react-redux";
// Components.
import CardMenu from "../../../../Menus/CardMenu/CardMenu";
import CardMenuItem from "../../../../Menus/CardMenu/CardMenuItem/CardMenuItem";
// Icons.
import { FaEllipsis, FaTrash } from "react-icons/fa6";

// SubComponent ( CommentCardBody ).
function CommentCardMenu({ comment, deleteComment, isLoading }) {
  const { isAuthenticated, token, user } = useSelector(
    (state) => state.session
  );

  // Delete poll.
  const handleDeleteComment = async (poll_id, id) => {
    try {
      const res = await deleteComment({
        id: poll_id,
        comment_id: id,
        headers: { Authorization: `Token ${token}` },
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
          >
            Remove
          </CardMenuItem>
        </CardMenu>
      )}
    </>
  );
}

export default CommentCardMenu;
