"""Restore audited, previously published static assets absent from the upstream source."""
from pathlib import Path
from zipfile import ZipFile

root = Path(__file__).resolve().parent.parent
output = (root / 'dist').resolve()
with ZipFile(root / 'src/preserved-publications/assets.zip') as archive:
    for item in archive.infolist():
        target = (output / item.filename).resolve()
        if not target.is_relative_to(output) or item.is_dir():
            raise ValueError('Invalid retained asset path')
        if target.exists() and target.read_bytes() != archive.read(item):
            raise ValueError('Retained asset conflicts with a generated file: ' + item.filename)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(archive.read(item))
    print(f'Restored {len(archive.infolist())} audited static assets.')
