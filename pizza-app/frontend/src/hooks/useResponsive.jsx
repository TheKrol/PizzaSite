import { useEffect, useState } from "react"

const useResponsive =(minWidth) => {
    const [windowState, setWindowState] = useState({
        windowWidth: window.innerWidth,
        isDesiredWidth: false,
    });
    useEffect(() => {
        const resizing = () => {
            const currentWidth = window.innerWidth;
            const isDesiredWidth = currentWidth < minWidth;
            setWindowState({windowWidth: currentWidth, isDesiredWidth});
        };
        window.addEventListener('resize', resizing);
        return () => window.removeEventListener('resize', resizing)
    }, [windowState.windowWidth]);
    return windowState.isDesiredWidth;
}

export default useResponsive;