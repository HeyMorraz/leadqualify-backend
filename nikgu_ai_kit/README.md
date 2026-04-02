# nikgu_ai_kit

Stack local con:
- n8n
- PostgreSQL
- Qdrant
- NocoDB

## Requisitos

Tener instalado:
- Docker Desktop
- Docker Compose

## Estructura de la carpeta

```bash
nikgu_ai_kit/
├── .env
├── docker-compose.yml
├── README.md
└── shared/
```

La carpeta `shared/` es opcional,  básicamente es un **directorio compartido entre tu máquina y el contenedor de n8n**.

En tu `docker-compose.yml` tienes esto:

```yaml
volumes:
  - ./shared:/data/shared
```

Eso significa:

* Todo lo que pongas en `nikgu_ai_kit/shared/` en tu computadora
* aparece dentro del contenedor en: `/data/shared`

#### ¿Para qué sirve la carpeta shared en la práctica?

#### 1. Intercambiar archivos con n8n

Puedes:
* subir archivos manualmente (CSV, JSON, imágenes, PDFs)
* procesarlos en workflows de n8n
* guardar resultados

Ejemplo:

* pones `clientes.csv` en `/shared`
* n8n lo lee desde `/data/shared/clientes.csv`

#### 2. Persistencia de archivos fuera de n8n

Aunque n8n guarda cosas internamente, esta carpeta te permite:

* tener control directo desde tu sistema
* versionar archivos (git si quieres)
* inspeccionar outputs fácilmente

#### 3. Integración con otros servicios o scripts

Puedes usarla como “zona de intercambio” entre:

* scripts locales (Python, Node, etc.)
* otros containers (si montas el mismo volumen)
* n8n workflows


#### 4. Casos reales

##### 🔹 AI / embeddings
* guardar documentos antes de vectorizarlos
* exportar chunks procesados

##### 🔹 Automatizaciones
* dumps de datos
* logs procesados
* exports de APIs

##### 🔹 Integraciones
* archivos de entrada/salida entre sistemas

#### Ejemplo rápido

1. Creas archivo:

```bash
nikgu_ai_kit/shared/test.txt
```

2. En n8n usas:

* Read Binary File node
* Path: `/data/shared/test.txt`

3. Lo procesas → guardas resultado:

```bash
/data/shared/output.json
```

Y aparece en tu máquina:

```bash
nikgu_ai_kit/shared/output.json
```

## 1. Configurar el archivo .env

Antes de levantar el stack, abre el archivo .env y cambia estos valores:

```
POSTGRES_PASSWORD
N8N_ENCRYPTION_KEY
N8N_USER_MANAGEMENT_JWT_SECRET
NOCODB_JWT_SECRET
```

Ejemplo:

```
POSTGRES_PASSWORD=mi-password-seguro
N8N_ENCRYPTION_KEY=mi-clave-larga-y-segura
N8N_USER_MANAGEMENT_JWT_SECRET=mi-jwt-secret-largo
NOCODB_JWT_SECRET=mi-nocodb-secret-largo
```

Recomendaciones
- usa valores largos
- evita espacios
- evita comillas innecesarias
- usa letras, números y símbolos
- no reutilices la misma clave para todo

## 2. Cómo generar passwords y tokens seguros

### macOS y Linux (OpenSSL)

Genera una cadena segura de 32 bytes en base64:

```
openssl rand -base64 32
```

Puedes ejecutarlo varias veces para generar valores distintos para:

```
POSTGRES_PASSWORD
N8N_ENCRYPTION_KEY
N8N_USER_MANAGEMENT_JWT_SECRET
NOCODB_JWT_SECRET
```

### Windows (PowerShell)

Genera un token seguro:

```
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 } | ForEach-Object { [byte]$_ }))
```

Puedes correrlo varias veces para generar claves distintas.


## 4. Crear e iniciar los containers

Abre terminal dentro de la carpeta nikgu_ai_kit y ejecuta:

```
docker compose up -d
```

Esto hará:
- crear la red ai_kit
- crear los volúmenes persistentes
- descargar imágenes si no existen
- levantar los containers en segundo plano

Verificar que todo esté corriendo
```
docker compose ps
```
Ver logs
```
docker compose logs -f
```
O de un servicio específico:
```
docker compose logs -f n8n
docker compose logs -f postgres
docker compose logs -f qdrant
docker compose logs -f nocodb
```

## 5. Accesos

### n8n
```
http://localhost:7890
```
### NocoDB
```
http://localhost:8088
```
### Qdrant
```
http://localhost:6444
```
### PostgreSQL

Desde apps como Beekeeper Studio:
```
Host: 127.0.0.1
Puerto: 2345
Database: n8n
Usuario: root
Password: el valor de POSTGRES_PASSWORD en tu .env
```

## 6. Actualizar imágenes o dependencias sin perder información

La información persistente vive en los volúmenes Docker:

```
n8n_ai_kit_storage
postgres_ai_kit_storage
qdrant_ai_kit_storage
nocodb_ai_kit_storage
```

Mientras no elimines los volúmenes, no deberías perder datos.

Actualización recomendada

Primero descarga las últimas imágenes:
```
docker compose pull
```

Luego recrea los containers usando las nuevas versiones:
```
docker compose up -d
```

También puedes forzar recreación:
```
docker compose up -d --force-recreate
```

Ver imágenes descargadas
```
docker images
```

Importante

No uses esto si quieres conservar datos:
```
docker compose down -v
```
Ese comando sí elimina los volúmenes del stack.

## 7. Detener el stack sin borrar datos

```
docker compose down
```

Esto:
- detiene los containers
- elimina la red del compose
- mantiene los volúmenes con toda la información

Luego puedes volver a iniciar todo con:
```
docker compose up -d
```

## 8. Reiniciar el stack
```
docker compose restart
```
O un servicio puntual:
```
docker compose restart n8n
docker compose restart postgres
docker compose restart qdrant
docker compose restart nocodb
```

## 9. Eliminar el stack
Eliminar solo containers y red, conservando datos
```
docker compose down
```

Eliminar containers, red y también los volúmenes
```
docker compose down -v
```
Eso borra la data persistente de:
```
PostgreSQL
n8n
Qdrant
NocoDB
```

Úsalo solo si realmente quieres reiniciar todo desde cero.

## 10. Eliminar imágenes

Si además quieres borrar imágenes descargadas:
```
docker compose down
docker image prune -a
```

Ten cuidado, porque **docker image prune -a** puede borrar imágenes de otros proyectos que no estén en uso.

## 11. Ver volúmenes creados
```
docker volume ls
```

Para inspeccionar uno:
```
docker volume inspect postgres_ai_kit_storage
```

## 12. Ver containers
```
docker ps
```

Ver todos, incluso detenidos:
```
docker ps -a
```

## 13. Notas importantes

### Sobre PostgreSQL

Este stack expone PostgreSQL al host en el puerto 2345, para que puedas conectarte desde Beekeeper Studio u otra herramienta.

### Sobre NocoDB

NocoDB está configurado con almacenamiento persistente en volumen Docker.

### Sobre n8n

n8n usa PostgreSQL como base de datos principal y deja archivos binarios en modo filesystem.

### Sobre cambios en .env

Si cambias puertos o variables importantes, aplica los cambios recreando el stack:
```
docker compose down
docker compose up -d
```

Si cambias passwords o secrets después de haber creado el stack, algunos servicios pueden requerir recreación completa y en ciertos casos podría afectar acceso o sesiones previas. Haz esos cambios con cuidado.

## 14. Comandos rápidos

### Iniciar
```
docker compose up -d
```
### Detener sin borrar datos
```
docker compose down
```
### Actualizar imágenes
```
docker compose pull
docker compose up -d
```
### Ver logs
```
docker compose logs -f
```
### Borrar todo, incluyendo datos
```
docker compose down -v
```

## Nota final
Hay un detalle práctico: en `docker-compose.yml` estás usando `container_name` fi