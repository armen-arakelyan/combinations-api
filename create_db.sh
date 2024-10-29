#!/bin/bash

# Check if mysql is available
if ! command -v mysql &> /dev/null; then
    echo "mysql command could not be found. Please ensure MySQL is installed and available in your PATH."
    exit 1
fi

# Database configuration
DB_HOST="${DB_HOST:-localhost}"
DB_NAME="${DB_NAME:-combination_db}"
DB_USER="${DB_USER:-root}"

# Prompt for password if not set in environment
if [ -z "$DB_PASS" ]; then
    read -sp "Enter MySQL password for user '$DB_USER': " DB_PASS
    echo
fi

# SQL commands to create the database and tables
SQL_COMMANDS="
DROP DATABASE IF EXISTS \`$DB_NAME\`;
CREATE DATABASE \`$DB_NAME\`;
USE \`$DB_NAME\`;

CREATE TABLE items (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(10) NOT NULL
);

CREATE TABLE combinations (
    id CHAR(36) PRIMARY KEY,
    combination JSON NOT NULL
);

CREATE TABLE responses (
    id CHAR(36) PRIMARY KEY,
    combination_id CHAR(36),
    FOREIGN KEY (combination_id) REFERENCES combinations(id) ON DELETE CASCADE
);
"

# Execute SQL commands to create the database and tables
echo "Setting up the database..."

# Attempt to use mysql_config_editor login path, fallback to username and password if not set
if mysql --login-path=local -e "SELECT 1;" 2>/dev/null; then
    mysql --login-path=local -e "$SQL_COMMANDS"
else
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "$SQL_COMMANDS"
fi

# Notify user of completion
echo "Database '$DB_NAME' and tables created successfully."
