import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Package,
  LogOut,
  Plus,
  X,
  Upload,
  Loader2,
  Edit,
  Trash2,
  Star,
  StarOff,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { productService, authService } from "../../services/productService";
import imageCompression from "browser-image-compression";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrls?: string[];
  isPopular: boolean;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

const MAX_IMAGES = 15;
const MAX_TOTAL_SIZE_MB = 3.5;

const ProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  product,
}: ProductModalProps) => {
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isPopular: false,
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const isEditMode = !!product;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          isPopular: product.isPopular,
        });
        setImageFiles([]);
        setImagePreviews(product.imageUrls ?? []);
      } else {
        setFormData({ name: "", description: "", price: "", isPopular: false });
        setImageFiles([]);
        setImagePreviews([]);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, product]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // existing total size
    const existingTotalBytes = imageFiles.reduce(
      (acc, file) => acc + file.size,
      0
    );
    const maxTotalBytes = MAX_TOTAL_SIZE_MB * 1024 * 1024;
    const remainingBytes = maxTotalBytes - existingTotalBytes;

    if (remainingBytes <= 0) {
      toast({
        title: "Image limit reached",
        description:
          "You cannot add more images because the total size is already at the limit. Remove some images first.",
        variant: "destructive",
      });
      return;
    }

    // per-image budget for new files
    const perImageBudgetMB = remainingBytes / files.length / (1024 * 1024);

    if (perImageBudgetMB <= 0) {
      toast({
        title: "Too many images",
        description:
          "These images cannot fit under the total size limit. Try uploading fewer images at a time.",
        variant: "destructive",
      });
      return;
    }

    setCompressing(true);

    try {
      const baseOptions = {
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg" as const,
      };

      // compress each new file within per-image budget,
      // but never above 0.7 MB per image
      const targetMaxSizeMB = Math.min(0.7, perImageBudgetMB);

      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          const compressedBlob = await imageCompression(file, {
            ...baseOptions,
            maxSizeMB: targetMaxSizeMB,
          });

          return new File(
            [compressedBlob],
            file.name.replace(/\.[^/.]+$/, ".jpg"),
            { type: "image/jpeg" }
          );
        })
      );

      const combinedFiles = [...imageFiles, ...compressedFiles].slice(
        0,
        MAX_IMAGES
      );
      const totalBytes = combinedFiles.reduce(
        (acc, file) => acc + file.size,
        0
      );

      if (totalBytes > maxTotalBytes) {
        toast({
          title: "Limit exceeded",
          description:
            "Even after compression, the total size is above the limit. Please remove some images or upload fewer.",
          variant: "destructive",
        });
        setCompressing(false);
        return;
      }

      setImageFiles(combinedFiles);

      const readers = compressedFiles.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      );

      const newPreviews = await Promise.all(readers);
      const combinedPreviews = [...imagePreviews, ...newPreviews].slice(
        0,
        MAX_IMAGES
      );
      setImagePreviews(combinedPreviews);

      const totalSizeMB = (totalBytes / (1024 * 1024)).toFixed(2);
      toast({
        title: "Images compressed",
        description: `${compressedFiles.length} image(s) compressed. Total size: ${totalSizeMB}MB (max ${MAX_TOTAL_SIZE_MB}MB).`,
      });
    } catch (error) {
      console.error("Image compression failed:", error);
      toast({
        title: "Compression failed",
        description: "Failed to process images. Please try smaller files.",
        variant: "destructive",
      });
    } finally {
      setCompressing(false);
    }
  };

  const handleRemoveImageAt = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleClearImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        isPopular: formData.isPopular,
        imageFiles,
      };

      if (isEditMode && product) {
        await productService.updateProduct(product._id, payload);
        toast({
          title: "Success",
          description: "Product updated successfully!",
        });
      } else {
        await productService.createProduct(payload);
        toast({
          title: "Success",
          description: "Product added successfully!",
        });
      }

      setFormData({ name: "", description: "", price: "", isPopular: false });
      setImageFiles([]);
      setImagePreviews([]);
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalSize = imageFiles.reduce((acc, file) => acc + file.size, 0);
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  const remainingSize = (
    MAX_TOTAL_SIZE_MB - parseFloat(totalSizeMB || "0")
  ).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Frame"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="e.g., White Frame"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Price (£) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="text"
              placeholder="e.g., 9.99"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Product Images (up to {MAX_IMAGES})</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              {compressing ? (
                <div className="py-8">
                  <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Compressing images...
                  </p>
                </div>
              ) : imagePreviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="max-h-32 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
                          onClick={() => handleRemoveImageAt(idx)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {imageFiles.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Total size: {totalSizeMB}MB / {MAX_TOTAL_SIZE_MB}MB
                      {parseFloat(remainingSize) > 0 && (
                        <> ({remainingSize}MB remaining)</>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 justify-center">
                    {imagePreviews.length < MAX_IMAGES &&
                      parseFloat(remainingSize) > 0 && (
                        <Label
                          htmlFor="images"
                          className="inline-flex items-center gap-2 cursor-pointer text-sm text-muted-foreground border rounded-md px-3 py-2 hover:bg-muted"
                        >
                          <Upload className="h-4 w-4" />
                          Add more images
                          <Input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </Label>
                      )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearImages}
                    >
                      Remove all
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Images are automatically compressed. Total must be under{" "}
                    {MAX_TOTAL_SIZE_MB}MB. Maximum {MAX_IMAGES} images.
                  </p>
                </div>
              ) : (
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP (auto-compressed, max {MAX_IMAGES} images,{" "}
                    {MAX_TOTAL_SIZE_MB}MB total)
                  </p>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            {isEditMode && (
              <p className="text-xs text-muted-foreground mt-1">
                Leave this empty to keep existing images. Uploading new images
                will replace them on save.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading || compressing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || compressing}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Update Product
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const user = authService.getCurrentUser();
    setAdminUser(user);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePopular = async (productId: string) => {
    try {
      await productService.togglePopularity(productId);
      toast({
        title: "Success",
        description: "Product popularity updated",
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await productService.deleteProduct(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/admin/login");
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeModal = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const img = row.original.imageUrls?.[0] || "/placeholder.png";
        return (
          <img
            src={img}
            alt={row.original.name}
            className="w-16 h-16 object-cover rounded"
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {row.original.description}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <div className="font-semibold">
          £{parseFloat(row.original.price.toString()).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "isPopular",
      header: "Popular",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleTogglePopular(row.original._id)}
        >
          {row.original.isPopular ? (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditModal(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProduct(row.original._id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeModal}
        onSuccess={fetchProducts}
        product={selectedProduct}
      />

      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {adminUser?.name || "Admin"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 hover:shadow-lg transition-shadow mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Products
              </p>
              <p className="text-3xl font-bold text-foreground">
                {products.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">All Products</h3>
            <Button onClick={openAddModal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products found</p>
              <Button className="mt-4" onClick={openAddModal}>
                Add Your First Product
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}{" "}
                  to{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    products.length
                  )}{" "}
                  of {products.length} products
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
