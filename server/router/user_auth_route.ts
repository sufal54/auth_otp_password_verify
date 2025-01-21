import { Router } from "express";
import {
  auth_user,
  login,
  password_reset_request,
  req_user_data,
  reset_password,
  set_send_email,
  signup,
  verifiy_email,
} from "../controller/user_auth_controller";

const router = Router();

router.post("/signup", signup);
router.get("/get_user", auth_user, req_user_data);

router.get("/login/:user_name/:password", login);

router.post("/send_mail", set_send_email);
router.post("/verify", verifiy_email);
router.post("/reset_pass_req", password_reset_request);
router.post("/reset_pass", reset_password);

export default router;
