/**
 * API Setup
 * Initialize all dependencies and controllers for API
 */

import { AuthController } from "./controllers/AuthController";
import { LotCalculatorController } from "./controllers/LotCalculatorController";
import { TradeHistoryController } from "./controllers/TradeHistoryController";
import { ReportsController } from "./controllers/ReportsController";

// Repositories
import { UserRepository } from "@/infrastructure/persistence/repositories/UserRepository";
import { UserProfileRepository } from "@/infrastructure/persistence/repositories/UserProfileRepository";
import { TradeRepository } from "@/infrastructure/persistence/repositories/TradeRepository";
import { NullTradingReportRepository } from "@/infrastructure/persistence/repositories/NullTradingReportRepository";

// Domain Services
import { AuthenticationService } from "@/domain/user/services/AuthenticationService";
import { BcryptPasswordHasher } from "@/infrastructure/authentication/BcryptPasswordHasher";
import { PipValueCalculator } from "@/domain/lot-calculator/services/PipValueCalculator";
import { PositionSizeCalculator } from "@/domain/lot-calculator/services/PositionSizeCalculator";
import { TradeValidator } from "@/domain/trade-history/services/TradeValidator";
import { TradeAnalyzer } from "@/domain/trade-history/services/TradeAnalyzer";
import { MetricsCalculator } from "@/domain/reports/services/MetricsCalculator";
import { ReportGenerator } from "@/domain/reports/services/ReportGenerator";

// Application Services
import { RegisterUserCommandHandler } from "@/application/user/commands/RegisterUserCommandHandler";
import { LoginUserCommandHandler } from "@/application/user/commands/LoginUserCommandHandler";
import { UpdateUserProfileCommandHandler } from "@/application/user/commands/UpdateUserProfileCommandHandler";
import { ChangePasswordCommandHandler } from "@/application/user/commands/ChangePasswordCommandHandler";
import { GetUserProfileQueryHandler } from "@/application/user/queries/GetUserProfileQueryHandler";
import { CalculatePositionSizeCommandHandler } from "@/application/lot-calculator/commands/CalculatePositionSizeCommandHandler";
import { GetCurrencyPairsQueryHandler } from "@/application/lot-calculator/queries/GetCurrencyPairsQueryHandler";
import { GetPipValueQueryHandler } from "@/application/lot-calculator/queries/GetPipValueQueryHandler";
import { CreateTradeCommandHandler } from "@/application/trade-history/commands/CreateTradeCommandHandler";
import { UpdateTradeCommandHandler } from "@/application/trade-history/commands/UpdateTradeCommandHandler";
import { DeleteTradeCommandHandler } from "@/application/trade-history/commands/DeleteTradeCommandHandler";
import { GetTradesQueryHandler } from "@/application/trade-history/queries/GetTradesQueryHandler";
import { GetTradeByIdQueryHandler } from "@/application/trade-history/queries/GetTradeByIdQueryHandler";
import { GetTradesByDateRangeQueryHandler } from "@/application/trade-history/queries/GetTradesByDateRangeQueryHandler";
import { GenerateReportCommandHandler } from "@/application/reports/commands/GenerateReportCommandHandler";
import { GetPerformanceMetricsQueryHandler } from "@/application/reports/queries/GetPerformanceMetricsQueryHandler";
import { GetReportQueryHandler } from "@/application/reports/queries/GetReportQueryHandler";

// Infrastructure
import { JwtService } from "@/infrastructure/authentication/JwtService";
import { AccountCurrency } from "@/domain/lot-calculator/value-objects/AccountCurrency";

export function setupApi() {
  // Infrastructure Services
  const passwordHasher = new BcryptPasswordHasher();
  const jwtService = new JwtService();

  // Repositories
  const userRepository = new UserRepository();
  const userProfileRepository = new UserProfileRepository();
  const tradeRepository = new TradeRepository();
  const reportRepository = new NullTradingReportRepository();

  // Domain Services
  const authenticationService = new AuthenticationService(passwordHasher);
  const pipValueCalculator = new PipValueCalculator(); // No exchange rate provider for now
  const positionSizeCalculator = new PositionSizeCalculator(pipValueCalculator);
  const tradeValidator = new TradeValidator();
  
  // TradeAnalyzer needs accountCurrency - we'll use USD as default
  // In real app, this should come from user settings
  const accountCurrency = AccountCurrency.create("USD");
  const tradeAnalyzer = new TradeAnalyzer(pipValueCalculator, accountCurrency);
  
  const metricsCalculator = new MetricsCalculator();
  const reportGenerator = new ReportGenerator(metricsCalculator);

  // Application Handlers
  const registerUserHandler = new RegisterUserCommandHandler(
    userRepository,
    authenticationService
  );
  const loginUserHandler = new LoginUserCommandHandler(
    userRepository,
    authenticationService
  );
  const updateProfileHandler = new UpdateUserProfileCommandHandler(
    userProfileRepository
  );
  const changePasswordHandler = new ChangePasswordCommandHandler(
    userRepository,
    authenticationService
  );
  const getUserProfileHandler = new GetUserProfileQueryHandler(
    userProfileRepository
  );

  const calculatePositionSizeHandler = new CalculatePositionSizeCommandHandler(
    positionSizeCalculator
  );
  const getCurrencyPairsHandler = new GetCurrencyPairsQueryHandler();
  const getPipValueHandler = new GetPipValueQueryHandler(pipValueCalculator);

  const createTradeHandler = new CreateTradeCommandHandler(
    tradeRepository,
    tradeValidator
  );
  const updateTradeHandler = new UpdateTradeCommandHandler(
    tradeRepository,
    tradeValidator,
    tradeAnalyzer
  );
  const deleteTradeHandler = new DeleteTradeCommandHandler(tradeRepository);
  const getTradesHandler = new GetTradesQueryHandler(tradeRepository);
  const getTradeByIdHandler = new GetTradeByIdQueryHandler(tradeRepository);
  const getTradesByDateRangeHandler = new GetTradesByDateRangeQueryHandler(
    tradeRepository
  );

  const generateReportHandler = new GenerateReportCommandHandler(
    reportGenerator,
    tradeRepository,
    reportRepository
  );
  const getMetricsHandler = new GetPerformanceMetricsQueryHandler(
    metricsCalculator,
    tradeRepository
  );
  const getReportHandler = new GetReportQueryHandler(reportRepository);

  // Controllers
  const authController = new AuthController(
    registerUserHandler,
    loginUserHandler,
    updateProfileHandler,
    changePasswordHandler,
    getUserProfileHandler,
    jwtService
  );

  const lotCalculatorController = new LotCalculatorController(
    calculatePositionSizeHandler,
    getCurrencyPairsHandler,
    getPipValueHandler
  );

  const tradeHistoryController = new TradeHistoryController(
    createTradeHandler,
    updateTradeHandler,
    deleteTradeHandler,
    getTradesHandler,
    getTradeByIdHandler,
    getTradesByDateRangeHandler
  );

  const reportsController = new ReportsController(
    generateReportHandler,
    getMetricsHandler,
    getReportHandler
  );

  return {
    authController,
    lotCalculatorController,
    tradeHistoryController,
    reportsController,
    jwtService,
  };
}

