const Random = require("./random");
const Climber = require("../model/climberSchema");

const minutesPerTick = 3;
const maxDays = 7;
const maxTicks = Math.floor(60*24*maxDays/minutesPerTick);

const minStayMinutes = 10;
const maxStayMinutes = 60 * 3;
const stayMinutesDelta = maxStayMinutes - minStayMinutes;

const dailyChangeFactor = 0.05;
const ticksPerDay = 24 * 60 / minutesPerTick;
const tickChangeFactor = dailyChangeFactor / ticksPerDay;

function calculateVisitCount(profile, plot, occupancy) {
  // Around -0.02 to -0.09 range
  const wealthFactor = -(2 - plot.areaWealth) * 0.0529;

  // Around 0.05 to 4.5 range (max reduces with higher wealth to compensate for higher daypass price).
  const costFactor = 3.38*Math.exp(wealthFactor*plot.dayPass)/(plot.areaWealth*0.5+0.5);

  // Around 1 for 100 pop, 10 for 10k pop, 80 for 1M pop, 150 for 4M pop.
  const populationFactor = 0.168*Math.pow(plot.areaPopulation,0.447);

  const maxOccupancy = plot.maxRoutes * 2;

  // 0 at 100%, 0.5 at 50%, 1 at 0%
  const occupancyFactor = 1 - occupancy / maxOccupancy;

  // averages around 40
  const visitationFactor = populationFactor * costFactor * occupancyFactor;

  // ideally should add about 10 climbers per hour.
  const visitsPerHour = visitationFactor / 4;

  let visits = 0;
  let visitsPerTick = visitsPerHour / 60 * minutesPerTick;

  // Not likely to happen, but allow chance for multiple visitors in this case.
  while (visitsPerTick >= 0.5) {
    if (Math.random() < 0.5)
      visits++;

    visitsPerTick -= 0.5;
  }

  if (Math.random() < visitsPerTick) 
    visits++;

  return (visits >= maxOccupancy) ? maxOccupancy : visits;
}

function buildClimbers(currentTime, numberOfClimbers, profile, plot) {
  newClimbers = [];
  for (let i = 0; i < numberOfClimbers; i++) {
    const leaveTime = new Date(currentTime.getTime() + (Math.random() * stayMinutesDelta + minStayMinutes) * 60 * 1000);
    const climber = new Climber({
      plotID: plot._id,
      serverID: profile.serverID,
      userID: profile.userID,
      visitTime: currentTime,
      leaveTime: leaveTime
    });

    newClimbers.push(climber);
  }

  return newClimbers;
}

function firstTickOfDay(time) {
  const exactMinutes = time.getHours() * 60 + time.getMinutes() + time.getSeconds() / 60 + time.getMilliseconds() / (60 * 1000);
  return exactMinutes < minutesPerTick;
}

// returns an array of two arrays, the first one for true matches, the first one for false matches.
function partition(array, condition) {
  const trueMatches = [];
  const falseMatches = [];
  for (const element of array) {
    condition(element) ? trueMatches.push(element) : falseMatches.push(element);
  }

  return [trueMatches, falseMatches];
}

function randomChange(originalAmount, fraction) {
  const min = originalAmount - originalAmount * fraction;
  const max = originalAmount + originalAmount * fraction;
  return Random.r3(min, max);
}

async function updatePlot(profile, plot) {
  if (!plot) return;

  let climbers = await Climber.find({ plotID: plot._id }).exec();

  const minutes = (new Date().getTime() - profile.lastSync.getTime()) / (60 * 1000);
  let ticks = Math.floor(minutes / minutesPerTick);

  if (ticks <= 0) return;
  if (ticks > maxTicks) ticks = maxTicks;

  let lastTime = new Date(profile.lastSync.getTime());

  for (let tick = 1; tick <= ticks; tick++) {
    const time = new Date(profile.lastSync.getTime() + tick * minutesPerTick * 60 * 1000);

    plot.areaPopulation = randomChange(plot.areaPopulation, tickChangeFactor);
    plot.areaWealth = randomChange(plot.areaWealth, tickChangeFactor);

    [removedClimbers, climbers] = partition(climbers, (climber) => climber.leaveTime <= time);
    removedClimbers.forEach((climber) => climber.remove());

    const newVisitCount = calculateVisitCount(profile, plot, climbers.length);
    const newClimbers = buildClimbers(time, newVisitCount, profile, plot);
    climbers = climbers.concat(newClimbers);

    if (firstTickOfDay(time)) {
      plot.yesterdayIncome = plot.todayIncome;
      plot.todayIncome = 0;
      plot.yesterdayVisits = plot.todayVisits;
      plot.todayVisits = 0;
    }

    plot.todayVisits += newVisitCount;
    plot.todayIncome += newVisitCount * plot.dayPass;
    profile.money += newVisitCount * plot.dayPass;
    lastTime = time;
  }

  plot.occupancy = climbers.length;
  plot.areaPopulation = Math.ceil(plot.areaPopulation);
  profile.lastSync = lastTime;

  plot.save();
  profile.save();
  for (const climber of climbers) {
    if (climber.isNew) await climber.save();
  }
}

module.exports = {
  updatePlot: updatePlot
};