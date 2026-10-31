# Aplicación JSONPlaceholder - Cards y ventana flotante

## Funcionalidad
La aplicación consulta publicaciones y usuarios de JSONPlaceholder. Cada tarjeta muestra el post y el usuario relacionado. Al pulsar una tarjeta se abre una ventana flotante (modal) con:

- id
- name
- username
- email
- phone
- website

## Endpoints utilizados
- https://jsonplaceholder.typicode.com/posts
- https://jsonplaceholder.typicode.com/users

## Ejecución
Abrir `index.html` mediante un servidor local. Por ejemplo:

```bash
python -m http.server 5500
```

Luego entrar a:
`http://localhost:5500`

Para generar una captura sin conexión externa:
`http://localhost:5500/?demo=1`

El modo normal consulta directamente la API de JSONPlaceholder.
