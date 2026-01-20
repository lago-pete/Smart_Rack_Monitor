import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      appTitle: "Smart Rack Monitor",
      
      nav: {
        profile: "Profile",
        logout: "Logout"
      },
      
      sidebar: {
        home: "Home",
        reports: "Reports",
        deviceConfig: "Configuration"
      },
      
      auth: {
        login: "Login",
        register: "Register",
        email: "Email",
        password: "Password",
        name: "Name",
        loginButton: "Sign In",
        registerButton: "Register",
        forgotPassword: "Forgot your password?",
        resetPassword: "Reset Password",
        noAccount: "Don't have an account?",
        haveAccount: "Already have an account?",
        loginHere: "Sign in here",
        registerHere: "Sign Up",
        createAccount: "Create Account",
        sendInstructions: "Send Instructions",
        backToLogin: "Back to Login",
        resetPasswordTitle: "Reset Password",
        resetPasswordDesc: "Enter your email and we'll send you instructions",
        registrationSuccess: "Registration successful.",
        registrationError: "Registration error. Please try again.",
        loginFailed: "Login failed. Please check your credentials."
      },
      
      home: {
        noDevices: "No devices found",
        alertHighTemp: "Alert: High temperature",
        alertHighHumidity: "Alert: High humidity",
        alertDoorOpen: "Alert: Door open"
      },
      
      dashboard: {
        loading: "Loading...",
        temperature: "Temperature",
        humidity: "Humidity",
        door: "Door",
        doorOpen: "Open",
        doorClosed: "Closed",
        temperatureHistory: "Temperature History",
        humidityHistory: "Humidity History",
        recentData: "Recent Data Received",
        timestamp: "Timestamp",
        doorStatus: "Door Status"
      },
      
      reports: {
        title: "Reports",
        generate: "Generate Report",
        startDate: "Start Date",
        endDate: "End Date",
        selectRange: "Select a date range to generate the report"
      },
      
      profile: {
        title: "User Profile",
        personalInfo: "Personal Information",
        updateInfo: "Update your personal information",
        name: "Name",
        email: "Email",
        changePassword: "Change Password",
        currentPassword: "Current Password",
        newPassword: "New Password",
        saveChanges: "Save Changes"
      },
      
      deviceConfig: {
        title: "Device Configuration",
        deviceParams: "Device Parameters",
        configureParams: "Configure device parameters",
        deviceId: "Device ID",
        deviceName: "Device Name",
        location: "Location",
        otaUpdate: "OTA Update",
        updateFirmware: "Update device firmware",
        firmwareFile: "Firmware File",
        updateFirmwareButton: "Update Firmware",
        saveConfig: "Save Configuration"
      },
      
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        close: "Close"
      }
    }
  },
  
  es: {
    translation: {
      appTitle: "Monitor de Rack Inteligente",
      
      nav: {
        profile: "Perfil",
        logout: "Cerrar Sesión"
      },
      
      sidebar: {
        home: "Inicio",
        reports: "Reportes",
        deviceConfig: "Configuración"
      },
      
      auth: {
        login: "Iniciar Sesión",
        register: "Registrarse",
        email: "Correo Electrónico",
        password: "Contraseña",
        name: "Nombre",
        loginButton: "Iniciar Sesión",
        registerButton: "Registrarse",
        forgotPassword: "¿Olvidaste tu contraseña?",
        resetPassword: "Restablecer Contraseña",
        noAccount: "¿No tienes cuenta?",
        haveAccount: "¿Ya tienes cuenta?",
        loginHere: "Inicia sesión aquí",
        registerHere: "Inicia Sesión",
        createAccount: "Crear Cuenta",
        sendInstructions: "Enviar Instrucciones",
        backToLogin: "Volver al Inicio de Sesión",
        resetPasswordTitle: "Recuperar Contraseña",
        resetPasswordDesc: "Ingresa tu correo electrónico y te enviaremos las instrucciones",
        registrationSuccess: "Registro exitoso.",
        registrationError: "Error en el registro. Por favor, inténtalo de nuevo.",
        loginFailed: "Inicio de sesión fallido. Por favor verifica tus credenciales."
      },
      
      home: {
        noDevices: "No se encontraron dispositivos",
        alertHighTemp: "Alerta: Alta temperatura",
        alertHighHumidity: "Alerta: Alta humedad",
        alertDoorOpen: "Alerta: Puerta abierta"
      },
      
      dashboard: {
        loading: "Cargando...",
        temperature: "Temperatura",
        humidity: "Humedad",
        door: "Puerta",
        doorOpen: "Abierta",
        doorClosed: "Cerrada",
        temperatureHistory: "Histórico de Temperatura",
        humidityHistory: "Histórico de Humedad",
        recentData: "Últimos Datos Recibidos",
        timestamp: "Timestamp",
        doorStatus: "Estado Puerta"
      },
      
      reports: {
        title: "Reportes",
        generate: "Generar Reporte",
        startDate: "Fecha Inicio",
        endDate: "Fecha Fin",
        selectRange: "Selecciona un rango de fechas para generar el reporte"
      },
      
      profile: {
        title: "Perfil de Usuario",
        personalInfo: "Información Personal",
        updateInfo: "Actualiza tu información personal",
        name: "Nombre",
        email: "Correo Electrónico",
        changePassword: "Cambiar Contraseña",
        currentPassword: "Contraseña Actual",
        newPassword: "Nueva Contraseña",
        saveChanges: "Guardar Cambios"
      },
      
      deviceConfig: {
        title: "Configuración de Dispositivos",
        deviceParams: "Parámetros del Dispositivo",
        configureParams: "Configura los parámetros del dispositivo",
        deviceId: "ID del Dispositivo",
        deviceName: "Nombre del Dispositivo",
        location: "Ubicación",
        otaUpdate: "Actualización OTA",
        updateFirmware: "Actualiza el firmware del dispositivo",
        firmwareFile: "Archivo de Firmware",
        updateFirmwareButton: "Actualizar Firmware",
        saveConfig: "Guardar Configuración"
      },
      
      common: {
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        edit: "Editar",
        add: "Agregar",
        close: "Cerrar"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    debug: false,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;