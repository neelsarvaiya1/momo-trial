import os
import shutil
import subprocess
import glob

# Safe relative paths with environment variable overrides
brain_dir = os.environ.get("SOURCE_ASSETS_DIR", os.path.join(os.getcwd(), "source_assets"))
assets_dir = os.environ.get("TARGET_ASSETS_DIR", os.path.join(os.getcwd(), "public", "assets"))
os.makedirs(assets_dir, exist_ok=True)

# Mapping of prefix in source directory to desired filename in assets_dir
mapping = {
    "steamed_veg_momos": "steamed-veg-momos.webp",
    "steamed_chicken_momos": "steamed-chicken-momos.webp",
    "fried_momos": "fried-momos.webp",
    "tandoori_momos": "tandoori-momos.webp",
    "paneer_momos": "paneer-momos.webp",
    "chilli_momos": "chilli-momos.webp",
    "fried_chicken_momos": "fried-chicken-momos.webp",
    "signature_momo": "signature-momo.webp",
    "social_momos_01": "social-momos-01.webp",
    "social_momos_02": "social-momos-02.webp",
    "social_momos_03": "social-momos-03.webp",
    "social_momos_04": "social-momos-04.webp",
}

cwebp_bin = shutil.which("cwebp") or "cwebp"

for prefix, target_name in mapping.items():
    matches = glob.glob(os.path.join(brain_dir, f"{prefix}*.jpg"))
    if not matches:
        continue
    matches.sort(key=os.path.getmtime, reverse=True)
    src_file = matches[0]
    dest_file = os.path.join(assets_dir, target_name)
    
    cmd = [cwebp_bin, "-q", "85", "-m", "4", src_file, "-o", dest_file]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    size_kb = os.path.getsize(dest_file) / 1024
    print(f"Converted {src_file} -> {dest_file} ({size_kb:.1f} KB)")

print("Conversion check complete.")
