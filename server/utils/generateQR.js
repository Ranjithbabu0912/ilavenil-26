import QRCode from "qrcode";

export const generateAttendanceQR = async (payload) => {
    return await QRCode.toDataURL(JSON.stringify(payload));
};
