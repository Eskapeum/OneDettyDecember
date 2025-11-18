// Mock implementation for auth library
export const register = jest.fn()
export const login = jest.fn()
export const oauthLogin = jest.fn()
export const googleOAuth = jest.fn()
export const facebookOAuth = jest.fn()
export const requestPasswordReset = jest.fn()
export const resetPassword = jest.fn()
export const verifyEmail = jest.fn()
export const resendVerification = jest.fn()
export const logout = jest.fn()
export const getCurrentUser = jest.fn()
export const refreshToken = jest.fn()

// Reset all mocks
export const resetAllMocks = () => {
  register.mockReset()
  login.mockReset()
  oauthLogin.mockReset()
  googleOAuth.mockReset()
  facebookOAuth.mockReset()
  requestPasswordReset.mockReset()
  resetPassword.mockReset()
  verifyEmail.mockReset()
  resendVerification.mockReset()
  logout.mockReset()
  getCurrentUser.mockReset()
  refreshToken.mockReset()
}
