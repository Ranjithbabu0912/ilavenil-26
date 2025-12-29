import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

const StyledQR = ({ data }) => {
    const ref = useRef(null);

    useEffect(() => {
        const qr = new QRCodeStyling({
            width: 280,
            height: 280,
            type: "svg",
            data,
            image: "/event-logo.png", // center logo
            dotsOptions: {
                color: "#1e40af", // event blue
                type: "dots",
            },
            cornersSquareOptions: {
                type: "dot",
                color: "#1e40af",
            },
            cornersDotOptions: {
                type: "classy-rounded",
                color: "#1e40af",
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 6,
            },
            qrOptions: {
                errorCorrectionLevel: "H",
            },
        });

        ref.current.innerHTML = "";
        qr.append(ref.current);
    }, [data]);

    return <div ref={ref} />;
};

export default StyledQR;
