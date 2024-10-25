#!/bin/bash

# Function to validate version number format
validate_version() {
    if [[ ! $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "Error: Version must be in format X.Y.Z (e.g., 1.0.0)"
        exit 1
    fi
}

# Function to get the current date from date.txt
get_current_date() {
    if [ ! -f "date.txt" ]; then
        echo "Error: date.txt not found. Please run the script that generates it first."
        exit 1
    fi
    cat date.txt
}

# Function to extract latest changes from CHANGELOG.md
get_latest_changes() {
    # Extract content between the first two ## headers, skip the version line
    awk '/^## \[/{p++;next} p==1{print}' CHANGELOG.md | \
    awk 'NF' | \
    sed 's/^### /\n### /' | \
    awk 'NF' # Remove empty lines
}

# Function to update version in package files
update_version() {
    local new_version=$1
    local date=$(get_current_date)
    
    # Update CHANGELOG.md
    sed -i "0,/\[.*\]/s/\[.*\]/[$new_version] - $date/" CHANGELOG.md

    # If package.json exists in annotation service, update it
    if [ -f "services/annotation-service/package.json" ]; then
        sed -i "s/\"version\": \".*\"/\"version\": \"$new_version\"/" services/annotation-service/package.json
    fi

    # If version.go exists in rtsp server, update it
    if [ -f "services/rtsp-server/version.go" ]; then
        sed -i "s/const Version = \".*\"/const Version = \"$new_version\"/" services/rtsp-server/version.go
    fi
}

# Function to create git tag and push changes
tag_and_push() {
    local new_version=$1
    local base_message=$2
    local changes=$(get_latest_changes)
    
    # Prepare commit message with version and latest changes
    local commit_message="chore: bump version to $new_version

$changes

$base_message"

    # Stage changes
    git add CHANGELOG.md
    git add services/annotation-service/package.json 2>/dev/null || true
    git add services/rtsp-server/version.go 2>/dev/null || true

    # Commit changes with the full message
    git commit -m "$commit_message"

    # Create and push tag with the same message
    git tag -a "v$new_version" -m "$commit_message"
    
    echo "Changes committed and tagged as v$new_version"
    echo "Run 'git push && git push --tags' to push changes to remote repository"
}

# Main script
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <version> <message>"
    echo "Example: $0 1.0.0 'Initial release'"
    exit 1
fi

NEW_VERSION=$1
MESSAGE=$2

# Validate version format
validate_version "$NEW_VERSION"

# Ensure we're in the project root
if [ ! -f "CHANGELOG.md" ]; then
    echo "Error: Must be run from project root directory"
    exit 1
fi

# Update version in files
update_version "$NEW_VERSION"

# Create git tag and commit changes
tag_and_push "$NEW_VERSION" "$MESSAGE"

echo "Version update complete!"
echo "Don't forget to push your changes:"
echo "git push && git push --tags"
