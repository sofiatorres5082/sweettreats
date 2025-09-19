import { useEffect, useState } from "react";
import {
  getCategoriesRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
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
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);

  async function fetchCategories(p = 0) {
    setLoading(true);
    try {
      const { data } = await getCategoriesRequest(p, size);
      setCategories(data.content);
      setTotal(data.totalPages);
      setPage(data.number);
    } catch {
      toast.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories(0);
  }, []);

  const handleCreate = async () => {
    if (!newCategory.trim()) return toast.error("Nombre requerido");
    try {
      await createCategoryRequest(newCategory);
      toast.success("Categoría creada");
      setNewCategory("");
      fetchCategories(page);
    } catch {
      toast.error("Error al crear categoría");
    }
  };

  const handleUpdate = async (id, nombre) => {
    try {
      await updateCategoryRequest(id, nombre);
      toast.success("Categoría actualizada");
      setEditing(null);
      fetchCategories(page);
    } catch {
      toast.error("Error al actualizar categoría");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategoryRequest(id);
      toast.success("Categoría eliminada");
      fetchCategories(page);
    } catch {
      toast.error("Error al eliminar categoría");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#E96D87] to-[#F9A1B0]">
      <h2 className="text-3xl text-white text-center mb-8 font-[Comic_Neue]">
        Gestión de Categorías
      </h2>

      {/* Crear nueva */}
      <div className="flex items-center gap-2 mb-6">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nombre de categoría"
          className="flex-1 border rounded px-3 py-2 bg-white"
        />
        <Button
          className="bg-[#3690e4] text-white cursor-pointer"
          onClick={handleCreate}
        >
          Crear
        </Button>
      </div>

      {/* Tabla */}
      <div className="overflow-auto bg-white rounded-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E96D87] text-white text-center">
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>Cargando…</TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No hay categorías.</TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow
                  key={c.id}
                  className="hover:bg-gray-50 font-[Nunito] text-base text-center"
                >
                  <TableCell>{c.id}</TableCell>
                  <TableCell>
                    {editing?.id === c.id ? (
                      <Input
                        defaultValue={c.nombre}
                        onChange={(e) =>
                          setEditing({ ...editing, nombre: e.target.value })
                        }
                      />
                    ) : (
                      c.nombre
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    {editing?.id === c.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(c.id, editing.nombre)}
                          className="bg-[#3690e4] text-white cursor-pointer"
                        >
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditing(null)}
                          className="cursor-pointer"
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="bg-[#E96D87] text-white cursor-pointer"
                          onClick={() => setEditing(c)}
                        >
                          Editar
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-red-500 text-white cursor-pointer"
                            >
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Eliminar {c.nombre}?
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <p className="text-sm text-gray-600">
                              Esta acción no se puede deshacer.
                            </p>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(c.id)}
                                className="bg-red-500 text-white cursor-pointer"
                              >
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-6 space-x-6 text-white font-[Nunito] text-base">
        <Button
          size="sm"
          className="cursor-pointer bg-white text-[#E96D87] shadow-md px-4 py-2 hover:bg-gray-100 transition"
          disabled={page === 0}
          onClick={() => fetchCategories(page - 1)}
        >
          ← Anterior
        </Button>
        <span className="px-3 py-1 bg-[#E96D87] text-white font-semibold shadow-sm">
          Página {page + 1} de {totalPages}
        </span>
        <Button
          size="sm"
          className="cursor-pointer bg-white text-[#E96D87] shadow-md px-4 py-2 hover:bg-gray-100 transition"
          disabled={page + 1 === totalPages}
          onClick={() => fetchCategories(page + 1)}
        >
          Siguiente →
        </Button>
      </div>
    </div>
  );
}