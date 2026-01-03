<template>
    <Card class="w-full max-w-sm">
        <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>
                Ingresa tu correo electronico y contraseña para registrarte
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
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
            <Button class="w-full">
                Registrate
            </Button>
            <p>¿Ya tienes una cuenta?</p>
            <Button variant="outline" class="w-full" @click="handleLogin">
                Iniciar Sesion
            </Button>
        </CardFooter>
    </Card>
</template>
<script setup>
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const login = ref(false);


const loginForm = ref({
    correo: '',
    password: '',
})

const handleLogin = () => {
    router.replace('/login')
}
</script>