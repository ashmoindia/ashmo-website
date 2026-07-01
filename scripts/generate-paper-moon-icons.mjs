import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let value = n;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const name = Buffer.from(type);
  const size = Buffer.alloc(4);
  size.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([size, name, data, checksum]);
};

const drawIcon = (size, { maskable = false } = {}) => {
  const rows = [];
  const center = size / 2;
  const radius = size * (maskable ? 0.22 : 0.286);
  const crescentShift = radius * 0.53;

  for (let y = 0; y < size; y += 1) {
    const row = Buffer.alloc(1 + size * 4);
    for (let x = 0; x < size; x += 1) {
      const offset = 1 + x * 4;
      const edge = Math.min(x, y, size - 1 - x, size - 1 - y) / size;
      const skyGlow = Math.max(0, 1 - Math.hypot(x - size * 0.68, y - size * 0.24) / (size * 0.82));
      let red = Math.round(7 + 25 * skyGlow);
      let green = Math.round(7 + 34 * skyGlow);
      let blue = Math.round(17 + 57 * skyGlow);

      if (!maskable && edge < 0.04) {
        const corner = Math.hypot(
          Math.max(0, size * 0.12 - Math.min(x, size - 1 - x)),
          Math.max(0, size * 0.12 - Math.min(y, size - 1 - y)),
        );
        if (corner > size * 0.115) {
          row[offset + 3] = 0;
          continue;
        }
      }

      const moonDistance = Math.hypot(x - center, y - center);
      const cutDistance = Math.hypot(x - (center - crescentShift), y - (center - radius * 0.05));
      if (moonDistance <= radius && cutDistance > radius * 0.96) {
        const light = Math.max(0, Math.min(1, 1 - moonDistance / radius));
        red = Math.round(205 + light * 39);
        green = Math.round(207 + light * 37);
        blue = Math.round(229 + light * 22);
      }

      row[offset] = red;
      row[offset + 1] = green;
      row[offset + 2] = blue;
      row[offset + 3] = 255;
    }
    rows.push(row);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  return png;
};

writeFileSync('public/pm/icons/icon-192.png', drawIcon(192));
writeFileSync('public/pm/icons/icon-512.png', drawIcon(512));
writeFileSync('public/pm/icons/icon-maskable-512.png', drawIcon(512, { maskable: true }));
