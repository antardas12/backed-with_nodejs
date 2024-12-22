import { Router } from "express";
import { accessRefreshToken, logInUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewears.js";
import { verifyJWT } from "../middlewares/auth.middelwere.js";


const router = Router();

router.route("/register").post(
    upload.fields(
        [
            {
                name: "avatar",
                maxCount: 1
            }, {
                name: "coverimage",
                maxCount: 1
            }
        ]
    ),
    registerUser);


router.route("/login").post(logInUser);

//secure 
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(accessRefreshToken)

export default router;