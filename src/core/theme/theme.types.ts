/**
 * @fileoverview Theme Types - Core Theme System Types
 * 
 * ✅ ENTERPRISE THEME SYSTEM:
 * - Typography definitions
 * - Color system with semantic naming
 * - Spacing scale system
 * - Component styling interfaces
 */

export interface Theme {
  colors: {
    primary: {
      main: string;
      light: string;
      dark: string;
      contrast: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrast: string;
    };
    surface: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };
    border: {
      default: string;
      light: string;
      dark: string;
      focus: string;
    };
    background: {
      primary: string;
      secondary: string;
      overlay: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
  
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    body1: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    body2: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
    };
  };
  
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
} 