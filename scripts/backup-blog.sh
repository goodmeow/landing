#!/usr/bin/env bash
# Nightly backup of the Ghost blog: MySQL dump + content directory.
# Installed in crontab; safe to run by hand.
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/home/ubuntu/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
stamp=$(date +%F)
sql_backup="$BACKUP_DIR/blog-${stamp}.sql.gz"
content_backup="$BACKUP_DIR/blog-content-${stamp}.tar.gz"

mkdir -p "$BACKUP_DIR"

docker exec blog_mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --databases "${MYSQL_DATABASE:-ghost}"' \
  | gzip > "$sql_backup"

if [ "$(wc -c < "$sql_backup")" -le 1000 ]; then
  echo "$(date -Is) backup failed: $sql_backup is unexpectedly small" >&2
  exit 1
fi

tar czf "$content_backup" \
  -C /home/ubuntu/blog_data blog_content

find "$BACKUP_DIR" -name 'blog-*.sql.gz' -mtime +"$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -name 'blog-content-*.tar.gz' -mtime +"$RETENTION_DAYS" -delete

echo "$(date -Is) backup ok: $(ls -lh "$sql_backup" | awk '{print $5}')"
