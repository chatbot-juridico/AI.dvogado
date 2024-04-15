#!/bin/bash

echo ">>>>>>>>> Iniciando backup do banco >>>>>>>>>"

pg_dump -U postgres -d postgres -c > /backup/backup.sql

echo ">>>>>>>>> Backup do banco finalizado >>>>>>>>>"