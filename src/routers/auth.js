import { Router } from 'express';

import { controllerWrapper } from '../utils/controllerWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { authRegisterSchema, authLoginSchema } from '../validation/auth.js';
import { registerController, loginController } from '../controllers/auth.js';

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

export default authRouter;
