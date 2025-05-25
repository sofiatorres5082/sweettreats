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
  roles: yup
    .array()
    .of(yup.string().oneOf(Object.keys(ROLE_LABELS)))
    .min(1, "Selecciona al menos un rol"),
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
    defaultValues: {
      name: "",
      email: "",
      roles: [],
    },
  });

  const fetchUsers = async (p = 0) => {
    setLoading(true);
    try {
      const { data } = await getUsersRequest(p, size);
      setUsers(data.content);
      setTotal(data.totalPages);
      setPage(data.number);
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
    const roleValues = user.roles.map((r) =>
      typeof r === "string" ? r : r.roleEnum
    );
    reset({ name: user.name, email: user.email, roles: roleValues });
  };

  const onEditSubmit = async (data) => {
    try {
      await updateUserRequest(editingUser.id, {
        name: data.name,
        email: data.email,
        roles: data.roles,
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
      setDeletingUser(null);
      if (users.length === 1 && page > 0) {
        fetchUsers(page - 1);
      } else {
        fetchUsers(page);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("No se puede eliminar: el usuario tiene dependencias");
      } else {
        toast.error("Error al eliminar usuario");
      }
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
                      .map((r) => ROLE_LABELS[r.roleEnum] || r.roleEnum || r)
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
                          size="sm"
                          className="bg-[#3690e4] border-none shadow-none font-[Nunito] text-white cursor-pointer"
                          onClick={() => openEdit(u)}
                        >
                          Editar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-center">
                            Editar Usuario #{u.id}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-center">
                            Modifica nombre, email y roles.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form
                          onSubmit={handleSubmit(onEditSubmit)}
                          className="space-y-4 p-4"
                        >
                          {["name", "email"].map((f) => (
                            <div key={f}>
                              <Controller
                                name={f}
                                control={control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder={
                                      f.charAt(0).toUpperCase() + f.slice(1)
                                    }
                                    className="w-full"
                                  />
                                )}
                              />
                              {errors[f] && (
                                <p className="text-red-600 text-sm">
                                  {errors[f].message}
                                </p>
                              )}
                            </div>
                          ))}

                          <div>
                            <label className="block mb-1 font-[Nunito]">
                              Roles
                            </label>
                            <Controller
                              name="roles"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={
                                    field.value.length
                                      ? field.value[0]
                                      : undefined
                                  }
                                  onValueChange={(value) =>
                                    field.onChange([value])
                                  }
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

                          <div className="flex justify-center space-x-2 mt-4">
                            <AlertDialogCancel
                              className="font-[Nunito] cursor-pointer"
                              onClick={() => setEditingUser(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <button
                                type="submit"
                                disabled={!isValid}
                                className="bg-[#E96D87] text-white px-4 py-2 rounded cursor-pointer font-[Nunito]"
                              >
                                Guardar
                              </button>
                            </AlertDialogAction>
                          </div>
                        </form>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog
                      open={deletingUser?.id === u.id}
                      onOpenChange={(open) => !open && setDeletingUser(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-[#c7002b] border-none shadow-none font-[Nunito] text-white cursor-pointer"
                          onClick={() => setDeletingUser(u)}
                        >
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-md bg-[#FCF8EC] text-[#67463B] border-[#D9B9A1]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-center">
                            ¿Eliminar Usuario #{u.id}?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-center">
                            Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex justify-center space-x-2 mt-4">
                          <AlertDialogCancel
                            className="cursor-pointer font-[Nunito]"
                            onClick={() => setDeletingUser(null)}
                          >
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-[#E96D87] text-white px-4 py-2 rounded cursor-pointer font-[Nunito]"
                            onClick={confirmDelete}
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
