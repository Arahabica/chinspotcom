if [ -z "$1" ]; then
    echo "Usage: $0 <target directory>" 1>&2
    exit 1
fi

target_dir="$1"


for file in public/images/${target_dir}/*.{jpg,png}; do
    # Get image width using identify command
    width=$(identify -format "%w" "$file")
    
    # Only process if width is greater than 800
    if [ $width -gt 800 ]; then
        filename=$(basename "$file")
        basename="${filename%.*}"
        convert "$file" -resize 800x -quality 94 "$(dirname "$file")/${basename}_800x.webp"
        # 元のファイルを削除
        rm "$file"
    fi
done