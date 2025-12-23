/**
 * AuthController
 * Handles authentication-related endpoints
 */

import {
  RegisterUserCommandHandler,
  LoginUserCommandHandler,
  UpdateUserProfileCommandHandler,
  ChangePasswordCommandHandler,
} from "@/application/user/commands";
import { GetUserProfileQueryHandler } from "@/application/user/queries";
import { JwtService } from "@/infrastructure/authentication/JwtService";
import { asyncHandler, AppError } from "../middleware";

export class AuthController {
  constructor(
    private readonly registerHandler: RegisterUserCommandHandler,
    private readonly loginHandler: LoginUserCommandHandler,
    private readonly updateProfileHandler: UpdateUserProfileCommandHandler,
    private readonly changePasswordHandler: ChangePasswordCommandHandler,
    private readonly getUserProfileHandler: GetUserProfileQueryHandler,
    private readonly jwtService: JwtService
  ) {}

  register = asyncHandler(async (req: Request): Promise<Response> => {
    const body = await req.json();
    
    // Basic validation
    if (!body.email || typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      throw new AppError(400, "Invalid email", "VALIDATION_ERROR");
    }
    if (!body.password || typeof body.password !== "string") {
      throw new AppError(400, "Password is required", "VALIDATION_ERROR");
    }

    const user = await this.registerHandler.handle({
      email: body.email,
      password: body.password,
    });

    // Generate JWT token
    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  });

  login = asyncHandler(async (req: Request): Promise<Response> => {
    const body = await req.json();
    
    // Basic validation
    if (!body.email || typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      throw new AppError(400, "Invalid email", "VALIDATION_ERROR");
    }
    if (!body.password || typeof body.password !== "string") {
      throw new AppError(400, "Password is required", "VALIDATION_ERROR");
    }

    const user = await this.loginHandler.handle({
      email: body.email,
      password: body.password,
    });

    // Generate JWT token
    const token = this.jwtService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  });

  getMe = asyncHandler(async (req: Request): Promise<Response> => {
    // User info is attached by auth middleware
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const profile = await this.getUserProfileHandler.handle({
      userId: user.userId,
    });

    return Response.json({
      user: {
        id: user.userId,
        email: user.email,
        profile: profile || null,
      },
    });
  });

  updateProfile = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const body = await req.json();

    const profile = await this.updateProfileHandler.handle({
      userId: user.userId,
      firstName: body.firstName,
      lastName: body.lastName,
      displayName: body.displayName,
      avatar: body.avatar,
    });

    return Response.json({ profile });
  });

  changePassword = asyncHandler(async (req: Request): Promise<Response> => {
    const user = (req as any).user;
    
    if (!user) {
      throw new AppError(401, "Unauthorized", "UNAUTHORIZED");
    }

    const body = await req.json();

    // Basic validation
    if (!body.currentPassword || typeof body.currentPassword !== "string") {
      throw new AppError(400, "Current password is required", "VALIDATION_ERROR");
    }
    if (!body.newPassword || typeof body.newPassword !== "string") {
      throw new AppError(400, "New password is required", "VALIDATION_ERROR");
    }

    await this.changePasswordHandler.handle({
      userId: user.userId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });

    return Response.json({ message: "Password changed successfully" });
  });
}

