# treeDir2

Короткое описание: отображение изменений на серверной стороне в онлайн-режиме в структуре файлов и папок. в API отображаются все изменения, открытых на текущий момент директориях (удаление, добавление, переименование). В основном окне отображаются только папки. В виджете отображаются папки и файлы выбранной директории

1. склонируйте репозиторий к себе в рабочую папку.
2. установите node.js 
3. запустите консоль.
4. в консоли перейдите в директорию с склонированным репозиторием (в корневой каталог с файлом index.js)
5. запустите приложение командой - node index.js. (не запускайте проект через nodemon! - при использовании nodemon, при удалении файлов или директорий с сервера - сервер останавливается)
6. При необходимости можно изменить localhost. Файл с url - './public/js/url.js'



p.s. Работа с директориями, поддерикториями  и файлами реализована во всех уровнях, кроме верхнего, т.е. в корневом каталоге, где хранятся директории  - public, node_modules и app_modules добавление, удаление и перименование не предосмутрено. Во всех остальных каталогах вниз по дереву можно выполнять все три вида операций. 



