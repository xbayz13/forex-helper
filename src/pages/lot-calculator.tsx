/**
 * Lot Calculator Page
 * Calculate optimal position sizes based on risk management
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import { Calculator, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api-client";
import { useApi } from "@/lib/hooks/use-api";
import { formatCurrencyPair } from "@/lib/utils";
import { toast } from "sonner";

// Form validation schema
const lotCalculatorSchema = z.object({
  accountCurrency: z.string().min(1, "Account currency is required"),
  riskPercentage: z
    .number()
    .min(0.1, "Risk must be at least 0.1%")
    .max(100, "Risk cannot exceed 100%"),
  accountBalance: z
    .number()
    .min(0.01, "Account balance must be greater than 0"),
  stopLoss: z
    .number()
    .min(0.1, "Stop loss must be at least 0.1"),
  stopLossUnit: z.enum(["pips", "points"]),
  currencyPair: z.string().min(1, "Currency pair is required"),
  currentPrice: z.number().optional(),
});

type LotCalculatorForm = z.infer<typeof lotCalculatorSchema>;

interface PositionSizeResult {
  id: string;
  lotSize: number;
  positionSize: number;
  riskAmount: number;
  accountBalance: number;
  accountCurrency: string;
  riskPercentage: number;
  currencyPair: string;
  stopLoss: number;
  stopLossUnit: "pips" | "points";
  pipValue: number;
  pipValueCurrency: string;
  calculatedAt: string;
}

const ACCOUNT_CURRENCIES = [
  "USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "NZD", "IDR"
];

const CURRENCY_PAIRS = [
  // Major pairs
  "EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCHF", "USDCAD",
  // Cross pairs
  "EURJPY", "EURGBP", "EURCHF", "GBPJPY", "GBPCHF", "AUDJPY", "AUDCHF",
  "CADJPY", "CHFJPY", "NZDJPY",
  // XAU/USD
  "XAUUSD",
];

export function LotCalculatorPage() {
  const [result, setResult] = useState<PositionSizeResult | null>(null);
  const [currencyPairs, setCurrencyPairs] = useState<string[]>(CURRENCY_PAIRS);
  const { execute, isLoading } = useApi<PositionSizeResult>({
    showErrorToast: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LotCalculatorForm>({
    resolver: zodResolver(lotCalculatorSchema),
    defaultValues: {
      accountCurrency: "USD",
      riskPercentage: 2,
      accountBalance: 10000,
      stopLoss: 50,
      stopLossUnit: "pips",
      currencyPair: "EURUSD",
    },
  });

  const selectedPair = watch("currencyPair");
  const stopLossUnit = watch("stopLossUnit");

  // Load currency pairs on mount
  useEffect(() => {
    api
      .get<{ pairs: Array<{ pair: string; displayName: string; baseCurrency: string; quoteCurrency: string; type: string }> }>("/lot-calculator/pairs")
      .then((data) => {
        if (data.pairs && Array.isArray(data.pairs) && data.pairs.length > 0) {
          // Extract pair strings from DTO objects
          const pairStrings = data.pairs
            .map((p) => (typeof p === "string" ? p : p.pair))
            .filter((p): p is string => typeof p === "string");
          if (pairStrings.length > 0) {
            setCurrencyPairs(pairStrings);
          }
        }
      })
      .catch(() => {
        // Use default pairs if API fails
      });
  }, []);

  const onSubmit = async (data: LotCalculatorForm) => {
    try {
      const result = await execute(() =>
        api.post<PositionSizeResult>("/lot-calculator/calculate", {
          accountCurrency: data.accountCurrency,
          riskPercentage: data.riskPercentage,
          accountBalance: data.accountBalance,
          stopLoss: data.stopLoss,
          stopLossUnit: data.stopLossUnit,
          currencyPair: data.currencyPair,
          currentPrice: data.currentPrice,
        })
      );
      setResult(result);
      toast.success("Position size calculated successfully!");
    } catch (error) {
      // Error already handled by useApi hook
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Lot Calculator
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Calculate optimal position sizes based on your risk management parameters
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculation Parameters
            </CardTitle>
            <CardDescription>
              Enter your account details and trading parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Account Currency */}
              <div className="space-y-2">
                <Label htmlFor="accountCurrency">Account Currency</Label>
                <Select
                  defaultValue="USD"
                  onValueChange={(value) => setValue("accountCurrency", value)}
                >
                  <SelectTrigger id="accountCurrency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.accountCurrency && (
                  <p className="text-sm text-destructive">
                    {errors.accountCurrency.message}
                  </p>
                )}
              </div>

              {/* Account Balance */}
              <div className="space-y-2">
                <Label htmlFor="accountBalance">Account Balance</Label>
                <Input
                  id="accountBalance"
                  type="number"
                  step="0.01"
                  {...register("accountBalance", { valueAsNumber: true })}
                />
                {errors.accountBalance && (
                  <p className="text-sm text-destructive">
                    {errors.accountBalance.message}
                  </p>
                )}
              </div>

              {/* Risk Percentage */}
              <div className="space-y-2">
                <Label htmlFor="riskPercentage">Risk per Trade (%)</Label>
                <Input
                  id="riskPercentage"
                  type="number"
                  step="0.1"
                  {...register("riskPercentage", { valueAsNumber: true })}
                />
                {errors.riskPercentage && (
                  <p className="text-sm text-destructive">
                    {errors.riskPercentage.message}
                  </p>
                )}
              </div>

              {/* Currency Pair */}
              <div className="space-y-2">
                <Label htmlFor="currencyPair">Currency Pair</Label>
                <Select
                  defaultValue="EURUSD"
                  onValueChange={(value) => setValue("currencyPair", value)}
                >
                  <SelectTrigger id="currencyPair">
                    <SelectValue placeholder="Select pair" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyPairs.map((pair) => (
                      <SelectItem key={pair} value={pair}>
                        {formatCurrencyPair(pair)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currencyPair && (
                  <p className="text-sm text-destructive">
                    {errors.currencyPair.message}
                  </p>
                )}
              </div>

              {/* Stop Loss Unit */}
              <div className="space-y-2">
                <Label htmlFor="stopLossUnit">Stop Loss Unit</Label>
                <Select
                  defaultValue="pips"
                  onValueChange={(value: "pips" | "points") =>
                    setValue("stopLossUnit", value)
                  }
                >
                  <SelectTrigger id="stopLossUnit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pips">Pips</SelectItem>
                    <SelectItem value="points">Points (for XAU/USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stop Loss */}
              <div className="space-y-2">
                <Label htmlFor="stopLoss">
                  Stop Loss ({stopLossUnit === "pips" ? "Pips" : "Points"})
                </Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.1"
                  {...register("stopLoss", { valueAsNumber: true })}
                />
                {errors.stopLoss && (
                  <p className="text-sm text-destructive">
                    {errors.stopLoss.message}
                  </p>
                )}
              </div>

              {/* Current Price (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="currentPrice">
                  Current Price (Optional)
                  <span className="text-muted-foreground text-xs ml-2">
                    Required for USD/XXX pairs or cross pairs
                  </span>
                </Label>
                <Input
                  id="currentPrice"
                  type="number"
                  step="0.00001"
                  {...register("currentPrice", {
                    valueAsNumber: true,
                    required: false,
                  })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Position Size
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Calculation Results
            </CardTitle>
            <CardDescription>
              Your recommended position size and risk details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="text-2xl font-bold">{result.lotSize.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Position Size</p>
                    <p className="text-2xl font-bold">
                      {result.positionSize.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">units</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Risk Amount
                    </span>
                    <span className="font-semibold flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {result.riskAmount.toFixed(2)} {result.accountCurrency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Account Balance
                    </span>
                    <span className="font-semibold">
                      {result.accountBalance.toLocaleString()}{" "}
                      {result.accountCurrency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Risk Percentage
                    </span>
                    <span className="font-semibold">{result.riskPercentage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Stop Loss
                    </span>
                    <span className="font-semibold">
                      {result.stopLoss} {result.stopLossUnit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Pip Value
                    </span>
                    <span className="font-semibold">
                      {result.pipValue.toFixed(2)} {result.pipValueCurrency}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-start gap-2 p-3 rounded-md bg-muted">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Risk Management Reminder</p>
                      <p className="text-muted-foreground mt-1">
                        Always use stop loss and never risk more than you can afford to lose.
                        This calculation is for guidance only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Enter your parameters and click "Calculate Position Size" to see
                  results here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

