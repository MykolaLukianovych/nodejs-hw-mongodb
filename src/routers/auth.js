import { Router } from 'express';

import { controllerWrapper } from '../utils/controllerWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  authRegisterSchema,
  authLoginSchema,
  authSendResetEmailSchema,
  authResetPwdSchema,
} from '../validation/auth.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  controllerWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  controllerWrapper(loginController),
);

authRouter.post('/refresh', controllerWrapper(refreshController));

authRouter.post('/logout', controllerWrapper(logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(authSendResetEmailSchema),
  controllerWrapper(sendResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(authResetPwdSchema),
  controllerWrapper(resetPasswordController),
);

export default authRouter;
