<template>
    <Card class="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Inicio de Sesion</CardTitle>
            <CardDescription>
                Ingresa tu correo electronico y contraseña para iniciar sesion
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form >
                <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                        <Label for="email"> Correo </Label>
                        <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                        <Label for="email"> Contraseña </Label>
                        <Input id="password" type="password" />
                    </div>
                </div>
            </form>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
            <Button class="w-full" @click="handleLogin">
                <Spinner v-if="login"/>
                Iniciar Sesion
            </Button>
            <p>¿No tienes una cuenta?</p>
            <Button variant="outline" class="w-full" @click="handleSignIn">
                Registrate
            </Button>
        </CardFooter>
    </Card>
</template>
<script setup>
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner'
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

    if (!singInForm.value.correo.trim()) {
        errors.value.correo = 'El correo es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(singInForm.value.correo)) {
        errors.value.correo = 'Correo inválido'
    }

    // Password
    if (!singInForm.value.password.trim()) {
        errors.value.password = 'La contraseña es obligatoria'
    } else if (singInForm.value.password.length < 6) {
        errors.value.password = 'Mínimo 6 caracteres'
    }

    // Si hay errores, retorna false
    return !Object.values(errors.value).some(error => error)
}

const handleLogin = async () => {
    console.log("Correo ingresado", loginForm.value.correo);
    console.log("Correo contraseña", loginForm.value.password);
    if(!onValidate()) return

    try {
        console.log('Proceso de inicio de sesion Iniciado')
        login.value = true;
        const result = await supabase.auth.signInWithPassword({
            email: loginForm.value.correo,
            password: loginForm.value.password,
        })

        console.log('Formulario Valido', loginForm.value);
        console.log({ result })
        login.value = false;
    } catch(error) {
        console.log('Ocurrio un error', error);
    }
}

const handleSignIn = () => {
    router.replace('/register')
}
</script>