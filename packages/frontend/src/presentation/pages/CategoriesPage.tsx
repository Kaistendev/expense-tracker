import { useEffect, useState, useCallback } from "react";
import { useCategories } from "../../application/hooks";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Card, CardContent } from "../components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

export function CategoriesPage() {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", icon: "", color: "#6366f1" });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = useCallback(() => {
    setForm({ name: "", icon: "", color: "#6366f1" });
    setEditingId(null);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) resetForm();
  }, [resetForm]);

  const handleEdit = (category: typeof categories[0]) => {
    setForm({ name: category.name, icon: category.icon, color: category.color });
    setEditingId(category.id);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }
      setOpen(false);
      resetForm();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Expenses in this category will be orphaned.")) return;
    try {
      await deleteCategory(id);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
              <DialogDescription>Give your category a name, icon and color.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Food" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input id="icon" placeholder="🍕" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                  <Input id="color" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-12 p-1" />
                  <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="#6366f1" />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {editingId ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      {loading && categories.length === 0 ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet. Create one to get started.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                    style={{ backgroundColor: category.color + "20" }}
                  >
                    {category.icon}
                  </span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
