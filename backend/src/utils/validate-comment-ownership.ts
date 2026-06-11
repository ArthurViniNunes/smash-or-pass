import { RoleName }
  from "../generated/prisma";

import { HttpError }
  from "./http-error";

type Params = {
  commentUserId: string;
  currentUserId: string;
  currentUserRole: RoleName;
};

export function validateCommentOwnership({
  commentUserId,
  currentUserId,
  currentUserRole,
}: Params) {
  const isOwner =
    commentUserId === currentUserId;

  const isAdmin =
    currentUserRole === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new HttpError(
      403,
      "You do not have permission to modify this comment"
    );
  }
}