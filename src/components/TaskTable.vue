<template>
    <div class="w-full space-y-4">
        <!-- Loading State -->
        <div v-if="cargando" class="flex justify-center py-8">
            <p class="text-gray-500">Cargando tareas...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Tabla -->
        <Table v-else>
            <TableHeader>
                <TableRow>
                    <TableHead class="w-[100px]"> Estado </TableHead>
                    <TableHead> Título </TableHead>
                    <TableHead> Descripción </TableHead>
                    <TableHead class="text-right w-[150px]"> Acciones </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow v-if="tareas.length === 0">
                    <TableCell colspan="4" class="text-center py-8 text-gray-500">
                        No hay tareas registradas. Crea una tarea nueva.
                    </TableCell>
                </TableRow>

                <TableRow v-for="tarea in tareas" :key="tarea.idTarea">
                    <TableCell>
                        <div class="flex items-center gap-2">
                            <Check v-if="tarea.completada" class="h-5 w-5 text-green-600" />
                            <X v-else class="h-5 w-5 text-gray-400" />
                            <span :class="tarea.completada ? 'text-green-600' : 'text-gray-500'">
                                {{ tarea.completada ? 'Completada' : 'Pendiente' }}
                            </span>
                        </div>
                    </TableCell>

                    <TableCell class="font-medium">
                        <span :class="{ 'line-through text-gray-400': tarea.completada }">
                            {{ tarea.titulo }}
                        </span>
                    </TableCell>

                    <TableCell>
                        <span :class="{ 'line-through text-gray-400': tarea.completada }">
                            {{ tarea.descripcion || 'Sin descripción' }}
                        </span>
                    </TableCell>

                    <TableCell class="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <Button variant="ghost" size="icon">
                                    <Menu class="h-4 w-4" />
                                    <span class="sr-only">Menu de Acciones</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem @click="abrirDialogoCompletar(tarea)">
                                    <CheckCircle v-if="!tarea.completada" class="mr-2 h-4 w-4" />
                                    <Circle v-else class="mr-2 h-4 w-4" />
                                    {{ tarea.completada ? 'Marcar incompleta' : 'Marcar completa' }}
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="abrirDialogoEditar(tarea)">
                                    <Pencil class="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem @click="abrirDialogoEliminar(tarea)" class="text-red-600">
                                    <Eraser class="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <!-- Diálogo de Edición -->
        <Dialog v-model:open="dialogoEditar.abierto">
            <DialogContent @escape-key-down.prevent @pointer-down-outside.prevent>
                <DialogHeader>
                    <DialogTitle>Editar Tarea</DialogTitle>
                    <DialogDescription>
                        Modifica los detalles de tu tarea
                    </DialogDescription>
                </DialogHeader>

                <div class="grid gap-4 py-4">
                    <div class="space-y-2">
                        <Label for="edit-titulo">Título</Label>
                        <Input id="edit-titulo" v-model="dialogoEditar.datos.titulo" placeholder="Título de la tarea" />
                    </div>
                    <div class="space-y-2">
                        <Label for="edit-descripcion">Descripción</Label>
                        <Textarea id="edit-descripcion" v-model="dialogoEditar.datos.descripcion"
                            placeholder="Descripción de la tarea" />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="cerrarDialogoEditar">
                        Cancelar
                    </Button>
                    <Button @click="confirmarEditar" :disabled="actualizando.editar">
                        {{ actualizando.editar ? 'Guardando...' : 'Guardar cambios' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Diálogo de Completar/Incompletar -->
        <Dialog v-model:open="dialogoCompletar.abierto">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {{ dialogoCompletar.tarea?.completada ? 'Marcar como incompleta' : 'Marcar como completa' }}
                    </DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas cambiar el estado de esta tarea?
                    </DialogDescription>
                </DialogHeader>

                <div class="py-4">
                    <p class="text-sm font-medium">{{ dialogoCompletar.tarea?.titulo }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ dialogoCompletar.tarea?.descripcion }}</p>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="cerrarDialogoCompletar">
                        Cancelar
                    </Button>
                    <Button @click="confirmarCompletar" :disabled="actualizando.completar">
                        {{ actualizando.completar ? 'Actualizando...' : 'Confirmar' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Diálogo de Eliminación -->
        <Dialog v-model:open="dialogoEliminar.abierto">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Tarea</DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta tarea?
                    </DialogDescription>
                </DialogHeader>

                <div class="py-4">
                    <p class="text-sm font-medium">{{ dialogoEliminar.tarea?.titulo }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ dialogoEliminar.tarea?.descripcion }}</p>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="cerrarDialogoEliminar">
                        Cancelar
                    </Button>
                    <Button variant="destructive" @click="confirmarEliminar" :disabled="actualizando.eliminar">
                        {{ actualizando.eliminar ? 'Eliminando...' : 'Eliminar' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, X, Eraser, Pencil, Menu, CheckCircle, Circle } from 'lucide-vue-next';

import supabase from '@/supabase/client';
import { getUser } from '@/composables/getUser';

const tareas = ref([]);
const cargando = ref(true);
const error = ref('');
const actualizando = ref({
    editar: false,
    completar: false,
    eliminar: false
});

const dialogoEditar = ref({
    abierto: false,
    tarea: null,
    datos: {
        titulo: '',
        descripcion: ''
    }
});

const dialogoCompletar = ref({
    abierto: false,
    tarea: null
});

const dialogoEliminar = ref({
    abierto: false,
    tarea: null
});

onMounted(async () => {
    await cargarTareas();
});

const cargarTareas = async () => {
    try {
        cargando.value = true;
        error.value = '';

        const user = await getUser();
        if (!user) {
            error.value = 'Usuario no autenticado';
            return;
        }

        const { data: Tarea, error: fetchError } = await supabase
            .from('Tarea')
            .select('*')
            .eq('userId', user.id)
            .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        tareas.value = Tarea || [];
    } catch (err) {
        console.error('Error al cargar las tareas del usuario', err);
        error.value = 'Error al cargar las tareas';
    } finally {
        cargando.value = false;
    }
};

const abrirDialogoEditar = (tarea) => {
    dialogoEditar.value.tarea = tarea;
    dialogoEditar.value.datos = {
        titulo: tarea.titulo,
        descripcion: tarea.descripcion || ''
    };
    dialogoEditar.value.abierto = true;
};

const abrirDialogoCompletar = (tarea) => {
    dialogoCompletar.value.tarea = tarea;
    dialogoCompletar.value.abierto = true;
};

const abrirDialogoEliminar = (tarea) => {
    dialogoEliminar.value.tarea = tarea;
    dialogoEliminar.value.abierto = true;
};

// Funciones para cerrar diálogos
const cerrarDialogoEditar = () => {
    dialogoEditar.value.abierto = false;
    dialogoEditar.value.tarea = null;
};

const cerrarDialogoCompletar = () => {
    dialogoCompletar.value.abierto = false;
    dialogoCompletar.value.tarea = null;
};

const cerrarDialogoEliminar = () => {
    dialogoEliminar.value.abierto = false;
    dialogoEliminar.value.tarea = null;
};

// Funciones de confirmación
const confirmarEditar = async () => {
    try {
        actualizando.value.editar = true;

        const { error: updateError } = await supabase
            .from('Tarea')
            .update({
                titulo: dialogoEditar.value.datos.titulo,
                descripcion: dialogoEditar.value.datos.descripcion
            })
            .eq('idTarea', dialogoEditar.value.tarea.idTarea);

        if (updateError) throw updateError;

        const tarea = tareas.value.find(t => t.idTarea === dialogoEditar.value.tarea.idTarea);
        if (tarea) {
            tarea.titulo = dialogoEditar.value.datos.titulo;
            tarea.descripcion = dialogoEditar.value.datos.descripcion;
        }

        cerrarDialogoEditar();
    } catch (err) {
        console.error('Error al editar tarea:', err);
        alert('Error al editar la tarea');
    } finally {
        actualizando.value.editar = false;
    }
};

const confirmarCompletar = async () => {
    try {
        actualizando.value.completar = true;

        const nuevoEstado = !dialogoCompletar.value.tarea.completada;

        const { error: updateError } = await supabase
            .from('Tarea')
            .update({ completada: nuevoEstado })
            .eq('idTarea', dialogoCompletar.value.tarea.idTarea);

        if (updateError) throw updateError;

        const tarea = tareas.value.find(t => t.idTarea === dialogoCompletar.value.tarea.idTarea);
        if (tarea) {
            tarea.completada = nuevoEstado;
        }

        cerrarDialogoCompletar();
    } catch (err) {
        console.error('Error al actualizar tarea:', err);
        alert('Error al actualizar la tarea');
    } finally {
        actualizando.value.completar = false;
    }
};

const confirmarEliminar = async () => {
    try {
        actualizando.value.eliminar = true;

        const { error: deleteError } = await supabase
            .from('Tarea')
            .delete()
            .eq('idTarea', dialogoEliminar.value.tarea.idTarea);

        if (deleteError) throw deleteError;

        // Eliminar de la lista local
        tareas.value = tareas.value.filter(t => t.idTarea !== dialogoEliminar.value.tarea.idTarea);

        cerrarDialogoEliminar();
    } catch (err) {
        console.error('Error al eliminar tarea:', err);
        alert('Error al eliminar la tarea');
    } finally {
        actualizando.value.eliminar = false;
    }
};

// Exponer función para recargar desde el padre
defineExpose({
    cargarTareas
});
</script>