#!/bin/bash

echo ">>>>>>>>> Iniciando recuperação do banco >>>>>>>>>"

if [ -f "/backup/backup.sql" ]; then
    psql -U postgres -d postgres -a < /backup/backup.sql

    echo ">>>>>>>>> Recuperação do banco finalizada >>>>>>>>>"
else
    echo ">>>>>>>>> Arquivo de backup não encontrado. Recuperação do banco cancelada >>>>>>>>>"
fi