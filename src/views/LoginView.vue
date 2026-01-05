<template>
    <div class="min-h-screen flex items-center justify-center bg-muted px-4">
        <Card class="w-full max-w-md">
            <CardHeader class="text-center">
                <CardTitle>Inicio de sesión</CardTitle>
                <CardDescription>
                    Ingresa tu correo electrónico y contraseña
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form class="grid gap-4">
                    <div class="space-y-1.5">
                        <Label for="email">Correo</Label>
                        <Input id="email" type="email" placeholder="correo@ejemplo.com" v-model="loginForm.correo" />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="password">Contraseña</Label>
                        <Input id="password" type="password" v-model="loginForm.password" />
                    </div>
                </form>
            </CardContent>

            <CardFooter class="flex flex-col gap-3">
                <Button class="w-full" :disabled="disable || login" @click="handleLogin">
                    <Spinner v-if="login" class="mr-2 h-4 w-4" />
                    Iniciar sesión
                </Button>

                <p class="text-sm text-muted-foreground">
                    ¿No tienes una cuenta?
                </p>

                <Button variant="outline" class="w-full" @click="handleSignIn">
                    Regístrate
                </Button>
            </CardFooter>
        </Card>
    </div>
</template>
<script setup>
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import supabase from '@/supabase/client';

const router = useRouter();

const login = ref(false);
const disable = computed(() => {
    return loginForm.value.correo === '' || loginForm.value.password === '';
})

const loginForm = ref({
    correo: '',
    password: '',
})
const errors = ref({
    correo: '',
    password: ''
})

const onValidate = () => {
    Object.keys(errors.value).forEach(key => {
        errors.value[key] = ''
    })

    if (!loginForm.value.correo.trim()) {
        errors.value.correo = 'El correo es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.correo)) {
        errors.value.correo = 'Correo inválido'
    }

    // Password
    if (!loginForm.value.password.trim()) {
        errors.value.password = 'La contraseña es obligatoria'
    } else if (loginForm.value.password.length < 6) {
        errors.value.password = 'Mínimo 6 caracteres'
    }

    // Si hay errores, retorna false
    return !Object.values(errors.value).some(error => error)
}

const handleLogin = async () => {
    console.log("Correo ingresado", loginForm.value.correo);
    console.log("Correo contraseña", loginForm.value.password);
    if (!onValidate()) return

    try {
        console.log('Proceso de inicio de sesion Iniciado')
        login.value = true;
        const result = await supabase.auth.signInWithPassword({
            email: loginForm.value.correo,
            password: loginForm.value.password,
        })

        console.log('Formulario Valido', loginForm.value);
        console.log({ result })
        router.replace('/');
    } catch (error) {
        console.log('Ocurrio un error', error);
    } finally {
        login.value = false
    }
}

const handleSignIn = () => {
    router.replace('/register')
}
</script>