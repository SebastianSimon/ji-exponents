# Just Intonation audio player using exponents, _or:_ the most cumbersome musical instrument

Try it here: https://sebastiansimon.github.io/ji-exponents/

## Just Intonation

In music theory, just intonation (JI) refers to musical intervals obtained from multiplying a base frequency by (simple) ratios.
In contrast, equal temperament (ET) equally divides an interval (like the octave) into a fixed number of equal steps.

Given an interval of two notes, mathematically speaking, the frequency of one note can be obtained by multiplying it by some factor of the frequency of the other note.
In ET these factors are almost all irrational; for example, an equal tempered fifth in 12 equal divisions of the octave (12-EDO) has a factor of 2<sup>7/12</sup> ≈ 1.4983070768766815; only octaves are exactly _times 2_.
In JI, however, the perfect fifth has a factor of exactly 3/2 = 1.5.

Here’s [a table of some common intervals][wiki] on Wikipedia.

And here’s [an extended table of intervals][huygens-fokker].

### 5-limit tuning

The twelve different notes used in western music can all be obtained by multiplying or dividing frequencies by positive integers _up to 5_.
Only the prime numbers 2, 3, and 5 are necessary (since 4 = 2 · 2).

This audio player has powers with bases up to 29 (currently), so it’s 29-limit JI.

## How it works

### 1. Choose a base frequency

440 Hz is the note A<sub>4</sub>.

### 2. Multiply the frequency by choosing exponents

For example you can enter a different integer at 2<sup><kbd>0</kbd></sup>, or increase it to make it 2<sup><kbd>1</kbd></sup>, 2<sup><kbd>2</kbd></sup>, or decrease it to make it 2<sup><kbd>-1</kbd></sup>, 2<sup><kbd>-2</kbd></sup>, etc.

### 3. Play the note

Click the <kbd>▶ Play</kbd> button to play the note.

The button also shows the resulting frequency.



  [wiki]: https://en.wikipedia.org/wiki/Music_and_mathematics#Just_tunings
  [huygens-fokker]: http://www.huygens-fokker.org/docs/intervals.html
