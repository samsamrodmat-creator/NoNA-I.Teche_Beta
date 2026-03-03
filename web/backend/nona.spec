# -*- mode: python ; coding: utf-8 -*-

import os

block_cipher = None

# Path to the compiled frontend
frontend_dir = os.path.abspath(os.path.join(SPECPATH, '..', 'frontend', 'out'))

# Ensure frontend_dir exists, or PyInstaller will fail
if not os.path.exists(frontend_dir):
    print(f"WARNING: Frontend out directory not found at {frontend_dir}. Make sure to run 'npm run build' first.")

added_files = [
    (frontend_dir, 'out'), # Include the Next.js static export
]

a = Analysis(
    ['run_app.py'],
    pathex=[],
    binaries=[],
    datas=added_files,
    hiddenimports=['uvicorn', 'logic', 'database', 'openpyxl'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['pandas', 'numpy', 'matplotlib', 'scipy', 'psycopg2', 'pytest', 'alembic', 'IPython', 'notebook', 'PyQt5', 'tkinter'],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='NoNA',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True, # Set to False in final version to hide console
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
