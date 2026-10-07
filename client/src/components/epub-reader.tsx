import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from 'cn';
import { type Rendition } from 'epubjs';
import { useEffect, useRef, useState } from 'react';
import { ReactReader, ReactReaderStyle, type IReactReaderStyle } from 'react-reader';
import { useTheme, type Theme } from './theme-provider';

type Props = {
  epubBuffer: ArrayBuffer;
  className?: string;
}

function updateTheme(rendition: Rendition, theme: Theme, isMobile = false) {
  const themes = rendition.themes
  switch (theme) {
    case 'dark': {
      themes.override('color', 'oklch(0.985 0 0)');
      themes.override('background', 'oklch(0.141 0.005 285.823)');
      if (isMobile) themes.override('font-size', '14px');
      break;
    }
    case 'light': {
      themes.override('color', 'oklch(0.141 0.005 285.823)');
      themes.override('background', 'oklch(1 0 0)');
      themes.override('font-size', '10px');
      if (isMobile) themes.override('font-size', '14px');
      break;
    }
  }
}

const EpubReader = ({ epubBuffer, className }: Props) => {
  const [location, setLocation] = useState<string | number>(0);
  const rendition = useRef<Rendition | undefined>(undefined)
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (rendition.current) {
      updateTheme(rendition.current, theme, isMobile);
    }
  }, [theme, isMobile])

  return (
    <div className={cn('text-xs', className)}>
      <ReactReader
        url={epubBuffer}
        location={location}
        locationChanged={(epubcfi: string) => setLocation(epubcfi)}
        readerStyles={theme === 'dark' ? darkReaderTheme : lightReaderTheme}
        getRendition={(_rendition) => {
          updateTheme(_rendition, theme, isMobile)
          rendition.current = _rendition
        }}
      />
    </div>
  )
}

const lightReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
  arrow: {
    ...ReactReaderStyle.arrow,
    color: 'oklch(0.141 0.005 285.823)',
  },
}

const darkReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: 'white',
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: '#ccc',
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: 'oklch(0.141 0.005 285.823)',
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: '#ccc',
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: '#111',
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: '#222',
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: '#fff',
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: 'white',
  },
}

export default EpubReader;