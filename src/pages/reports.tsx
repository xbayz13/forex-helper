/**
 * Reports & Analytics Page
 * Analyze trading performance with comprehensive metrics
 */

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  BarChart3,
  Award,
  AlertTriangle,
  Download,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { useApi } from "@/lib/hooks/use-api";
import { toast } from "sonner";

interface Metrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalProfitLoss: number;
  profitLossCurrency: string;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  expectancy: number;
  maximumDrawdown: number;
  maximumDrawdownPercentage: number;
  maximumDrawdownCurrency: string;
  averageRiskRewardRatio: number | null;
  bestTrade: number | null;
  bestTradeCurrency: string | null;
  worstTrade: number | null;
  worstTradeCurrency: string | null;
  longestWinningStreak: number;
  longestLosingStreak: number;
}

export function ReportsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const { execute, isLoading, error } = useApi<{ metrics: Metrics }>({
    showErrorToast: true,
  });

  const loadMetrics = async () => {
    try {
      const data = await execute(() => api.get<{ metrics: Metrics }>("/reports/metrics"));
      setMetrics(data.metrics);
    } catch (error) {
      // Error handled by useApi
      setMetrics(null);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount >= 0 ? "+" : ""}${amount.toFixed(2)} ${currency}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Analyze your trading performance with detailed metrics and statistics
          </p>
        </div>
        <Button variant="outline" onClick={loadMetrics} disabled={isLoading}>
          <Download className="h-4 w-4 mr-2" />
          Refresh Metrics
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading size="lg" text="Loading metrics..." />
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : metrics && metrics.totalTrades > 0 ? (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalTrades}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.winningTrades} wins, {metrics.losingTrades} losses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage(metrics.winRate)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.winningTrades} of {metrics.totalTrades} trades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total P/L</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    metrics.totalProfitLoss >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatCurrency(
                    metrics.totalProfitLoss,
                    metrics.profitLossCurrency
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Overall performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    metrics.profitFactor >= 1
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {metrics.profitFactor.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.profitFactor >= 1 ? "Profitable" : "Unprofitable"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Average Performance</CardTitle>
                <CardDescription>
                  Average win and loss amounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium">Average Win</span>
                  </div>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(metrics.averageWin, metrics.profitLossCurrency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium">Average Loss</span>
                  </div>
                  <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(
                      Math.abs(metrics.averageLoss),
                      metrics.profitLossCurrency
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">Expectancy</span>
                  </div>
                  <span
                    className={`text-lg font-semibold ${
                      metrics.expectancy >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(metrics.expectancy, metrics.profitLossCurrency)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
                <CardDescription>
                  Risk/reward and drawdown metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.averageRiskRewardRatio !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Risk/Reward</span>
                    <span className="text-lg font-semibold">
                      {metrics.averageRiskRewardRatio.toFixed(2)}:1
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                    <span className="text-sm font-medium">Max Drawdown</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(
                        metrics.maximumDrawdown,
                        metrics.maximumDrawdownCurrency
                      )}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage(metrics.maximumDrawdownPercentage)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best & Worst Trades */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {metrics.bestTrade !== null && (
              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Best Trade
                  </CardTitle>
                  <CardDescription>
                    Highest profit from a single trade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(
                      metrics.bestTrade,
                      metrics.bestTradeCurrency || metrics.profitLossCurrency
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {metrics.worstTrade !== null && (
              <Card className="border-red-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    Worst Trade
                  </CardTitle>
                  <CardDescription>
                    Largest loss from a single trade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(
                      metrics.worstTrade,
                      metrics.worstTradeCurrency || metrics.profitLossCurrency
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Streaks */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Longest Winning Streak
                </CardTitle>
                <CardDescription>
                  Consecutive winning trades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {metrics.longestWinningStreak}
                </div>
                <p className="text-sm text-muted-foreground mt-2">trades</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  Longest Losing Streak
                </CardTitle>
                <CardDescription>
                  Consecutive losing trades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {metrics.longestLosingStreak}
                </div>
                <p className="text-sm text-muted-foreground mt-2">trades</p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No trading data available. Start trading to see your performance metrics!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

