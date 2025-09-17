import { useEffect, useState } from "react";
import {
  getAllPaymentMethodsRequest,
  createPaymentMethodRequest,
  updatePaymentMethodRequest,
  deletePaymentMethodRequest,
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
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";

export default function PaymentMethodsAdmin() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null);

  async function fetchMethods() {
    setLoading(true);
    try {
      const { data } = await getAllPaymentMethodsRequest();
      setMethods(Array.isArray(data) ? data : []); 
    } catch {
      toast.error("Error al cargar métodos de pago");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createPaymentMethodRequest(newName);
      toast.success("Método agregado");
      setNewName("");
      fetchMethods();
    } catch {
      toast.error("Error al crear método");
    }
  };

  const handleUpdate = async (id, nombre) => {
    try {
      await updatePaymentMethodRequest(id, nombre);
      toast.success("Método actualizado");
      setEditing(null);
      fetchMethods();
    } catch {
      toast.error("Error al actualizar método");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePaymentMethodRequest(id);
      toast.success("Método eliminado");
      fetchMethods();
    } catch {
      toast.error("Error al eliminar método");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#E96D87] to-[#F9A1B0]">
      <h2 className="text-3xl text-white text-center mb-8 font-[Comic_Neue]">
        Métodos de Pago
      </h2>

      {/* Crear método */}
      <div className="flex items-center gap-2 mb-6">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nuevo método"
          className="flex-1 border rounded px-3 py-2 bg-white"
        />
        <Button onClick={handleCreate} className="bg-[#3690e4] text-white cursor-pointer">
          Agregar
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
            ) : methods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>No hay métodos registrados.</TableCell>
              </TableRow>
            ) : (
              methods.map((m) => (
                <TableRow key={m.id} className="text-center font-[Nunito]">
                  <TableCell>{m.id}</TableCell>
                  <TableCell>
                    {editing?.id === m.id ? (
                      <Input
                        defaultValue={m.nombre}
                        onChange={(e) =>
                          setEditing({ ...editing, nombre: e.target.value })
                        }
                      />
                    ) : (
                      m.nombre
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    {editing?.id === m.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(m.id, editing.nombre)}
                          className="bg-[#3690e4] text-white"
                        >
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditing(null)}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="bg-[#E96D87] text-white cursor-pointer"
                          onClick={() => setEditing(m)}
                        >
                          Editar
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                            >
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#FCF8EC] border-[#D9B9A1]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Eliminar método?
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <p className="text-sm text-gray-600">
                              Esta acción no se puede deshacer.
                            </p>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(m.id)}
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
    </div>
  );
}
