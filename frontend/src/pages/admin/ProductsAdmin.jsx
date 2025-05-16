// src/pages/admin/ProductsAdmin.jsx
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
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

const schema = yup.object({
  nombre: yup.string().required("Nombre obligatorio"),
  precio: yup.number().min(0, "Precio inválido").required("Precio obligatorio"),
  stock: yup.number().min(0, "Stock inválido").required("Stock obligatorio"),
  descripcion: yup.string().optional(),
});

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: {
      nombre: "",
      precio: 0,
      stock: 0,
      descripcion: "",
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
    } catch {
      toast.error("Error al cargar productos");
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
      reset({
        nombre: product.nombre,
        precio: product.precio,
        stock: product.stock,
        descripcion: product.descripcion || "",
      });
    } else {
      setCreating(true);
      reset({ nombre: "", precio: 0, stock: 0, descripcion: "" });
    }
  };

  const onSubmit = async (data) => {
    try {
      if (creating) {
        await createProductRequest(data);
        toast.success("Producto creado");
      } else {
        await updateProductRequest(editing.id, data);
        toast.success("Producto actualizado");
      }
      setEditing(null);
      setCreating(false);
      fetch(page);
    } catch {
      toast.error("Error en operación");
    }
  };

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
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>Cargando…</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No hay productos.</TableCell>
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
                  <TableCell className="flex justify-center items-center gap-2">
                    {/* EDITAR */}
                    <Button
                      className="bg-[#3690e4] border-none shadow-none font-[Nunito] text-white cursor-pointer"
                      size="sm"
                      onClick={() => openForm(p)}
                    >
                      Editar
                    </Button>

                    {/* ELIMINAR */}
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
                              } catch {
                                toast.error("Error al eliminar");
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

      {/* Paginación */}
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
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
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
                    <Input {...field} placeholder="Descripción (opcional)" />
                  )}
                />
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                <AlertDialogCancel
                  onClick={() => {
                    setCreating(false);
                    setEditing(null);
                  }}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <button
                    type="submit"
                    disabled={!isValid}
                    className="bg-[#E96D87] text-white px-4 py-2 rounded"
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