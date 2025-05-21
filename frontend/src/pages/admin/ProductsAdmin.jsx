import { useEffect, useState } from "react";
import {
  getProductsRequest,
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
      const res = await getProductsRequest(p, size);
      const data = res.data;
      let items, pages, current;
      if (Array.isArray(data)) {
        items = data;
        pages = 1;
        current = 0;
      } else {
        items = data.content;
        pages = data.totalPages;
        current = data.number;
      }
      setProducts(items);
      setTotal(pages);
      setPage(current);
      setAuthError(false);
    } catch (error) {
      if (error.response?.status === 403) {
        setAuthError(true);
        toast.error("No tienes permisos para acceder a esta sección");
      } else {
        toast.error("Error al cargar productos");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(0);
  }, []);

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
      if (file.size > 2 * 1024 * 1024) {
        setError("imagen", {
          type: "manual",
          message: `Imagen demasiado grande (${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)} MB > 2 MB)`,
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

      <div className="mb-4 text-right">
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
                    <Button
                      className="bg-[#3690e4] border-none shadow-none font-[Nunito] text-white cursor-pointer"
                      size="sm"
                      onClick={() => openForm(p)}
                    >
                      Editar
                    </Button>
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
                            className="cursor-pointer"
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
                                fetch(
                                  page === 0 && products.length === 1 ? 0 : page
                                );
                              } catch (err) {
                                const msg =
                                  err?.response?.data?.message ||
                                  "Error al eliminar";

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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-4 text-white font-[Nunito] text-base">
        <Button size="sm" disabled={page === 0} onClick={() => fetch(page - 1)}>
          ← Anterior
        </Button>
        <span>
          Página {page + 1} de {totalPages}
        </span>
        <Button
          size="sm"
          disabled={page + 1 === totalPages}
          onClick={() => fetch(page + 1)}
        >
          Siguiente →
        </Button>
      </div>

      {/* Modal Crear/Editar */}
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
                    <div className="space-y-4">
                      {previewUrl && (
                        <ImageWithSkeleton
                          src={previewUrl}
                          alt="Vista previa"
                          className="h-32 w-32"
                          loading="lazy"
                        />
                      )}

                      {editing && (
                        <label className="inline-flex items-center space-x-2">
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
                          />
                          <span>Mantener imagen actual</span>
                        </label>
                      )}

                      {/* Input file */}
                      <input
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
                        className="block w-full text-sm text-gray-700"
                      />
                      {errors.imagen && (
                        <p className="text-red-600 text-sm">
                          {errors.imagen.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex justify-center space-x-2 mt-4">
                <AlertDialogCancel
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
