# Patients App — Frontend (Angular 16 + PrimeNG)

Aplicación web para **gestión de pacientes** que consume la API del backend. Incluye listado con paginación/filtrado, creación/edición con validaciones, detalle y **reporte (exportación CSV/XLSX)** de pacientes creados desde una fecha. Pruebas unitarias con **Jasmine + Karma** corriendo en **ChromeHeadless** (vía Puppeteer).

---

## 1) Objetivo
- Listar pacientes con **paginación server-side** y **filtros** por nombre/documento.
- **Crear/Editar** pacientes con formulario reactivo (incluye **select** de tipo de documento).
- Ver **detalle** de un paciente.
- **Exportar** pacientes creados **después** de una fecha (CSV/XLSX).
- Mostrar errores de negocio (**409 duplicado**) con **PrimeNG Toast** vía **HttpInterceptor**.

---

## 2) Requisitos
- **Node.js 18+**
- **Angular CLI 16** (recomendado):  
  ```bash
  npm i -g @angular/cli@16
  ```
- Backend corriendo en local (ver `apiBaseUrl` en **environments**).

> Nota de compatibilidad: Usa **PrimeNG 16** para Angular 16. Evita PrimeNG 20 (requiere Angular 20).

---

## 3) Instalación
Desde la carpeta del proyecto frontend (por ejemplo `frontend/patients-app`):

```bash
npm install
```

Si necesitas instalar dependencias de UI/exports (por si no las trae):
```bash
npm i primeng@^16 primeicons@^6 primeflex@^3 file-saver xlsx
npm i -D @types/file-saver
```

---

## 4) Configuración (environments)
Edita **`src/environments/environment.ts`** para apuntar al backend:

```ts
export const environment = {
  production: false,
  // Cambia el puerto según tu API real
  apiBaseUrl: 'https://localhost:5074'
};
```

> Recomendado subir un `src/environments/environment.sample.ts` con la misma forma (sin secretos) y que cada dev copie/renombre.

---

## 5) Ejecución
```bash
npm start
# o
ng serve -o
```
- App en `http://localhost:4200`

---

## 6) Pruebas (unitarias)
Ejecutar pruebas unitarias e interfaz de karma:
```bash
ng test 
```

Atajos en `package.json` (sugeridos):
```json
{
  "scripts": {
    "start": "ng serve",
    "test": "ng test",
    "test:once": "ng test --watch=false --browsers=ChromeHeadless",
    "test:cov": "ng test --watch=false --code-coverage --browsers=ChromeHeadless",
    "build": "ng build"
  }
}
```

---

## 7) Funcionalidad implementada

### 7.1 Listado (Patients → ListComponent)
- **Tabla** (`p-table`) con **carga perezosa** (evento `onLazyLoad`).
- Filtros:
  - **Nombre** (contiene en `firstName` / `lastName`).
  - **Número de documento** (igualdad).
- **Paginación server-side**: `page`, `pageSize` (mapeo a la API).
- Acciones: **Nuevo**, **Ver**, **Editar**, **Exportar**.

### 7.2 Formulario (FormComponent)
- **Reactive Forms**.
- **Tipo de documento** como **dropdown** (`p-dropdown`) con opciones típicas: `CC`, `TI`, `CE`, `PA` (editable en el TS).
- **Crear** si no hay `id` en ruta / **Editar** si existe `id` → tras guardar, navega a `/patients`.
- Validaciones mínimas: requeridos y longitudes.

### 7.3 Detalle (DetailComponent)
- Carga por `id` desde la ruta y muestra campos principales.
- Formatea fecha de nacimiento y `createdAt` si se muestran.

### 7.4 Reporte (Exportar)
- Diálogo **Exportar** (fecha mínima requerida).
- Llama a **`GET /api/patients/created-after?date=YYYY-MM-DD`** y exporta:
  - **CSV** (usando `file-saver`).
  - **XLSX** (usando `xlsx` + `file-saver`).

### 7.5 Manejo de errores (Interceptor)
- **409 Conflict** (documento duplicado) → **toast** con `message` y `details[]` de la API.
- Otros errores HTTP muestran un mensaje genérico (configurable).

### 7.6 Formularios reactivos
- Estandariza validaciones, estado y envío; el tipo de documento usa p-dropdown para evitar entradas inválida

---

## 8) Estructura relevante
```
src/app/
  app-routing.module.ts
  app.component.ts / .html            # <p-toast>, <p-confirmDialog>, <router-outlet>

  core/http-error.interceptor.ts      # Manejo de errores

  patients/
    patients-routing.module.ts        # /patients, /patients/new, /patients/:id, /patients/:id/edit
    patients.module.ts                # módulos PrimeNG (Table, Dropdown, Dialog, Toast, etc.)
    patients.service.ts               # HTTP: getPaged, getById, create, update, getCreatedAfter

    pages/
      list/list.component.ts|html     # tabla lazy, filtros, export modal
      form/form.component.ts|html     # formulario reactivo
      detail/detail.component.ts|html # vista de detalle

  shared/export-utils.ts              # helpers CSV/XLSX
```

---

## 9) Tests incluidos (resumen)
- **AppComponent**: render básico con `p-toast`/`p-confirmDialog` y rutas stubs.
- **HttpErrorInterceptor**: 409 → `MessageService.add(...)` y el error se re-emite (para testear el flujo).
- **PatientsService**: arma correctamente **query params** para `GET /api/patients`.
- **ListComponent**: `load(...)` llama al servicio y setea `total/items` (y pasa filtros).
- **FormComponent**: escenarios **crear** (POST) y **editar** (GET+PUT), navegación a `/patients`.
- **Export-utils**: invocación de `saveAs` y generación de planillas.

> Resultado esperado al correr en headless: `TOTAL: 0 FAILED`

---

## 10) Notas finales
- Revisa que las versiones de **PrimeNG/PrimeIcons/PrimeFlex** sean compatibles con Angular 16 (ej.: `primeng@^16`).
- Ajusta `apiBaseUrl` al puerto real del backend (Swagger te muestra las URLs).

---