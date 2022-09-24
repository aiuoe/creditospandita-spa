# Creditos Panda

## Instalacion

Ejecutar en una consola `npm install`

## Desarrollo local

Ejecutar `ng serve` para un servidor de desarrollo. Navegar hacia `http://localhost:4200/`.

## Copilacion para produccion

Antes de ejecutar este comando se tiene que revisar y ajustar las rutas bases del environment.prod
Ejecutar `ng build --build-optimizer=false --base-href=/admin/frontend/ --prod`. 
Se creara la carpeta `dist/`. y su contenido se subira al servidor en la carpeta `public_html/admin/frontend/`

## Copilacion para test

Antes de ejecutar este comando se tiene que revisar y ajustar las rutas bases del environment.prod
Ejecutar `ng build --build-optimizer=false --base-href=/admin-test/frontend/ --prod`. 
Se creara la carpeta `dist/`. y su contenido se subira al servidor en la carpeta `public_html/admin-test/frontend/`
