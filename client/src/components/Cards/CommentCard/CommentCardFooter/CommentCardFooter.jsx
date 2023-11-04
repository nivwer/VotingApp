// SubComponents.
import CommentCardMenu from "./CommentCardMenu/CommentCardMenu";

// SubComponent ( CommentCard ).
function CommentCardFooter({ comment, isLoading, deleteComment }) {
  return (
    <>
      <CommentCardMenu
        id={comment._id}
        user_id={comment.user_id}
        poll_id={comment.poll_id}
        deleteComment={deleteComment}
        isLoading={isLoading}
      />
    </>
  );
}

export default CommentCardFooter;
