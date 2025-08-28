declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      url?: string;
      loading?: 'lazy' | 'eager';
      'data-quality'?: 'low' | 'medium' | 'high';
      onError?: () => void;
      spline?: {
        renderer?: {
          setPixelRatio: (ratio: number) => void;
        };
      };
      play?: () => void;
      pause?: () => void;
    };
  }
}

declare interface Window {
  customElements: CustomElementRegistry;
}