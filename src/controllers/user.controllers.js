import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //  res.status(200).json({
  //   message: "ok",
  // });
  const { email, password, userName, fullName } = req.body;
  console.log("email is :", email);
  console.log("password is :", password);

  // if (fullName === "") {
  //   throw new ApiError(400, "fullname is required"); // used when beginner
  // }

  if (
    [fullName, email, password, userName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Cannot be Empty");
  }

  const existedUser = User.findOne({
    $or: [{ userName }, { email }], // to check if the email or username exist before
  });

  if (existedUser) {
    throw new ApiError(409, "User Already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    password,
    email,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the User");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered succesfully"));
});

export { registerUser };
