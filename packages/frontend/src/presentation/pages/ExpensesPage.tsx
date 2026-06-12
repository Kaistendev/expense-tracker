import { useEffect, useState, useCallback } from "react";
import { useExpenses, useCategories } from "../../application/hooks";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

export function ExpensesPage() {
  const { expenses, total, page, totalPages, loading, error, fetchExpenses, createExpense, updateExpense, deleteExpense } = useExpenses();
  const { categories, fetchCategories } = useCategories();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({ amount: "", description: "", date: "", type: "expense" as "income" | "expense", categoryId: "" });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchExpenses({
      page: currentPage,
      limit: 10,
      search: search || undefined,
      categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
    });
  }, [currentPage, search, categoryFilter, fetchExpenses]);

  const resetForm = useCallback(() => {
    setForm({ amount: "", description: "", date: "", type: "expense", categoryId: "" });
    setEditingId(null);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) resetForm();
  }, [resetForm]);

  const handleEdit = (expense: typeof expenses[0]) => {
    setForm({
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date.slice(0, 10),
      type: expense.type,
      categoryId: expense.categoryId,
    });
    setEditingId(expense.id);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExpense(editingId, {
          amount: Number(form.amount),
          description: form.description,
          date: form.date,
          type: form.type,
          categoryId: form.categoryId,
        });
      } else {
        await createExpense({
          amount: Number(form.amount),
          description: form.description,
          date: form.date,
          type: form.type,
          categoryId: form.categoryId,
        });
      }
      setOpen(false);
      resetForm();
      fetchExpenses({ page: currentPage, limit: 10 });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Expense" : "Add Expense"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" step="0.01" min="0" placeholder="50.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex gap-2">
                  <Button type="button" variant={form.type === "expense" ? "default" : "outline"} className="flex-1" onClick={() => setForm({ ...form, type: "expense" })}>Expense</Button>
                  <Button type="button" variant={form.type === "income" ? "default" : "outline"} className="flex-1" onClick={() => setForm({ ...form, type: "income" })}>Income</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Lunch at restaurant" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {editingId ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No expenses found</TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => {
                const cat = categories.find((c) => c.id === expense.categoryId);
                return (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" style={{ borderColor: cat?.color }}>
                        {cat?.icon} {cat?.name ?? "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={expense.type === "income" ? "secondary" : "default"}>
                        {expense.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${expense.type === "income" ? "text-green-600" : ""}`}>
                      {expense.type === "income" ? "+" : "-"}${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(expense)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} total)
          </span>
          <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
