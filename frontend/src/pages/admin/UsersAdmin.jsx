import { useEffect, useState } from "react";
import {
  getUsersRequest,
  updateUserRequest,
  deleteUserRequest,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const ROLE_LABELS = {
  USER: "Usuario",
  ADMIN: "Administrador",
};

const ROLE_OPTIONS = [
  { value: "USER", label: ROLE_LABELS.USER },
  { value: "ADMIN", label: ROLE_LABELS.ADMIN },
];

const editSchema = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio"),
});

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(editSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "" },
  });

  const fetchUsers = async (p = 0) => {
    setLoading(true);
    try {
      const res = await getUsersRequest(p, size);
      const pageData = res.data;
      setUsers(pageData.content);
      setTotal(pageData.totalPages);
      setPage(pageData.number);
    } catch {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    reset({ name: user.name, email: user.email });
  };

  const onEditSubmit = async (data) => {
    try {
      await updateUserRequest(editingUser.id, {
        name: data.name,
        email: data.email,
        roles: data.roles, // ["USER","ADMIN"]
      });
      toast.success("Usuario actualizado");
      setEditingUser(null);
      fetchUsers(page);
    } catch {
      toast.error("Error al actualizar usuario");
    }
  };
  const confirmDelete = async () => {
    try {
      await deleteUserRequest(deletingUser.id);
      toast.success("Usuario eliminado");
      if (users.length === 1 && page > 0) {
        fetchUsers(page - 1);
      } else {
        fetchUsers(page);
      }
    } catch {
      toast.error("Error al eliminar usuario");
    } finally {
      setDeletingUser(null);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#E96D87] to-[#F9A1B0]">
      <h2 className="text-3xl font-[Comic_Neue] text-white text-center mb-10">
        Gestión de Usuarios
      </h2>

      <div className="overflow-auto bg-white rounded-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E96D87] text-white font-[Nunito] text-base text-center">
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell>Actualizado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>Cargando…</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>No hay usuarios.</TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow
                  key={u.id}
                  className="hover:bg-gray-50 font-[Nunito] text-base text-center"
                >
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    {u.roles
                      .map((r) => ROLE_LABELS[r.roleEnum] || r.roleEnum)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(u.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <AlertDialog open={editingUser?.id === u.id}>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-[#3690e4] border-none shadow-none cursor-pointer
                        font-[Nunito] text-base text-white"
                          size="sm"
                          onClick={() => openEdit(u)}
                        >
                          Editar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1] flex flex-col justify-center items-center">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-center">
                            Editar Usuario #{u.id}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Modifica nombre y correo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <form
                          onSubmit={handleSubmit(onEditSubmit)}
                          className="space-y-4 p-4"
                        >
                          {["name", "email"].map((field) => (
                            <div key={field}>
                              <Controller
                                name={field}
                                control={control}
                                render={({ field: f }) => (
                                  <Input
                                    {...f}
                                    placeholder={field}
                                    className="w-full"
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
                            <label className="block mb-1">Roles</label>
                            <Controller
                              name="roles"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  multiple
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona roles" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#FCF8EC] text-[#67463B]">
                                    {ROLE_OPTIONS.map((opt) => (
                                      <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                      >
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.roles && (
                              <p className="text-red-600 text-sm">
                                {errors.roles.message}
                              </p>
                            )}
                          </div>

                          <AlertDialogFooter className="flex items-center w-full">
                            <AlertDialogCancel
                              onClick={() => setEditingUser(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <button
                                type="submit"
                                disabled={!isValid}
                                className="bg-[#E96D87] text-white"
                              >
                                Guardar
                              </button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </form>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog
                      open={deletingUser?.id === u.id}
                      onOpenChange={(o) => !o && setDeletingUser(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-[#c7002b] border-none shadow-none cursor-pointer
                        font-[Nunito] text-base text-white"
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeletingUser(u)}
                        >
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1] flex flex-col justify-center items-center">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-center">
                            ¿Eliminar Usuario #{u.id}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex space-x-2">
                          <AlertDialogCancel
                            onClick={() => setDeletingUser(null)}
                          >
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-[#E96D87] text-white px-4 py-2 rounded-lg"
                            onClick={confirmDelete}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
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
        <Button
          size="sm"
          disabled={page === 0}
          onClick={() => fetchUsers(page - 1)}
        >
          ← Anterior
        </Button>
        <span>
          Página {page + 1} de {totalPages}
        </span>
        <Button
          size="sm"
          disabled={page + 1 === totalPages}
          onClick={() => fetchUsers(page + 1)}
        >
          Siguiente →
        </Button>
      </div>
    </div>
  );
}
