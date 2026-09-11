import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">

      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Iniciar Sesion</CardTitle>
          <CardDescription>
            Ingrece su usuario y contracioña para acceder al sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
