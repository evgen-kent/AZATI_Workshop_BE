import { ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * Matches the user ID from the authorization header with the provided user ID.
 * @param {Request} request - The Express request object.
 * @param {string} id - The user ID.
 */
export const matchAuthorizationWithId = (request: Request, id: string) => {
  const authorization = request.headers['authorization'];
  const token = authorization.split(' ')[1]; //if bearer
  const decodedToken: any = jwt.decode(token);

  if (decodedToken.id !== id) {
    throw new ForbiddenException('Id from token and provided id mismatch');
  }
};
