import type {CSSProperties,ReactNode} from 'react';
import type {Appearance} from '@/lib/appearance';

export default function SectionAppearance({appearance,children}:{appearance?:Appearance;children:ReactNode}){
 const a=appearance;
 if(!a||!Object.values(a).some(Boolean))return <>{children}</>;
 const style={'--section-background':a.background||undefined,'--section-text':a.text||undefined,'--section-button':a.button||undefined,'--section-button-text':a.buttonText||undefined} as CSSProperties;
 return <div className="custom-section" style={style} data-background={!!a.background} data-text={!!a.text} data-button={!!a.button} data-button-text={!!a.buttonText}>{children}</div>;
}
