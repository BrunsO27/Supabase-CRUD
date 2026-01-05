<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger as-child>
            <Button>
                <Plus class="mr-2 h-4 w-4" />
                Nueva Tarea
            </Button>
        </DialogTrigger>

        <DialogContent @escape-key-down.prevent @pointer-down-outside.prevent>
            <DialogHeader>
                <DialogTitle> Nueva Tarea </DialogTitle>
                <DialogDescription>
                    Llena el formulario para poder crear una nueva tarea
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit">
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>
                                Título
                            </FieldLabel>
                            <Input v-model="formData.titulo" type="text" placeholder="Título de la nueva tarea"
                                :disabled="creando" />
                        </Field>
                        <Field>
                            <FieldLabel>
                                Descripción
                            </FieldLabel>
                            <Textarea v-model="formData.descripcion" placeholder="Descripción de la nueva tarea"
                                :disabled="creando" />
                        </Field>
                    </FieldGroup>
                </FieldSet>

                <!-- Mostrar errores si los hay -->
                <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p class="text-sm text-red-600">{{ error }}</p>
                </div>
            </form>

            <DialogFooter>
                <Button variant="outline" @click="handleCancel" :disabled="creando">
                    Cancelar
                </Button>
                <Button :disabled="disable || creando" @click="handleSubmit">
                    {{ creando ? 'Creando...' : 'Crear Tarea' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from '@/components/ui/field';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Plus } from 'lucide-vue-next';

import { getUser } from '@/composables/getUser.js';
import supabase from '@/supabase/client';

// Emit para notificar al padre cuando se crea una tarea
const emit = defineEmits(['task-created']);

// Estados
const isOpen = ref(false);
const creando = ref(false);
const error = ref('');

const formData = ref({
    titulo: '',
    descripcion: ''
});

// Computed para deshabilitar el botón si faltan datos
const disable = computed(() => {
    return formData.value.titulo.trim() === '';
});

const handleSubmit = async () => {
    // Validación
    if (!formData.value.titulo.trim()) {
        error.value = 'El título es obligatorio';
        return;
    }

    try {
        creando.value = true;
        error.value = '';

        const user = await getUser();

        if (!user) {
            error.value = 'No se pudo obtener la información del usuario';
            return;
        }

        console.log('Nueva tarea:', formData.value);

        const { data, error: insertError } = await supabase
            .from('Tarea')
            .insert([{
                titulo: formData.value.titulo,
                descripcion: formData.value.descripcion,
                userId: user.id,
                completada: false // Asegurar que empiece como no completada
            }])
            .select();

        if (insertError) {
            console.error('Error de Supabase:', insertError);
            error.value = `Error al crear la tarea: ${insertError.message}`;
            return;
        }

        console.log('Tarea creada exitosamente:', data);

        // Emitir evento al padre para que recargue la tabla
        emit('task-created', data[0]);

        // Cerrar el diálogo
        resetForm();
        isOpen.value = false;
    } catch (err) {
        console.error('Ocurrió un error al crear una nueva tarea:', err);
        error.value = 'Ocurrió un error inesperado. Intenta de nuevo.';
    } finally {
        creando.value = false;
    }
};

const handleCancel = () => {
    resetForm();
    isOpen.value = false;
};

const resetForm = () => {
    formData.value = {
        titulo: '',
        descripcion: ''
    };
    error.value = '';
};
</script>