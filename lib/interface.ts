export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface PageSettings {
  background_background?: string;
  background_color?: string;
  background_color_b?: string;
  background_position?: string;
  background_repeat?: string;
  background_size?: string;
  background_attachment?: string;
  background_gradient_type?: string;
  background_gradient_angle?: {
    unit?: string;
    size?: number;
    sizes?: [];
  };
  background_color_stop?: {
    unit?: string;
    size?: number;
    sizes?: [];
  };
  background_image?: {
    url: string;
    source: string;
  };  
  margin?: {
    unit: string;
    top: string;
    right: string;
    bottom: string;
    left: string;
    isLinked: boolean;
  };
  padding?: {
    unit?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    isLinked?: boolean;
  };
  // Outras propriedades...
}
