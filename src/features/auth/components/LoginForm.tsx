import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../model/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

export const LoginForm = () => {
  const navigate = useNavigate();

  const login = useLogin();

  const [errorForm, setErrorForm] = useState<null | string>(null);
  const [hidenPass, setHidenPass] = useState<boolean>(true);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorForm(null);
    try {
      await login.mutateAsync(data);
      navigate("/admin", { replace: true });
    } catch (error) {
      setErrorForm(
        error instanceof Error ? error.message : "No se pudo iniciar sesion",
      );
    }
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="user">Usuario</FieldLabel>
              <Input
                {...field}
                id="user"
                aria-invalid={fieldState.invalid}
                placeholder="Ingresa tu usuario"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="password">Contraseña</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ingresa tu contraseña"
                  type={hidenPass ? "password" : "text"}
                />
                <InputGroupButton
                  size="icon-xs"
                  className="mr-1"
                  onClick={() => setHidenPass(!hidenPass)}
                >
                  {hidenPass ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {errorForm && <FieldError errors={[{ message: errorForm }]} />}
        <Field>
          <Button type="submit" disabled={login.isPending}>
            {login.isPending && <LoaderCircle className="animate-spin" />}
            Igresar
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};
