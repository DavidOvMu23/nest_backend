export const jwtConstants = {
  secret:
    process.env.JWT_SECRET ||
    'tu-clave-secreta-super-segura-cambiar-en-produccion',
};
