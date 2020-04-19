/* eslint no-unused-vars: [ "error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" } ] */
/* eslint no-trailing-spaces: [ "error", { "skipBlankLines": true } ] */

export default function wav(randCurve){
  const littleEndian = new Uint8ClampedArray(new Uint16Array([1]).buffer)[0] === 1,
    arrayTypes = {
      2: Uint16Array,
      4: Uint32Array
    },
    typedNumber = (dataLength, bytes = 4) => {
      const TypedArray = (arrayTypes[bytes] || Uint8ClampedArray),
        array = new Uint8ClampedArray(new TypedArray([dataLength]).buffer);
    
      return littleEndian
        ? array
        : array.reverse();
    },
    toChar = (str) => str.codePointAt(),
    wavProps = {
      channels: 1,
      bytesPerSample: 2,
      sampleRate: 44100
    },
    wavSettings = {
      riff: [..."RIFF"].map(toChar),
      wave: [..."WAVEfmt "].map(toChar),
      fmtLength: typedNumber(16, 4),
      formatTag: typedNumber(1, 2), // PCM
      channels: typedNumber(wavProps.channels, 2),
      sampleRate: typedNumber(wavProps.sampleRate, 4),
      bytesPerSec: typedNumber(wavProps.sampleRate * wavProps.bytesPerSample, 4),
      blockAlign: typedNumber(wavProps.channels * Math.floor((wavProps.bytesPerSample * 8 + 7) / 8), 2),
      bitsPerSample: typedNumber(wavProps.bytesPerSample * 8, 2),
      data: [..."data"].map(toChar)
    },
    wavProp = (prop) => Array.from(wavSettings[prop]),
    lengthPlaceholder = new Array(4).fill(0),
    header = [
      ...wavSettings.riff,
      ...lengthPlaceholder.slice(),
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
      ...lengthPlaceholder.slice()
    ],
    wavFile = new Uint8ClampedArray(wavProps.bytesPerSample * wavProps.channels * randCurve.length + header.length);
  
  wavFile.set(header);
  wavFile.set(typedNumber(wavFile.length - wavSettings.riff.length - lengthPlaceholder.length, lengthPlaceholder.length), wavSettings.riff.length);
  wavFile.set(typedNumber(wavFile.length - header.length, lengthPlaceholder.length), header.length - lengthPlaceholder.length);
  wavFile.set(new Uint8ClampedArray(new Int16Array(randCurve.map((sample) => Math.floor(sample * (2 ** (wavProps.bytesPerSample * 8 - 1))))).buffer), header.length);
  
  return URL.createObjectURL(new Blob([
      wavFile
    ], {
      type: "audio/x-wav"
    }));
}

/*

secs = 20; rate = 0.1; ratio = [5, 8]; hitLength = 1000;
new Audio(wav(Array.from({length: 44100 * secs}, (_, i) => (i % (44100 * (ratio[0] * rate)) <= hitLength ? (i % 150 ? 0.7 : -0.7) : 0)))).play();
new Audio(wav(Array.from({length: 44100 * secs}, (_, i) => (i % (44100 * (ratio[1] * rate)) <= hitLength ? (i % 100 ? 0.7 : -0.7) : 0)))).play();

*/
