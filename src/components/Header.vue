<template>
    <header class="border-b bg-white shadow-sm">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <h1 class="text-2xl font-bold">Gestor de Tareas</h1>
            </div>

            <div class="flex items-center gap-4">
                <DialogNewTask @task-created="handleTaskCreated" />

                <Button variant="ghost" @click="handleLogout">
                    <LogOut class="mr-2 h-4 w-4" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import DialogNewTask from '@/components/DialogNewTask.vue';
import { LogOut } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import supabase from '@/supabase/client';


const router = useRouter();
const emit = defineEmits(['nueva-tarea']);

const handleTaskCreated = (nuevaTarea) => {
    console.log('Tarea creada en Header:', nuevaTarea);
    emit('nueva-tarea');
};

const handleLogout = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        router.push('/login');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
    }
};
</script>