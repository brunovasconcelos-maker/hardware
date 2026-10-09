// Each orb's composition (positions, sizes, angles, stops) with colors replaced by slot indices. Slot 0 is the orb's base
// color. 'transparent' stops fade a radial layer out. The themes (themes.js) give every slot its color.
export const ORBS = {
  mic: {
    layers: [
      {type:'radial',at:'100% 0%',size:'75%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'100% 100%',size:'70%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'0% 0%',size:'55%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'linear',angle:'225deg',stops:[[4,'0%'],[5,'30%'],[6,'55%'],[7,'100%']]},
    ],
  },
  tasks: {
    layers: [
      {type:'radial',at:'0% 100%',size:'60%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'95% 20%',size:'55%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'10% 15%',size:'55%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'linear',angle:'180deg',stops:[[4,'0%'],[5,'35%'],[6,'72%'],[7,'100%']]},
    ],
  },
  weather: {
    layers: [
      {type:'radial',at:'30% 18%',size:'45%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'12% 58%',size:'48%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'72% 52%',size:'42%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'radial',at:'88% 18%',size:'40%',stops:[[4,'0%'],['transparent','100%']]},
      {type:'radial',at:'50% 105%',size:'55%',stops:[[5,'0%'],['transparent','100%']]},
    ],
  },
  recording: {
    layers: [
      {type:'radial',at:'5% 88%',size:'75%',stops:[[1,'0%'],[2,'45%'],['transparent','100%']]},
      {type:'radial',at:'70% 108%',size:'38%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'linear',angle:'200deg',stops:[[4,'0%'],[5,'36%'],[6,'46%'],[7,'54%'],[8,'70%'],[9,'100%']]},
    ],
  },
  calendar: {
    layers: [
      {type:'radial',at:'50% 0%',size:'55%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'20% 100%',size:'60%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'90% 60%',size:'45%',stops:[[3,'0%'],['transparent','100%']]},
    ],
  },
  battery: {
    layers: [
      {type:'radial',at:'30% 82%',size:'48%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'70% 45%',size:'36%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'linear',angle:'180deg',stops:[[3,'0%'],[4,'38%'],[5,'58%'],[6,'85%'],[7,'100%']]},
    ],
  },
  clock: {
    layers: [
      {type:'radial',at:'0% 55%',size:'50%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'100% 18%',size:'55%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'78% 108%',size:'55%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'radial',at:'25% 112%',size:'55%',stops:[[4,'0%'],['transparent','100%']]},
      {type:'linear',angle:'180deg',stops:[[5,'0%'],[6,'48%'],[7,'75%'],[8,'100%']]},
    ],
  },
  tasksFull: {
    layers: [
      {type:'radial',at:'0% 50%',size:'45%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'linear',angle:'160deg',stops:[[2,'0%'],[3,'38%'],[4,'58%'],[5,'80%'],[6,'100%']]},
    ],
  },
  weatherFull: {
    layers: [
      {type:'radial',at:'22% 12%',size:'46%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'8% 56%',size:'48%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'76% 50%',size:'38%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'radial',at:'90% 12%',size:'34%',stops:[[4,'0%'],['transparent','100%']]},
      {type:'radial',at:'55% 100%',size:'40%',stops:[[5,'0%'],['transparent','100%']]},
      {type:'radial',at:'100% 90%',size:'34%',stops:[[6,'0%'],['transparent','100%']]},
    ],
  },
  batteryFull: {
    layers: [
      {type:'radial',at:'22% 94%',size:'52%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'88% 42%',size:'38%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'98% 88%',size:'38%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'linear',angle:'150deg',stops:[[4,'0%'],[5,'30%'],[0,'52%'],[6,'75%'],[7,'100%']]},
    ],
  },
  calendarFull: {
    layers: [
      {type:'radial',at:'36% 108%',size:'44%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'14% 96%',size:'40%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'98% 56%',size:'34%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'radial',at:'100% 100%',size:'30%',stops:[[4,'0%'],['transparent','100%']]},
    ],
  },
  clockFull: {
    layers: [
      {type:'radial',at:'0% 50%',size:'46%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'100% 22%',size:'50%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'86% 100%',size:'50%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'radial',at:'25% 112%',size:'55%',stops:[[4,'0%'],['transparent','100%']]},
      {type:'linear',angle:'180deg',stops:[[5,'0%'],[0,'50%'],[6,'62%'],[7,'82%'],[8,'100%']]},
    ],
  },
  digital: {
    layers: [
      {type:'radial',at:'0% 56%',size:'36%',stops:[[1,'0%'],['transparent','100%']]},
      {type:'radial',at:'0% 102%',size:'58%',stops:[[2,'0%'],['transparent','100%']]},
      {type:'radial',at:'56% 108%',size:'40%',stops:[[3,'0%'],['transparent','100%']]},
      {type:'linear',angle:'202deg',stops:[[0,'0%'],[4,'30%'],[5,'45%'],[6,'62%'],[7,'78%'],[8,'100%']]},
    ],
  },
}
