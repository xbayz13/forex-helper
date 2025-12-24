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
import { prisma } from "@/infrastructure/persistence/database/prisma";

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
        username: user.email.split("@")[0], // Use email prefix as username
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
        username: user.email.split("@")[0], // Use email prefix as username
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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

    try {
      // Get user from database
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
      });

      if (!dbUser) {
        throw new AppError(404, "User not found", "NOT_FOUND");
      }

      // Get profile if exists
      let profile = null;
      try {
        profile = await this.getUserProfileHandler.handle({
          userId: user.userId,
        });
      } catch (error) {
        // Profile doesn't exist, that's okay
      }

      return Response.json({
        user: {
          id: user.userId,
          email: user.email,
          username: profile?.displayName || profile?.fullName || user.email.split("@")[0],
          createdAt: dbUser.createdAt.toISOString(),
          updatedAt: dbUser.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      console.error("Error in getMe:", error);
      throw error;
    }
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

