#!/usr/bin/env bash
# Nightly backup of the Ghost blog: MySQL dump + content directory.
# Installed in crontab; safe to run by hand.
set -eu

BACKUP_DIR="${BACKUP_DIR:-/home/ubuntu/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
stamp=$(date +%F)

mkdir -p "$BACKUP_DIR"

docker exec blog_mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --databases ghost' \
  | gzip > "$BACKUP_DIR/blog-${stamp}.sql.gz"

tar czf "$BACKUP_DIR/blog-content-${stamp}.tar.gz" \
  -C /home/ubuntu/blog_data blog_content

find "$BACKUP_DIR" -name 'blog-*.sql.gz' -mtime +"$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -name 'blog-content-*.tar.gz' -mtime +"$RETENTION_DAYS" -delete

echo "$(date -Is) backup ok: $(ls -lh "$BACKUP_DIR/blog-${stamp}.sql.gz" | awk '{print $5}')"
