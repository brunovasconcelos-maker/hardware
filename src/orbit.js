// Shared orbit geometry for the rest screen, derived from the Figma frame (650x650).
// Widget centers in Figma: Usage (529,325), Calendário (429,505), Bateria (225,505),
// Hora (121,325), Tarefas (225,145), Clima (429,145); microphone at (325,325).
// Angles are clockwise from the +x axis (screen coordinates), atan2(dy, dx) of those centers.
// Distances from the microphone range 204–208px, so one shared radius (206) is used;
// each widget ends up at most 2px from its Figma position.
export const ORBIT_RADIUS = 206

export const ORBIT_ANGLES = {
  usage: 0,
  calendar: 60,
  battery: 119.05,
  clock: 180,
  tasks: 240.95,
  weather: 300,
}

export const WIDGET_SIZE = 180
