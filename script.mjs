/* eslint no-unused-vars: [ "error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" } ] */
/* eslint no-trailing-spaces: [ "error", { "skipBlankLines": true } ] */

import wav from "./wav.mjs";

const amplitude = (() => {
    const baseAmplitude = 0.4;
    
    return (portion) => {
      if(portion < 0.1){
        return portion * 10 * baseAmplitude;
      }
      else if(portion > 0.9){
        return (portion * -10 + 10) * baseAmplitude;
      }
      
      return baseAmplitude;
    };
  })(),
  sine = (() => {
    const sampleRate = 44100,
      length = 500,
      totalSamples = Math.floor(sampleRate * length / 1000);
    
    return (numerator, denominator) => {
      const frequency = document.getElementById("zeroNote").valueAsNumber * numerator / denominator,
        wave = Array.from({
          length: totalSamples
        }, (_, i) => amplitude(i / totalSamples) * Math.sin(frequency * 2 * Math.PI * i / sampleRate)),
        lastSign = Math.sign(wave[wave.length - 1]);
      
      while(wave.length > 0 && Math.sign(wave[wave.length - 1]) === lastSign){
        wave.pop();
      }
      
      return wave;
    };
  })(),
  ratioSelector = {
    "1": 0,
    "-1": 1
  },
  aggregateRatio = (ratio, {dataset: {base}, value: exponent}) => {
    const exponentSign = Math.sign(exponent);
    
    if(ratioSelector.hasOwnProperty(exponentSign)){
      ratio[ratioSelector[exponentSign]] *= base ** Math.abs(exponent);
    }
    
    return ratio;
  },
  getRatio = () => Array.from(document.querySelectorAll("sup > input[type=number]")).reduce(aggregateRatio, [
    1,
    1
  ]),
  createExponentMultiplier = (value) => {
    const exponent = document.createElement("sup"),
      power = document.createElement("span");
    
    exponent.appendChild(Object.assign(document.createElement("input"), {
      type: "number",
      value: "0",
      step: "1",
      size: "3"
    })).dataset.base = value;
    power.append(`× ${value}`, exponent);
    
    return [
      " ",
      power
    ];
  },
  generateIntervals = () => {
    const primes = [
        2,
        3,
        5,
        7,
        11,
        13,
        17,
        19,
        23,
        29
      ];
    
    document.getElementById("intervals")
      .append("Interval ratio: 1", ...primes.flatMap(createExponentMultiplier));
  };

document.getElementById("play").addEventListener("click", () => new Audio(wav(sine(...getRatio()))).play());
document.getElementById("intervals").addEventListener("change", () => {
  const ratio = getRatio(),
    [
      numerator,
      denominator
    ] = ratio,
    frequencyString = (document.getElementById("zeroNote").valueAsNumber * numerator / denominator).toFixed(3);
  
  document.getElementById("play").value = `▶ Play: ${ratio.join("/")} (${frequencyString} Hz)`;
});

generateIntervals();
