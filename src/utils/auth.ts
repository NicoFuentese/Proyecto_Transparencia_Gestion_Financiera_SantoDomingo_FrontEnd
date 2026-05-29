/**
 * Utilidades de Autenticación JWT Simulada
 * Portal de Transparencia Municipal - Santo Domingo
 *
 * NOTA: Esta es una implementación SIMULADA para demostración.
 * En producción, debe conectarse a un backend real con:
 * - JWT firmado con clave secreta
 * - Contraseñas encriptadas con bcrypt
 * - Validación en servidor
 */

interface AuthPayload {
  email: string;
  role: string;
  exp: number;
  iat: number;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Simula el login con JWT
 * Valida que el email termine en @santodomingo.cl
 */
export const login = (email: string, password: string): LoginResponse => {
  // Validación básica
  if (!email || !password) {
    return { success: false, error: "Email y contraseña son requeridos" };
  }

  if (password.length < 6) {
    return { success: false, error: "La contraseña debe tener al menos 6 caracteres" };
  }

  // Validar dominio municipal
  if (!email.endsWith("@santodomingo.cl")) {
    return {
      success: false,
      error: "Solo funcionarios municipales pueden acceder (correo @santodomingo.cl)",
    };
  }

  // Crear payload del token
  const now = Date.now();
  const payload: AuthPayload = {
    email,
    role: "admin", // En producción, esto vendría del backend según permisos
    iat: now,
    exp: now + 3600000, // Expira en 1 hora
  };

  // Simular JWT (en producción usar jsonwebtoken con firma)
  const mockJWT = btoa(JSON.stringify(payload));

  // Guardar en localStorage (en producción usar httpOnly cookies)
  localStorage.setItem("auth_token", mockJWT);
  localStorage.setItem("user_email", email);

  return { success: true, token: mockJWT };
};

/**
 * Cierra la sesión del usuario
 */
export const logout = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_email");
};

/**
 * Verifica si el usuario está autenticado
 * Valida que el token exista y no haya expirado
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return false;
  }

  try {
    const payload: AuthPayload = JSON.parse(atob(token));

    // Verificar expiración
    if (payload.exp < Date.now()) {
      logout();
      return false;
    }

    return true;
  } catch (error) {
    // Token inválido
    logout();
    return false;
  }
};

/**
 * Obtiene la información del usuario autenticado
 */
export const getUserInfo = (): AuthPayload | null => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return null;
  }

  try {
    return JSON.parse(atob(token));
  } catch (error) {
    return null;
  }
};

/**
 * Obtiene el email del usuario autenticado
 */
export const getUserEmail = (): string | null => {
  return localStorage.getItem("user_email");
};

/**
 * Verifica si el token está por expirar (menos de 5 minutos)
 */
export const isTokenExpiringSoon = (): boolean => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return false;
  }

  try {
    const payload: AuthPayload = JSON.parse(atob(token));
    const fiveMinutes = 5 * 60 * 1000;

    return payload.exp - Date.now() < fiveMinutes;
  } catch (error) {
    return false;
  }
};
