
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
    background_image?: {
        url: string;
        id: number;
        size: string;
        alt: string;
        source: string;
    }
    background_position?: string;
    background_repeat?: string;
    background_size?: string;
    background_attachment?: string;
    margin?: {
      unit: string;
      top: string;
      right: string;
      bottom: string;
      left: string;
      isLinked: boolean;
    };
    padding?: {
      // Estrutura para padding
    };
    // Outras propriedades...
  }