#!/bin/bash

while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ $line == *=* ]] && [[ ! $line == \#* ]]; then
        key="${line%%=*}" # Get everything before the first '='
        secret_key="${key^^}" # Convert to uppercase

        # Check if the variable is set in the GitHub Actions environment
        if secret_value=$(printenv "$secret_key"); then
            echo "Processing: $secret_key" # Debugging line
            # Use a more robust sed command to replace the value
            sed -i "s|^\($key=\).*|\1\"$secret_value\"|" .env
        else
            echo "Skipping: $secret_key (not set in GitHub Actions environment)"
        fi
    fi
done < .env
