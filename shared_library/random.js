
// randn_bm(0,1,0.1) averages 0.93
// randn_bm(0,1,0.25) averages 0.84
// randn_bm(0,1,0.5) averages 0.70
// randn_bm(0,1,1) averages 0.50
// randn_bm(0,1,2) averages 0.26
// randn_bm(0,1,3) averages 0.14
// randn_bm(0,1,4) averages 0.079
function randn_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}

// re-tries below 0.25 and above 0.75
// expands min/max between 0.25 and 0.75 box-muller range.
// chance of being close to min/max is around 2%.
function narrow_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 0.75 || num < 0.25) 
    num = randn_bm(min, max, skew) // resample outside of 0.25 and 0.75 range
  else{
    num = num * 2 - 0.5; // Translate (0.25 -> 0.75) range to (0 -> 1) range
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}

// pyrmaid shaped
function twoDice(min, max) {
  const base = (Math.random() + Math.random()) / 2;
  return base * (max - min) + min;
}

// similar to narrow_bm
function threeDice(min, max) {
  const base = (Math.random() + Math.random() + Math.random()) / 3;
  return base * (max - min) + min;
}

module.exports = {
  bm: randn_bm,
  nbm: narrow_bm,
  r: (min, max) => Math.random() * (max - min) + min,
  r2: twoDice,
  r3: threeDice
}