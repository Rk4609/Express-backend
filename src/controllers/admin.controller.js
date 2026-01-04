import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessandRefreshToken = async (adminId) => {
  //   LOGIN / REGISTER
  // fetch user from DB
  // generate access token
  //generate refresh token
  // refresh token ko user DB me store kar do
  // return {accessToken, refreshToken}
  // frontend cookies

  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and accessToken"
    );
  }
};


const registerAdmin = asyncHandler(async (req, res) => {
  // REGISTERATION

  // Get user details from frontend

  const { fullName, email, username, password } = req.body;

  if (
    // validation -not empty
    [fullName, email, username, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if uswe already exists: username, email

  const existedAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
  });

  if (existedAdmin) {
    throw new ApiError(409, "Admin with email or username already existed");
  }


  
  // create user object - create entry un db

  const admin = await Admin.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
  });
  // Remove password and refreshToken field from response
  const createdAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the admin");
  }

  // return response

  return res
    .status(201)
    .json(new ApiResponse(200, createdAdmin, "Admin registerd successfully"));
});


const loginAdmin = asyncHandler(async (req, res) => {
  //req body---data
  //username or email
  // find the user
  //password check
  //accress and refreshToken
  //send cookie

  const { identifier, password } = req.body;

  // if (!email) {
  //   throw new ApiError(400, " Email are required");
  // }
  if (!identifier || !password) {
  throw new ApiError(400, "Email and password are required");
}


  const admin = await Admin.findOne({
    $or: [{ email : identifier},
      {username : identifier}
    ],
  });

  if (!admin) {
    throw new ApiError(404, "admin not exist");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, " Inavlid admin Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    admin._id
  );

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          admin: loggedInAdmin,
          accessToken,
          refreshToken,
        },
        "Admin loggedIn Successfully"
      )
    );
});

export {registerAdmin,generateAccessandRefreshToken,loginAdmin}