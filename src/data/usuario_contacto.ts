// IDs de contactos externos (creados por ContactoEmergenciaSeeder): 1-5
//   1 → Marta Ruiz García      (hija de José)
//   2 → Carlos González Pérez  (hijo de María)
//   3 → Sofía Quintana Torres  (hija de Dolores)
//   4 → Ramón Vega Llopis      (vecino de Eduardo)
//   5 → Isabel López Herrera   (médica de Antonio)
//
// IDs de contactos de usuarios (creados por UsuarioSeed, en orden del array):
//   6 → Carmen Rodríguez Sanz  (11111111A)
//   7 → José Martínez Ruiz     (22222222B)
//   8 → María González López   (33333333C)
//   9 → Dolores Quintana Lara  (44444444D)
//  10 → Eduardo Iglesias Vela  (55555555E)
//  11 → Felisa Maroto Pina     (66666666F)
//  12 → Antonio López García   (77777777G)
//  13 → Laura Rodríguez Pérez  (88888888H)
//  14 → Pedro Martínez Gómez   (99999999J)
//  15 → Beatriz Fernández Luna (10101010K)
export default [
  {
    usuario: '11111111A', // Carmen Rodríguez Sanz
    contactos: [13, 12], // Laura (hija, usuario), Antonio (esposo, usuario)
  },
  {
    usuario: '22222222B', // José Martínez Ruiz
    contactos: [1, 14], // Marta Ruiz (hija, externa), Pedro (hijo, usuario)
  },
  {
    usuario: '55555555E', // Eduardo Iglesias Vela
    contactos: [4], // Ramón Vega (vecino, externo)
  },
  {
    usuario: '77777777G', // Antonio López García
    contactos: [6, 5], // Carmen Rodríguez (esposa, usuario), Isabel López (médica, externa)
  },
  {
    usuario: '33333333C', // María González López
    contactos: [2], // Carlos González (hijo, externo)
  },
  {
    usuario: '44444444D', // Dolores Quintana Lara
    contactos: [3], // Sofía Quintana (hija, externa)
  },
];
