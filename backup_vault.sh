#!/bin/bash
# Backup script for Obsidian Vault

# Set backup directory (default: parent directory of the vault)
BACKUP_DIR="../Obsidian_Vault_Backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/vault_backup_${TIMESTAMP}.zip"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Creating backup of current directory..."
echo "Destination: $BACKUP_FILE"

# Zip the current directory contents, excluding .git and other hidden files if preferred
# Here we exclude .git folder to save space, but include everything else
zip -r -q "$BACKUP_FILE" . -x "*.git*"

if [ $? -eq 0 ]; then
    echo "Backup created successfully!"
else
    echo "Backup failed!"
    exit 1
fi
