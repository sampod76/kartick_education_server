import { ENUM_USER_ROLE } from "../../../enums/users";
import { User } from "./user.model";

export const findLastStudentId = async () => {
    const lastUser = await User.findOne(
      { role: ENUM_USER_ROLE.STUDENT },
      { userId: 1, _id: 0 }
    )
      .sort({ createdAt: -1 })
      .lean();
    return lastUser?.userId ? lastUser.userId.substring(4) : undefined;
  };