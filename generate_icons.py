from PIL import Image, ImageDraw, ImageFont
import os
import math

APP_DIR = "/Users/meydivyansh/Desktop/Bday/kartik-scrapbook-app"

def create_master_icon(size=1024):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Rounded background with warm gradient
    corner_radius = size // 5
    
    # Draw gradient rectangle
    for y in range(size):
        ratio = y / size
        # #6c1d28 to #97472e
        r = int(108 + (151 - 108) * ratio)
        g = int(29 + (71 - 29) * ratio)
        b = int(40 + (46 - 40) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    
    # Create mask for rounded corners
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=corner_radius, fill=255)
    img.putalpha(mask)
    
    draw = ImageDraw.Draw(img)
    
    # Inner elegant border
    border_inset = size // 20
    draw.rounded_rectangle(
        [(border_inset, border_inset), (size - border_inset, size - border_inset)],
        radius=corner_radius - border_inset//2,
        outline=(244, 234, 225, 120),
        width=max(2, size // 80)
    )
    
    # Draw Heart in center
    cx, cy = size // 2, size // 2 - size // 30
    h_size = size // 3
    
    # Draw heart shape
    points = []
    for t in [i * 0.02 for i in range(315)]:
        x = 16 * (math.sin(t) ** 3)
        y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        px = cx + x * (h_size / 17)
        py = cy + y * (h_size / 17)
        points.append((px, py))
    
    draw.polygon(points, fill=(255, 218, 214, 245))
    
    # Draw small ribbon / washi tape accent across top
    tape_w, tape_h = size // 2, size // 14
    tape_x = cx - tape_w // 2
    tape_y = size // 10
    draw.rectangle([(tape_x, tape_y), (tape_x + tape_w, tape_y + tape_h)], fill=(228, 186, 156, 180))
    
    return img

def create_round_icon(size=1024):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    for y in range(size):
        ratio = y / size
        r = int(108 + (151 - 108) * ratio)
        g = int(29 + (71 - 29) * ratio)
        b = int(40 + (46 - 40) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([(0, 0), (size, size)], fill=255)
    img.putalpha(mask)
    
    draw = ImageDraw.Draw(img)
    draw.ellipse([(size//25, size//25), (size - size//25, size - size//25)], outline=(244, 234, 225, 120), width=max(2, size // 80))
    
    cx, cy = size // 2, size // 2 - size // 30
    h_size = size // 3
    points = []
    for t in [i * 0.02 for i in range(315)]:
        x = 16 * (math.sin(t) ** 3)
        y = -(13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t))
        px = cx + x * (h_size / 17)
        py = cy + y * (h_size / 17)
        points.append((px, py))
    draw.polygon(points, fill=(255, 218, 214, 245))
    return img

def main():
    print("Generating native App Icons...")
    master = create_master_icon(1024)
    master_round = create_round_icon(1024)
    
    # Save master
    os.makedirs(f"{APP_DIR}/resources", exist_ok=True)
    master.save(f"{APP_DIR}/resources/icon.png")
    
    # Android Mipmap sizes
    android_sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192
    }
    
    for folder, s in android_sizes.items():
        dirpath = f"{APP_DIR}/android/app/src/main/res/{folder}"
        os.makedirs(dirpath, exist_ok=True)
        master.resize((s, s), Image.Resampling.LANCZOS).save(f"{dirpath}/ic_launcher.png")
        master_round.resize((s, s), Image.Resampling.LANCZOS).save(f"{dirpath}/ic_launcher_round.png")
        master.resize((s, s), Image.Resampling.LANCZOS).save(f"{dirpath}/ic_launcher_foreground.png")
        print(f"  ✓ Saved Android {folder} ({s}x{s})")
        
    # iOS AppIcon
    ios_icon_dir = f"{APP_DIR}/ios/App/App/Assets.xcassets/AppIcon.appiconset"
    if os.path.exists(ios_icon_dir):
        master.resize((1024, 1024), Image.Resampling.LANCZOS).save(f"{ios_icon_dir}/AppIcon-512@2x.png")
        print(f"  ✓ Saved iOS Master AppIcon (1024x1024)")
        
    print("App icon generation complete!")

if __name__ == "__main__":
    main()
