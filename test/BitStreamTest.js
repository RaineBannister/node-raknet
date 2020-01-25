const assert = require('assert');
const BitStream = require('../BitStream');

describe('BitStream', () => {
    describe('constructor', () => {
        it('should set the internal values properly if no Buffer passed', () => {
            let stream = new BitStream();
            assert.equal(stream._byteCount, 0);
        });
        it('should set the internal values properly if a Buffer is passed', () => {
            let stream = new BitStream(Buffer.alloc(10));
            assert.equal(stream._byteCount, 10);
        });
    });
    describe('length', () => {
        it('should return the length of the Buffer', () => {
            let stream = new BitStream();
            assert.equal(stream.length(), 0);
            stream = new BitStream(Buffer.alloc(10));
            assert.equal(stream.length(), 10);
        });
    });
    describe('writeBit', () => {
        it('should only accept boolean variables', () => {
            let stream = new BitStream();
            let func = () => {stream.writeBit(1)};
            assert.throws(func);
            func = () => {stream.writeBit(true)};
            assert.doesNotThrow(func);
        });
        it('should write a binary one to a position on the stream', () => {
            let stream = new BitStream(Buffer.alloc(1));
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(0), 0x80);
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(0), 0xC0);
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(0), 0xE0);
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(0), 0xF0);
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(0), 0xF8);
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(0), 0xFC);
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(0), 0xFE);
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(0), 0xFF);
        });
        it('should move on to the next byte if we are at the end of this byte', () => {
            let stream = new BitStream(Buffer.alloc(1));
            assert.equal(stream.data.readUInt8(0), 0);
            stream.writeBit(true);
            stream.writeBit(true);
            stream.writeBit(true);
            stream.writeBit(true);
            stream.writeBit(true);
            stream.writeBit(true);
            stream.writeBit(true);
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(0), 0xFF);
            stream.writeBit(true);
            assert.equal(stream.data.readUInt8(1), 0x80);
        });
    });
    describe('writeBits', () => {
        it('should write a number of any size to the stream', () => {
            let stream = new BitStream(Buffer.alloc(1));
            stream.writeBits(0x0E, 4);
            assert.equal(stream.data.readUInt8(0), 0xE0);
            stream.writeBits(0x09, 4);
            assert.equal(stream.data.readUInt8(0), 0xE9);
        });
    });
    describe('writeByte', () => {
        it('should write a byte to the stream', () => {
            let stream = new BitStream(Buffer.alloc(1));
            stream.writeByte(0xAA);
            assert.equal(stream.data.readUInt8(0), 0xAA);
        });
    });
    describe('writeByteOffset', () => {
        it('should write a byte in any place little-endian', () => {
            let stream = new BitStream(Buffer.alloc(1));
            stream.writeByteOffset(0xAA, 0);
            assert.equal(stream.data.readUInt8(0), 0xAA);
            stream.writeByteOffset(0xAA, 2);
            assert.equal(stream.data.readUInt8(2), 0xAA);
        });
    });
    describe('writeBoolean', () => {
        it('should write a boolean', () => {
            let stream = new BitStream(Buffer.alloc(1));
            stream.writeBoolean(true);
            assert.equal(stream.data.readUInt8(0), 0x01);
            stream.writeBoolean(false);
            assert.equal(stream.data.readUInt8(1), 0x00);
        });
    });
    describe('writeChar', () => {
        it('should write a character', () => {
            let stream = new BitStream(Buffer.alloc(1));
            stream.writeChar(0xAA);
            assert.equal(stream.data.readUInt8(0), 0xAA);
        });
    });
    describe('writeShort', () => {
        it('should write a short', () => {
            let stream = new BitStream(Buffer.alloc(2));
            stream.writeShort(0xAAAA);
            assert.equal(stream.data.readUInt8(0), 0xAA);
            assert.equal(stream.data.readUInt8(1), 0xAA);
        });
    });
    describe('writeLong', () => {
        it('should write a long', () => {
            let stream = new BitStream(Buffer.alloc(4));
            stream.writeLong(0xAAAAAAAA);
            assert.equal(stream.data.readUInt8(0), 0xAA);
            assert.equal(stream.data.readUInt8(1), 0xAA);
            assert.equal(stream.data.readUInt8(2), 0xAA);
            assert.equal(stream.data.readUInt8(3), 0xAA);
        });
    });
    describe('writeLongLong', () => {
        it('should write a long long', () => {
            let stream = new BitStream(Buffer.alloc(8));
            stream.writeLongLong(0xAAAAAAAA, 0xBBBBBBBB);
            //console.log(stream.toBinaryString());
            assert.strictEqual(stream.data.readUInt8(0), 0xBB);
            assert.strictEqual(stream.data.readUInt8(1), 0xBB);
            assert.strictEqual(stream.data.readUInt8(2), 0xBB);
            assert.strictEqual(stream.data.readUInt8(3), 0xBB);
            assert.strictEqual(stream.data.readUInt8(4), 0xAA);
            assert.strictEqual(stream.data.readUInt8(5), 0xAA);
            assert.strictEqual(stream.data.readUInt8(6), 0xAA);
            assert.strictEqual(stream.data.readUInt8(7), 0xAA);
        });
    });
    describe('writeFloat', () => {
        it('should write a float', () => {
            let stream = new BitStream(Buffer.alloc(4));
            stream.writeFloat(3.14);
            assert.equal(stream.data.readUInt8(0), 0xc3);
            assert.equal(stream.data.readUInt8(1), 0xf5);
            assert.equal(stream.data.readUInt8(2), 0x48);
            assert.equal(stream.data.readUInt8(3), 0x40);
        });
    });

    describe('bits', () => {
        it('should return the proper number of bits', () => {
            let stream = new BitStream();
            stream.writeLong(8);
            assert.equal(stream.bits(), 4 * 8);
            stream.writeBit(false);
            assert.equal(stream.bits(), (4 * 8) + 1);
        });
    });
    describe('allRead', () => {
        it('should return true if we are at the end of the stream', () => {
            let stream = new BitStream();
            stream.writeLong(0);
            stream.readLong();
            assert.equal(stream.allRead(), true);
        });
        it('should return false if we aren\'t at the end of the stream', () => {
            let stream = new BitStream();
            stream.writeLong(0);
            assert.equal(stream.allRead(), false);
        });
    });
    describe('readBit', () => {
        it('should read a bit from the stream', () => {
            let stream = new BitStream();
            stream.writeBit(false);
            assert.equal(stream.readBit(), false);
            stream.writeBit(true);
            assert.equal(stream.readBit(), true);
        });
    });
    describe('readBits', () => {
        it('should read bits from the stream', () => {
            let stream = new BitStream();
            stream.writeShort(0xAAAA);
            assert.equal(stream.readBits(16), 0xAAAA);
        });
    });
    describe('readBitsReversed', () => {
        it('should read the bits in reverse order', () => {
            let stream = new BitStream();
            stream.writeShort(0xAAAA);
            assert.equal(stream.readBitsReversed(16), 0x5555);
        });
    });
    describe('concat', () => {
        it('should concat two bitstreams', () => {
            let stream = new BitStream();
            stream.writeByte(0x55);

            let streamTwo = new BitStream();
            streamTwo.writeByte(0xFF);

            stream.concat(streamTwo);

            assert.strictEqual(stream.readShort(), 0xFF55);
        })
    })
});