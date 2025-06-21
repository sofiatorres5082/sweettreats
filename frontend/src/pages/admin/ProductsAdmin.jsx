import { useEffect, useState } from "react";
import {
  reactivateProductRequest,
  getProductsByStatusRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from "../../api/admin";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { ImageWithSkeleton } from "../../components/ImageWithSkeleton";

const schema = yup.object({
  nombre: yup.string().required("Nombre obligatorio"),
  precio: yup
    .number()
    .typeError("Precio debe ser un número")
    .min(0.01, "Precio debe ser mayor a 0")
    .required("Precio obligatorio"),
  stock: yup
    .number()
    .typeError("Stock debe ser un número")
    .min(0, "Stock no puede ser negativo")
    .required("Stock obligatorio"),
  descripcion: yup.string().optional(),
});

const API_URL = import.meta.env.VITE_API_URL || "";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [keepExistingImage, setKeepExistingImage] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState("ACTIVE");
  const [reactivatingId, setReactivatingId] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    trigger,
    setError,
  } = useForm({
    resolver: yupResolver(schema, {
      context: { creating, keepExistingImage },
    }),
    mode: "onChange",
    defaultValues: {
      nombre: "",
      precio: "",
      stock: "",
      descripcion: "",
      imagen: null,
    },
  });

  const fetch = async (p = 0) => {
    setLoading(true); 
    try {
      const res = await getProductsByStatusRequest(status, p, size);
      setProducts(res.data.content);
      setPage(res.data.number);
      setTotal(res.data.totalPages);
    } catch (err) {
      console.error("Error al obtener productos por estado:", err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetch(0);
  }, [status]);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
  };

  const renderActions = (p) => {
    return (
      <>
        <Button
          className="bg-[#3690e4] border-none shadow-none font-[Nunito] text-white cursor-pointer"
          size="sm"
          onClick={() => openForm(p)}
        >
          Editar
        </Button>
        {status === "INACTIVE" ? (
          <AlertDialog
            open={reactivatingId === p.id}
            onOpenChange={(open) => !open && setReactivatingId(null)}
          >
            <AlertDialogTrigger asChild>
              <Button
                className="bg-green-600 text-white font-[Nunito] cursor-pointer"
                size="sm"
                onClick={() => setReactivatingId(p.id)}
              >
                Reactivar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  ¿Reactivar Producto #{p.id}?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-center">
                  El producto volverá a estar disponible para la venta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-center space-x-2 mt-4">
                <AlertDialogCancel
                  className="cursor-pointer"
                  onClick={() => setReactivatingId(null)}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                  onClick={async () => {
                    try {
                      await reactivateProductRequest(p.id);
                      toast.success("Producto reactivado");
                      setReactivatingId(null);
                      fetch(page);
                    } catch (err) {
                      toast.error("Error al reactivar el producto");
                    }
                  }}
                >
                  Confirmar
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog
            open={deletingId === p.id}
            onOpenChange={(open) => !open && setDeletingId(null)}
          >
            <AlertDialogTrigger asChild>
              <Button
                className="bg-[#c7002b] border-none shadow-none font-[Nunito] text-white cursor-pointer"
                size="sm"
                variant="destructive"
                onClick={() => setDeletingId(p.id)}
              >
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center">
                  ¿Eliminar Producto #{p.id}?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-center">
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-center space-x-2 mt-4">
                <AlertDialogCancel
                  className={"cursor-pointer"}
                  onClick={() => setDeletingId(null)}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#E96D87] text-white px-4 py-2 rounded cursor-pointer"
                  onClick={async () => {
                    try {
                      await deleteProductRequest(p.id);
                      toast.success("Producto eliminado");
                      setDeletingId(null);
                      fetch(page === 0 && products.length === 1 ? 0 : page);
                    } catch (err) {
                      const msg =
                        err?.response?.data?.message || "Error al eliminar";

                      if (err?.response?.status === 409) {
                        toast.error(msg);
                      } else if (err?.response?.status === 403) {
                        toast.error(
                          "No tienes permisos para eliminar productos"
                        );
                      } else {
                        toast.error(msg);
                      }
                    }
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </>
    );
  };

  const openForm = (product = null) => {
    if (product) {
      setEditing(product);
      setCreating(false);
      setKeepExistingImage(true);

      const originalImagePath = product.imagen || null;

      const imageUrl = product.imagen ? `${API_URL}${product.imagen}` : null;
      setCurrentImageUrl(originalImagePath);
      setPreviewUrl(imageUrl);
      setKeepExistingImage(true);

      reset({
        nombre: product.nombre,
        precio: product.precio,
        stock: product.stock,
        descripcion: product.descripcion || "",
        imagen: null,
      });

      setTimeout(() => {
        trigger(["nombre", "precio", "stock"]);
      }, 100);
    } else {
      setCreating(true);
      setEditing(null);
      setCurrentImageUrl(null);
      setPreviewUrl(null);
      setKeepExistingImage(false);
      reset({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
        imagen: null,
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, onChange) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        const fileList = { 0: file, length: 1 };
        onChange(fileList);
        setPreviewUrl(URL.createObjectURL(file));
        setKeepExistingImage(false);
        trigger("imagen");
      }
    }
  };

  const onSubmit = async (data) => {
    const needsImage = creating || (!creating && !keepExistingImage);

    if (needsImage) {
      const file = data.imagen?.[0];
      if (!file) {
        setError("imagen", {
          type: "manual",
          message: "Debes subir una imagen",
        });
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("imagen", {
          type: "manual",
          message: "Formato no válido (solo JPG, PNG o WebP)",
        });
        return;
      }
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setError("imagen", {
          type: "manual",
          message: `Imagen demasiado grande (${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)} MB > 5 MB)`,
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("precio", data.precio);
    formData.append("stock", data.stock);
    formData.append("descripcion", data.descripcion || "");
    formData.append("mantenerImagen", keepExistingImage.toString());
    if (data.imagen && data.imagen.length > 0) {
      formData.append("imagen", data.imagen[0]);
    }

    try {
      if (creating) {
        await createProductRequest(formData);
        toast.success("Producto creado");
      } else {
        await updateProductRequest(editing.id, formData);
        toast.success("Producto actualizado");
      }
      setEditing(null);
      setCreating(false);
      setCurrentImageUrl(null);
      fetch(page);
    } catch (err) {
      const msg = err.response?.data?.message || "Error en operación";
      setError("imagen", { type: "server", message: msg });
      toast.error(msg);
    }
  };

  if (authError) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-b from-[#E96D87] to-[#F9A1B0] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#E96D87] mb-4">
            Error de Acceso
          </h2>
          <p className="mb-4">
            No tienes los permisos necesarios (ROLE_ADMIN) para acceder a esta
            sección.
          </p>
          <Button
            className="bg-[#E96D87] text-white"
            onClick={() => {
              setAuthError(false);
              fetch(0);
            }}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#E96D87] to-[#F9A1B0]">
      <h2 className="text-3xl text-white text-center mb-8 font-[Comic_Neue]">
        Gestión de Productos
      </h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label className="text-white font-[Nunito]">
            Filtrar por estado:
          </label>
          <select
            value={status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#E96D87] bg-white text-sm shadow-sm"
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>

        <Button
          className="bg-white text-[#E96D87] font-[Nunito] cursor-pointer"
          onClick={() => openForm()}
        >
          Nuevo Producto
        </Button>
      </div>

      <div className="overflow-auto bg-white rounded-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E96D87] text-white text-center">
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Cargando…</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No hay productos.</TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow
                  key={p.id}
                  className="hover:bg-gray-50 font-[Nunito] text-base text-center"
                >
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>${p.precio.toFixed(2)}</TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell>
                    {p.imagen ? (
                      <ImageWithSkeleton
                        src={`${API_URL}${p.imagen}`}
                        alt={p.nombre}
                        className="w-20 h-20"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-gray-500">Sin imagen</span>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-center items-center gap-2">
                    {renderActions(p)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center mt-6 space-x-6 text-white font-[Nunito] text-base">
        <Button
          size="sm"
          className="cursor-pointer bg-white text-[#E96D87] border-none shadow-md font-[Nunito] px-4 py-2 hover:bg-gray-100 transition"
          disabled={page === 0}
          onClick={() => fetch(page - 1)}
        >
          ← Anterior
        </Button>

        <span className="px-3 py-1 bg-[#E96D87] text-white font-semibold shadow-sm">
          Página {page + 1} de {totalPages}
        </span>

        <Button
          size="sm"
          className="cursor-pointer bg-white text-[#E96D87] border-none shadow-md font-[Nunito] px-4 py-2 hover:bg-gray-100 transition"
          disabled={page + 1 === totalPages}
          onClick={() => fetch(page + 1)}
        >
          Siguiente →
        </Button>
      </div>

      {(creating || editing) && (
        <AlertDialog open>
          <AlertDialogTrigger asChild>
            <span />
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">
                {creating ? "Nuevo Producto" : `Editar Producto #${editing.id}`}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center">
                {creating
                  ? "Rellena los datos para crear el producto."
                  : "Modifica los campos y guarda."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
              {["nombre", "precio", "stock"].map((field) => (
                <div key={field}>
                  <Controller
                    name={field}
                    control={control}
                    render={({ field: f }) => (
                      <Input
                        {...f}
                        type={field === "nombre" ? "text" : "number"}
                        placeholder={
                          field === "nombre"
                            ? "Nombre del producto"
                            : field === "precio"
                            ? "Precio"
                            : "Stock"
                        }
                        min={
                          field === "precio"
                            ? "0.01"
                            : field === "stock"
                            ? "0"
                            : undefined
                        }
                        step={field === "precio" ? "0.01" : undefined}
                        onChange={(e) => {
                          f.onChange(e);
                          setTimeout(() => trigger(field), 100);
                        }}
                      />
                    )}
                  />
                  {errors[field] && (
                    <p className="text-red-600 text-sm">
                      {errors[field].message}
                    </p>
                  )}
                </div>
              ))}

              <div>
                <Controller
                  name="descripcion"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Descripción (opcional)"
                      onChange={(e) => {
                        field.onChange(e);
                        setTimeout(() => trigger("descripcion"), 100);
                      }}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="imagen"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3">
                      {/* Vista previa compacta con checkbox integrado */}
                      {previewUrl && (
                        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-[#D9B9A1]">
                          <div className="relative flex-shrink-0">
                            <ImageWithSkeleton
                              src={previewUrl}
                              alt="Vista previa"
                              className="h-16 w-16 rounded border object-cover"
                              loading="lazy"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewUrl(null);
                                field.onChange(null);
                                if (editing) {
                                  setKeepExistingImage(false);
                                }
                              }}
                              className="absolute -top-1 -right-1 bg-[#E96D87] text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-[#d65a74] transition-colors"
                            >
                              ×
                            </button>
                          </div>
                          
                          {/* Checkbox integrado al lado de la imagen */}
                          {editing && (
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={keepExistingImage}
                                onChange={(e) => {
                                  const keep = e.target.checked;
                                  setKeepExistingImage(keep);
                                  setPreviewUrl(
                                    keep ? `${API_URL}${currentImageUrl}` : null
                                  );
                                  if (keep) field.onChange(null);
                                  trigger("imagen");
                                }}
                                className="w-3 h-3 text-[#E96D87] border-gray-300 rounded focus:ring-1 focus:ring-[#E96D87]"
                              />
                              <span className="text-[#67463B] leading-tight">
                                Mantener esta imagen
                              </span>
                            </label>
                          )}
                        </div>
                      )}

                      {/* Área de carga más compacta */}
                      <div className="relative">
                        <div
                          className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
                            dragActive
                              ? 'border-[#E96D87] bg-[#E96D87]/5'
                              : 'border-[#D9B9A1] hover:border-[#E96D87] hover:bg-[#E96D87]/5'
                          } ${
                            editing && keepExistingImage 
                              ? 'opacity-50 pointer-events-none' 
                              : 'cursor-pointer'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={(e) => handleDrop(e, field.onChange)}
                          onClick={() => {
                            if (!(editing && keepExistingImage)) {
                              document.getElementById('file-input').click();
                            }
                          }}
                        >
                          <div className="space-y-1">
                            <div className="mx-auto w-8 h-8 bg-[#E96D87]/10 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-[#E96D87]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div className="text-xs text-[#67463B]">
                              <span className="font-medium text-[#E96D87]">
                                Subir imagen
                              </span>{" "}
                              o arrastrar aquí
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WebP (máx. 5MB)
                            </p>
                          </div>
                        </div>

                        <input
                          id="file-input"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={editing && keepExistingImage}
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              field.onChange(files);
                              setPreviewUrl(URL.createObjectURL(files[0]));
                              setKeepExistingImage(false);
                              trigger("imagen");
                            }
                          }}
                          className="hidden"
                        />
                      </div>

                      {errors.imagen && (
                        <p className="text-red-600 text-xs text-center">
                          {errors.imagen.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex justify-center space-x-2 mt-4">
                <AlertDialogCancel
                  className={"cursor-pointer"}
                  onClick={() => {
                    setCreating(false);
                    setEditing(null);
                    setCurrentImageUrl(null);
                  }}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <button
                    type="submit"
                    disabled={!isValid}
                    className={`px-4 py-2 rounded transition-colors ${
                      isValid
                        ? "bg-[#E96D87] text-white cursor-pointer hover:bg-[#d65a74]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    onClick={() => {
                      if (!isValid) {
                        trigger(["nombre", "precio", "stock", "imagen"]);
                      }
                    }}
                  >
                    Guardar
                  </button>
                </AlertDialogAction>
              </div>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}