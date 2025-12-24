/**
 * Trade History Page
 * View and manage all trading transactions
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  History,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { useApi } from "@/lib/hooks/use-api";
import { formatCurrencyPair } from "@/lib/utils";
import { toast } from "sonner";

// Types
interface Trade {
  id: string;
  userId: string;
  pair: string;
  direction: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number | null;
  lotSize: number;
  stopLoss: number | null;
  takeProfit: number | null;
  pips: number | null;
  points: number | null;
  pipsUnit: "pips" | "points" | null;
  profitLoss: number | null;
  profitLossCurrency: string | null;
  riskAmount: number;
  riskRewardRatio: number | null;
  status: "OPEN" | "WIN" | "LOSS" | "BREAK_EVEN";
  entryTime: string;
  exitTime: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const tradeFormSchema = z.object({
  pair: z.string().min(1, "Currency pair is required"),
  direction: z.enum(["BUY", "SELL"]),
  entryPrice: z.number().min(0.00001, "Entry price must be greater than 0"),
  lotSize: z.number().min(0.01, "Lot size must be at least 0.01"),
  riskAmount: z.number().min(0.01, "Risk amount must be greater than 0"),
  entryTime: z.string().optional(),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
  notes: z.string().optional(),
});

type TradeForm = z.infer<typeof tradeFormSchema>;

const CURRENCY_PAIRS = [
  "EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCHF", "USDCAD",
  "EURJPY", "EURGBP", "EURCHF", "GBPJPY", "GBPCHF", "AUDJPY", "AUDCHF",
  "CADJPY", "CHFJPY", "NZDJPY", "XAUUSD",
];

export function TradeHistoryPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pairFilter, setPairFilter] = useState<string>("all");

  const { execute, isLoading, error } = useApi<{ trades: Trade[]; total: number; page: number; pageSize: number; totalPages: number }>({
    showErrorToast: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TradeForm>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      pair: "EURUSD",
      direction: "BUY",
      entryPrice: 1.1000,
      lotSize: 0.1,
      riskAmount: 10,
      entryTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  // Load trades
  const loadTrades = async () => {
    try {
      const response = await execute(() => api.get<{ trades: Trade[]; total: number; page: number; pageSize: number; totalPages: number }>("/trades"));
      // API returns { trades: [...], total, page, pageSize, totalPages }
      const tradesData = response.trades || [];
      setTrades(tradesData);
      setFilteredTrades(tradesData);
    } catch (error) {
      // Error handled by useApi
      setTrades([]);
      setFilteredTrades([]);
    }
  };

  useEffect(() => {
    loadTrades();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...trades];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (trade) =>
          trade.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trade.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((trade) => trade.status === statusFilter);
    }

    // Pair filter
    if (pairFilter !== "all") {
      filtered = filtered.filter((trade) => trade.pair === pairFilter);
    }

    setFilteredTrades(filtered);
  }, [searchQuery, statusFilter, pairFilter, trades]);

  const onSubmit = async (data: TradeForm) => {
    try {
      if (editingTrade) {
        await api.put(`/trades/${editingTrade.id}`, data);
        toast.success("Trade updated successfully!");
      } else {
        await api.post("/trades", data);
        toast.success("Trade created successfully!");
      }
      setIsDialogOpen(false);
      setEditingTrade(null);
      reset();
      loadTrades();
    } catch (error) {
      // Error handled by useApi
    }
  };

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setValue("pair", trade.pair);
    setValue("direction", trade.direction);
    setValue("entryPrice", trade.entryPrice);
    setValue("lotSize", trade.lotSize);
    setValue("riskAmount", trade.riskAmount);
    setValue("stopLoss", trade.stopLoss || undefined);
    setValue("takeProfit", trade.takeProfit || undefined);
    setValue("notes", trade.notes || undefined);
    if (trade.entryTime) {
      setValue("entryTime", format(new Date(trade.entryTime), "yyyy-MM-dd'T'HH:mm"));
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trade?")) return;

    try {
      await api.delete(`/trades/${id}`);
      toast.success("Trade deleted successfully!");
      loadTrades();
    } catch (error) {
      // Error handled by useApi
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTrade(null);
    reset();
  };

  const getStatusBadge = (status: Trade["status"]) => {
    const variants = {
      OPEN: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      WIN: "bg-green-500/10 text-green-600 dark:text-green-400",
      LOSS: "bg-red-500/10 text-red-600 dark:text-red-400",
      BREAK_EVEN: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          variants[status]
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Pair",
      "Direction",
      "Entry Price",
      "Exit Price",
      "Lot Size",
      "P/L",
      "Status",
      "Entry Time",
      "Exit Time",
    ];
    const rows = filteredTrades.map((trade) => [
      trade.id,
      formatCurrencyPair(trade.pair),
      trade.direction,
      trade.entryPrice,
      trade.exitPrice || "",
      trade.lotSize,
      trade.profitLoss || "",
      trade.status,
      trade.entryTime,
      trade.exitTime || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trades-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Trades exported to CSV!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Trade History
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View and manage all your trading transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Trade
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by pair or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusFilter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="statusFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="WIN">Win</SelectItem>
                  <SelectItem value="LOSS">Loss</SelectItem>
                  <SelectItem value="BREAK_EVEN">Break Even</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pairFilter">Currency Pair</Label>
              <Select value={pairFilter} onValueChange={setPairFilter}>
                <SelectTrigger id="pairFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pairs</SelectItem>
                  {CURRENCY_PAIRS.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {formatCurrencyPair(pair)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trades Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Trades ({filteredTrades.length})</CardTitle>
          <CardDescription>
            {trades.length} total trades in your history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loading size="lg" text="Loading trades..." />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <ErrorMessage message={error} />
            </div>
          ) : filteredTrades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {trades.length === 0
                  ? "No trades yet. Create your first trade!"
                  : "No trades match your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pair</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Exit Price</TableHead>
                    <TableHead>Lot Size</TableHead>
                    <TableHead>P/L</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Entry Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{formatCurrencyPair(trade.pair)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 ${
                            trade.direction === "BUY"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {trade.direction === "BUY" ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {trade.direction}
                        </span>
                      </TableCell>
                      <TableCell>{trade.entryPrice.toFixed(5)}</TableCell>
                      <TableCell>
                        {trade.exitPrice ? trade.exitPrice.toFixed(5) : "-"}
                      </TableCell>
                      <TableCell>{trade.lotSize}</TableCell>
                      <TableCell>
                        {trade.profitLoss !== null ? (
                          <span
                            className={`flex items-center gap-1 ${
                              trade.profitLoss >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {trade.profitLoss >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {trade.profitLoss >= 0 ? "+" : ""}
                            {trade.profitLoss.toFixed(2)}{" "}
                            {trade.profitLossCurrency || "USD"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(trade.status)}</TableCell>
                      <TableCell>
                        {format(new Date(trade.entryTime), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(trade)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(trade.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTrade ? "Edit Trade" : "Create New Trade"}
            </DialogTitle>
            <DialogDescription>
              {editingTrade
                ? "Update the trade details below."
                : "Enter the details for your new trade."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pair">Currency Pair</Label>
                <Select
                  onValueChange={(value) => setValue("pair", value)}
                  defaultValue="EURUSD"
                >
                  <SelectTrigger id="pair">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCY_PAIRS.map((pair) => (
                      <SelectItem key={pair} value={pair}>
                        {formatCurrencyPair(pair)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pair && (
                  <p className="text-sm text-destructive">{errors.pair.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction">Direction</Label>
                <Select
                  onValueChange={(value: "BUY" | "SELL") =>
                    setValue("direction", value)
                  }
                  defaultValue="BUY"
                >
                  <SelectTrigger id="direction">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUY">BUY</SelectItem>
                    <SelectItem value="SELL">SELL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="0.00001"
                  {...register("entryPrice", { valueAsNumber: true })}
                />
                {errors.entryPrice && (
                  <p className="text-sm text-destructive">
                    {errors.entryPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input
                  id="lotSize"
                  type="number"
                  step="0.01"
                  {...register("lotSize", { valueAsNumber: true })}
                />
                {errors.lotSize && (
                  <p className="text-sm text-destructive">
                    {errors.lotSize.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskAmount">Risk Amount</Label>
                <Input
                  id="riskAmount"
                  type="number"
                  step="0.01"
                  {...register("riskAmount", { valueAsNumber: true })}
                />
                {errors.riskAmount && (
                  <p className="text-sm text-destructive">
                    {errors.riskAmount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryTime">Entry Time</Label>
                <Input
                  id="entryTime"
                  type="datetime-local"
                  {...register("entryTime")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss (Optional)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.00001"
                  {...register("stopLoss", {
                    valueAsNumber: true,
                    required: false,
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit (Optional)</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.00001"
                  {...register("takeProfit", {
                    valueAsNumber: true,
                    required: false,
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add any notes about this trade..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loading size="sm" className="mr-2" />
                    {editingTrade ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingTrade ? "Update Trade" : "Create Trade"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

