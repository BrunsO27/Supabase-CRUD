<template>
    <div class="min-h-screen flex items-center justify-center bg-muted px-4">
        <Card class="w-full max-w-md">
            <CardHeader class="text-center">
                <CardTitle>Registro</CardTitle>
                <CardDescription>
                    Ingresa los siguientes datos solicitados para poder registrarte
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form @submit.prevent="handleSignUp" class="grid gap-4">
                    <div class="space-y-1.5">
                        <Label for="correo"> Correo </Label>
                        <Input id="correo" type="email" placeholder="correo@ejemplo.com" v-model="singInForm.correo" />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="password"> Contraseña </Label>
                        <Input id="password" type="password" v-model="singInForm.password" />
                    </div>
                </form>
            </CardContent>

            <CardFooter class="flex flex-col gap-3">
                <Button :disabled="disable || login" class="w-full" @click="handleSignUp">
                    <Spinner v-if="login" class="mr-2 h-4 w-4" />
                    Registrate
                </Button>

                <p class="text-sm text-muted-foreground">
                    ¿Ya tienes una cuenta?
                </p>

                <Button variant="outline" class="w-full" @click="handleLogin">
                    Iniciar Sesion
                </Button>
            </CardFooter>
        </Card>
    </div>
</template>
<script setup>
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import supabase from '@/supabase/client';

const router = useRouter();

const login = ref(false);
const disable = computed(() => {
    return singInForm.value.correo === '' || singInForm.value.password === '';
})

const singInForm = ref({
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

const handleSignUp = async () => {
    if (!onValidate()) return

    try {
        console.log('Proceso de registro Iniciado')
        login.value = true;
        const result = await supabase.auth.signUp({
            email: singInForm.value.correo,
            password: singInForm.value.password,
        })

        console.log('Formulario Valido', singInForm.value);
        console.log({ result });
        router.replace('/');
    } catch (error) {
        console.log('Ocurrio un error', error);
    } finally {
        login.value = false
    }

}

const handleLogin = () => {
    router.replace('/login')
}
</script>