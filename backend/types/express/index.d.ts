import JwtPayload from "../JwtPayload";

declare global {
    namespace Express {
        interface Request {
            user?: number; // User ID
            email?: string; // User email
            payload?: JwtPayload; // JWT payload
        }
    }
}