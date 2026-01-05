<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
        <Header @nueva-tarea="handleNuevaTarea" />

        <main class="container mx-auto py-8 px-4 max-w-6xl">
            <TaskTable ref="taskTableRef" />
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import TaskTable from '@/components/TaskTable.vue';

const taskTableRef = ref(null);

const handleNuevaTarea = () => {
    console.log('Recargando tabla desde HomeView...');
    if (taskTableRef.value) {
        taskTableRef.value.cargarTareas();
    }
};
</script>