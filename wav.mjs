/* eslint no-unused-vars: [ "error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" } ] */
/* eslint no-trailing-spaces: [ "error", { "skipBlankLines": true } ] */

export default function wav(waveData){
  const littleEndian = new Uint8ClampedArray(new Uint16Array([
      1
    ]).buffer)[0] === 1,
    arrayTypes = {
      2: Uint16Array,
      4: Uint32Array
    },
    typedNumber = (dataLength, bytes = 4) => {
      const TypedArray = arrayTypes[bytes] ?? Uint8ClampedArray,
        array = new Uint8ClampedArray(new TypedArray([
          dataLength
        ]).buffer);
    
      return littleEndian
        ? array
        : array.reverse();
    },
    toChar = (str) => str.codePointAt(),
    wavProps = {
      channels: 1,
      bytesPerSample: 2,
      sampleRate: 44100,
      formats: {
        PCM: 1
      }
    },
    wavSettings = {
      riff: Array.from("RIFF", toChar),
      wave: Array.from("WAVEfmt ", toChar),
      fmtLength: typedNumber(16, 4),
      formatTag: typedNumber(wavProps.formats.PCM, 2),
      channels: typedNumber(wavProps.channels, 2),
      sampleRate: typedNumber(wavProps.sampleRate, 4),
      bytesPerSec: typedNumber(wavProps.sampleRate * wavProps.bytesPerSample, 4),
      blockAlign: typedNumber(wavProps.channels * Math.floor((wavProps.bytesPerSample * 8 + 7) / 8), 2),
      bitsPerSample: typedNumber(wavProps.bytesPerSample * 8, 2),
      data: Array.from("data", toChar)
    },
    wavProp = (prop) => Array.from(wavSettings[prop]),
    lengthPlaceholder = new Array(4).fill(0),
    header = [
      ...wavSettings.riff,
      ...lengthPlaceholder,
      ...[
        "wave",
        "fmtLength",
        "formatTag",
        "channels",
        "sampleRate",
        "bytesPerSec",
        "blockAlign",
        "bitsPerSample",
        "data"
      ].flatMap(wavProp),
      ...lengthPlaceholder
    ],
    wavFile = new Uint8ClampedArray(wavProps.bytesPerSample * wavProps.channels * waveData.length + header.length);
  
  wavFile.set(header);
  wavFile.set(typedNumber(wavFile.length - wavSettings.riff.length - lengthPlaceholder.length, lengthPlaceholder.length), wavSettings.riff.length);
  wavFile.set(typedNumber(wavFile.length - header.length, lengthPlaceholder.length), header.length - lengthPlaceholder.length);
  wavFile.set(new Uint8ClampedArray(new Int16Array(waveData.map((sample) => Math.floor(sample * (2 ** (wavProps.bytesPerSample * 8 - 1))))).buffer), header.length);
  
  return URL.createObjectURL(new Blob([
      wavFile
    ], {
      type: "audio/x-wav"
    }));
}
